import React from "react";
import ReactDOM from "react-dom/client";
import { Agentation } from "agentation";

const MCP_DEFAULT_ENDPOINT = "http://localhost:4747";

function AgentationExtension() {
  const [endpoint, setEndpoint] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    fetch(`${MCP_DEFAULT_ENDPOINT}/health`)
      .then((res) => {
        if (res.ok) {
          setEndpoint(MCP_DEFAULT_ENDPOINT);
        }
      })
      .catch(() => {
        // MCP server not available — run in local-only mode
      });
  }, []);

  return <Agentation endpoint={endpoint} />;
}

function mount() {
  const container = document.createElement("div");
  container.id = "agentation-extension-root";
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <AgentationExtension />
    </React.StrictMode>
  );
}

if (document.body) {
  mount();
} else {
  document.addEventListener("DOMContentLoaded", mount);
}
