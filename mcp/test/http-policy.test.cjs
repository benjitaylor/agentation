const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const directory = mkdtempSync(join(tmpdir(), 'agentation-http-policy-'));
process.env.AGENTATION_TEST_DB_PATH = join(directory, 'test.db');
const { startHttpServer, setCloudApiKey, setHttpBaseUrl } = require('../.test-dist/http-entry.js');
after(() => rmSync(directory, { recursive: true, force: true }));
async function server(t, origins = 'https://app.example.test') {
  const previous = process.env.AGENTATION_CORS_ORIGINS;
  if (origins === null) delete process.env.AGENTATION_CORS_ORIGINS;
  else process.env.AGENTATION_CORS_ORIGINS = origins;
  const http = startHttpServer(0);
  if (previous === undefined) delete process.env.AGENTATION_CORS_ORIGINS;
  else process.env.AGENTATION_CORS_ORIGINS = previous;
  await once(http, 'listening');
  t.after(async () => { http.closeAllConnections(); await new Promise(resolve => http.close(resolve)); });
  return `http://127.0.0.1:${http.address().port}`;
}
async function request(base, path, init = {}) {
  return fetch(base + path, { ...init, headers: { Origin: 'https://app.example.test', ...init.headers } });
}
test('attribute-only selections accept an empty string comment and preserve identifiers', async t => {
  const base = await server(t);
  const post = body => ({ method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  const session = await (await request(base, '/sessions', post({url:'http://selection.localhost'}))).json();
  const payload = {x:10,y:20,comment:'',element:'button',elementPath:'button[data-qa="checkout"]',timestamp:Date.now(),attributes:{'data-qa':'checkout'}};
  const saved = await request(base, `/sessions/${session.id}/annotations`, post(payload));
  assert.equal(saved.status,201);
  assert.deepEqual((await saved.json()).attributes,payload.attributes);
  for (const comment of [undefined,null,42]) {
    const invalid = await request(base, `/sessions/${session.id}/annotations`, post({...payload,comment}));
    assert.equal(invalid.status,400); await invalid.text();
  }
});
test('restricted CORS applies to normal, error, preflight and MCP responses', async t => {
  const base = await server(t);
  for (const [path, method] of [['/health','GET'],['/sessions','GET'],['/missing','GET'],['/mcp','GET'],['/mcp','OPTIONS']]) {
    const response = await request(base, path, { method });
    assert.equal(response.headers.get('access-control-allow-origin'), 'https://app.example.test', path);
    assert.match(response.headers.get('vary'), /Origin/i);
    await response.text();
  }
  const preflight = await request(base, '/mcp', { method:'OPTIONS', headers:{'Access-Control-Request-Headers':'MCP-Protocol-Version, Last-Event-ID'} });
  assert.match(preflight.headers.get('access-control-allow-headers'), /MCP-Protocol-Version/i);
  assert.match(preflight.headers.get('access-control-allow-headers'), /Last-Event-ID/i);
});
test('disallowed origins are rejected before session mutations', async t => {
  const base = await server(t);
  const before = await (await fetch(base + '/sessions')).json();
  for (const origin of ['https://app.example.test.evil.test','null','https://other.test']) {
    const response = await request(base, '/sessions', { method:'POST', headers:{Origin:origin,'Content-Type':'application/json'}, body:JSON.stringify({url:'http://blocked.localhost'}) });
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('access-control-allow-origin'), null);
    await response.text();
  }
  const after = await (await fetch(base + '/sessions')).json();
  assert.deepEqual(after, before);
});
test('restricted CORS covers global and per-session event streams', async t => {
  const base = await server(t);
  const session = await (await request(base, '/sessions', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:'http://stream.localhost'})})).json();
  for (const path of ['/events',`/sessions/${session.id}/events`]) {
    const controller = new AbortController();
    const response = await request(base, path, { signal: controller.signal });
    assert.equal(response.headers.get('access-control-allow-origin'), 'https://app.example.test');
    assert.match(response.headers.get('content-type'), /event-stream/);
    controller.abort();
  }
});
test('default policy allows dev-server origins, rejects public ones and keeps origin-free clients', async t => {
  const base = await server(t, null);
  for (const origin of ['http://localhost:3000', 'http://myapp.localhost:1355', 'http://127.0.0.1:5173', 'http://192.168.1.20:3000', 'https://app.test']) {
    const ok = await fetch(base + '/sessions', { headers: { Origin: origin } });
    assert.equal(ok.status, 200, origin);
    assert.equal(ok.headers.get('access-control-allow-origin'), origin);
    await ok.text();
  }
  for (const origin of ['https://evil.example', 'null', 'http://example.com']) {
    const denied = await fetch(base + '/sessions', { headers: { Origin: origin } });
    assert.equal(denied.status, 403, origin); await denied.text();
  }
  const bare = await fetch(base + '/sessions');
  assert.equal(bare.status, 200); assert.equal(bare.headers.get('access-control-allow-origin'), null); await bare.text();
});
test('MCP initialize and session deletion retain the same CORS policy', async t => {
  const base = await server(t);
  const response = await request(base, '/mcp', {
    method:'POST', headers:{'Content-Type':'application/json',Accept:'application/json, text/event-stream'},
    body:JSON.stringify({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'local-policy-test',version:'1'}}}),
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://app.example.test');
  const sessionId = response.headers.get('mcp-session-id');
  assert.ok(sessionId);
  assert.match(await response.text(), /protocolVersion/);
  const deleted = await request(base, '/mcp', {method:'DELETE',headers:{'Mcp-Session-Id':sessionId}});
  assert.equal(deleted.status, 204);
  assert.equal(deleted.headers.get('access-control-allow-origin'), 'https://app.example.test');
});

test('real HTTP action returns while its webhook is pending, then retries once', { timeout: 3000 }, async t => {
  const { createServer } = require('node:http');
  let firstResponse, firstArrived, delivered;
  const first = new Promise(resolve => { firstArrived = resolve; });
  const complete = new Promise(resolve => { delivered = resolve; });
  const received = [];
  const receiver = createServer((req,res) => {
    let body='';req.on('data',chunk=>body+=chunk);req.on('end',()=>{
      received.push({body,id:req.headers['x-agentation-delivery-id']});
      if(received.length===1){firstResponse=res;firstArrived();}
      else {res.writeHead(200);res.end();delivered();}
    });
  }).listen(0,'127.0.0.1');
  await once(receiver,'listening');
  t.after(async()=>{receiver.closeAllConnections();await new Promise(resolve=>receiver.close(resolve));});
  const hook=`http://127.0.0.1:${receiver.address().port}/hook`;
  const vars={AGENTATION_WEBHOOK_URL:hook,AGENTATION_WEBHOOKS:hook,AGENTATION_WEBHOOK_BASE_DELAY_MS:'5',AGENTATION_WEBHOOK_MAX_DELAY_MS:'10',AGENTATION_WEBHOOK_TIMEOUT_MS:'1000'};
  const previous=Object.fromEntries(Object.keys(vars).map(k=>[k,process.env[k]]));Object.assign(process.env,vars);
  t.after(()=>{for(const [k,v] of Object.entries(previous)){if(v===undefined)delete process.env[k];else process.env[k]=v;}});
  const base=await server(t);
  const session=await(await request(base,'/sessions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:'http://webhook-flow.localhost'})})).json();
  const action=request(base,`/sessions/${session.id}/action`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({output:'Local retry test'})});
  await first;
  const response=await action;
  assert.equal(response.status,200);
  assert.equal((await response.json()).delivered.webhooks,1);
  firstResponse.writeHead(503);firstResponse.end();
  await complete;
  assert.equal(received.length,2);
  assert.ok(received[0].id);
  assert.deepEqual(received[0],received[1]);
});
test('health reports the local store, and omits it in cloud mode', async t => {
  const base = await server(t);
  assert.deepEqual(await (await request(base, '/health')).json(), { status:'ok', mode:'local', store:'sqlite' });
  setCloudApiKey('local-test-only');
  t.after(() => setCloudApiKey(undefined));
  assert.deepEqual(await (await request(base, '/health')).json(), { status:'ok', mode:'cloud' });
});
test('CORS remains local when JSON and SSE are proxied to cloud', async t => {
  const base = await server(t);
  const originalFetch = global.fetch;
  t.mock.method(global, 'fetch', (url, init) => String(url).startsWith('https://agentation-mcp-cloud.vercel.app/')
    ? Promise.resolve(new Response(String(url).endsWith('/events') ? ': connected\n\n' : '{}', { headers:{'Content-Type':String(url).endsWith('/events') ? 'text/event-stream' : 'application/json'} }))
    : originalFetch(url, init));
  setCloudApiKey('local-test-only');
  t.after(() => setCloudApiKey(undefined));
  for (const path of ['/sessions','/events']) {
    const response = await request(base,path);
    assert.equal(response.headers.get('access-control-allow-origin'), 'https://app.example.test');
    await response.text();
  }
});

test('loopback-only default rejects foreign Host headers and keeps local ones', async t => {
  const base = await server(t, null);
  const port = new URL(base).port;
  // fetch() does not forward a custom Host header, so use node:http directly.
  const status = host => new Promise((resolve, reject) => {
    const req = require('node:http').request({ host: '127.0.0.1', port, path: '/health', headers: { Host: host } }, res => { res.resume(); res.on('end', () => resolve(res.statusCode)); });
    req.on('error', reject); req.end();
  });
  for (const host of [`localhost:${port}`, `127.0.0.1:${port}`, `[::1]:${port}`, `myapp.localhost:${port}`]) assert.equal(await status(host), 200, host);
  for (const host of ['evil.example', `evil.example:${port}`, '10.0.0.5:4747']) assert.equal(await status(host), 403, host);
});

test('deleting an MCP session aborts its in-flight tool call', { timeout: 8000 }, async t => {
  const base = await server(t);
  setHttpBaseUrl(base);
  const listeners = async () => (await (await request(base, '/status')).json()).agentListeners;
  const until = async (predicate, ms) => { const end = Date.now() + ms; while (Date.now() < end) { if (await predicate()) return true; await new Promise(r => setTimeout(r, 50)); } return predicate(); };
  const init = await request(base, '/mcp', {
    method:'POST', headers:{'Content-Type':'application/json',Accept:'application/json, text/event-stream'},
    body:JSON.stringify({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'abort-test',version:'1'}}}),
  });
  const sessionId = init.headers.get('mcp-session-id'); await init.text();
  const baseline = await listeners();
  // Watch a fresh session so pending notes from earlier tests cannot satisfy the call immediately.
  const fresh = await (await request(base, '/sessions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({url:'http://abort.localhost'}) })).json();
  await (await request(base, '/mcp', { method:'POST', headers:{'Content-Type':'application/json',Accept:'application/json, text/event-stream','Mcp-Session-Id':sessionId}, body:JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'}) })).text();
  const call = request(base, '/mcp', {
    method:'POST', headers:{'Content-Type':'application/json',Accept:'application/json, text/event-stream','Mcp-Session-Id':sessionId},
    body:JSON.stringify({jsonrpc:'2.0',id:2,method:'tools/call',params:{name:'agentation_watch_annotations',arguments:{sessionId:fresh.id,timeoutSeconds:30}}}),
  }).then(r => r.text().catch(() => 'closed'), () => 'closed');
  // The watch subscribes to the server's agent event stream while it waits.
  assert.ok(await until(async () => (await listeners()) === baseline + 1, 3000), 'watch never subscribed');
  const deleted = await request(base, '/mcp', {method:'DELETE',headers:{'Mcp-Session-Id':sessionId}});
  assert.equal(deleted.status, 204);
  // Closing the session must cancel the tool call, which releases its subscription.
  assert.ok(await until(async () => (await listeners()) === baseline, 1500), 'watch kept its event subscription after its session was deleted');
  await call;
  // The finished call must not put the closed transport back into the session map.
  const stale = await request(base, '/mcp', { method:'DELETE', headers:{'Mcp-Session-Id':sessionId} });
  assert.equal(stale.status, 404, 'deleted session was reinserted by its in-flight request'); await stale.text();
});
