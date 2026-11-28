const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const bundle = JSON.stringify(require.resolve('../.test-dist/integration.js'));

function storeKind(t, env, prepare = () => {}) {
  const home = mkdtempSync(join(tmpdir(), 'agentation-store-kind-'));
  t.after(() => rmSync(home, { recursive: true, force: true }));
  prepare(home);
  const child = spawnSync(process.execPath, ['-e', `const s=require(${bundle});process.stdout.write(s.getStoreKind());s.getStore().close?.()`], {
    env: { ...process.env, HOME: home, USERPROFILE: home, AGENTATION_STORE: '', ...env },
    timeout: 5000,
  });
  assert.equal(child.status, 0, child.error?.message || child.stderr.toString());
  return { kind: child.stdout.toString(), stderr: child.stderr.toString() };
}

test('a working SQLite store reports sqlite', t => {
  assert.equal(storeKind(t, {}).kind, 'sqlite');
});

test('AGENTATION_STORE=memory reports memory', t => {
  assert.equal(storeKind(t, { AGENTATION_STORE: 'memory' }).kind, 'memory');
});

test('a SQLite failure reports memory and says annotations will be lost', t => {
  const { kind, stderr } = storeKind(t, {}, home => writeFileSync(join(home, '.agentation'), 'not a directory'));
  assert.equal(kind, 'memory');
  assert.match(stderr, /SQLite unavailable, falling back to in-memory/);
  assert.match(stderr, /Annotations are kept in memory only and will be lost when this server stops/);
});
