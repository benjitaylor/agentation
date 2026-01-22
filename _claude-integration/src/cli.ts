import { startServer } from "./server.js";

const args = process.argv.slice(2);

// Parse CLI arguments
const portIndex = args.indexOf("--port");
const port = portIndex !== -1 ? parseInt(args[portIndex + 1], 10) : 4242;
const verbose = args.includes("--verbose") || args.includes("-v");

console.error(`
Agentation Claude Integration
==============================
HTTP server: http://localhost:${port}
MCP server:  stdio (connected to Claude Code)
`);

startServer({ httpPort: port, verbose }).catch((err) => {
  console.error("[agentation] Fatal error:", err);
  process.exit(1);
});
