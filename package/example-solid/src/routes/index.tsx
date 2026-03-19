import { Title } from "@solidjs/meta";

export default function Home() {
  return (
    <main style={{ "font-family": "system-ui, sans-serif", padding: "2rem", "max-width": "800px", margin: "0 auto" }}>
      <Title>Agentation - SolidJS Example</Title>

      <h1 style={{ "margin-bottom": "1rem" }}>Agentation - SolidJS Demo</h1>
      <p style={{ color: "#666", "margin-bottom": "2rem" }}>
        A floating toolbar for annotating web pages. Try clicking the annotation button in the toolbar below!
      </p>

      <div style={{ display: "flex", gap: "1rem", "flex-wrap": "wrap", "margin-bottom": "2rem" }}>
        <button
          class="demo-button"
          style={{
            padding: "12px 24px",
            "font-size": "16px",
            "background-color": "#3c82f7",
            color: "white",
            border: "none",
            "border-radius": "8px",
            cursor: "pointer",
          }}
        >
          Demo Button
        </button>

        <button
          style={{
            padding: "12px 24px",
            "font-size": "16px",
            "background-color": "#10b981",
            color: "white",
            border: "none",
            "border-radius": "8px",
            cursor: "pointer",
          }}
        >
          Another Button
        </button>
      </div>

      <div class="demo-card" style={{ background: "#f5f5f5", padding: "1.5rem", "border-radius": "12px", "margin-bottom": "2rem" }}>
        <h3 style={{ "margin-top": 0 }}>Demo Card</h3>
        <p style={{ margin: 0, color: "#666" }}>
          This is a demo card to show how annotations work on different elements.
          Try selecting some text and annotating it!
        </p>
      </div>

      <h2 style={{ "margin-bottom": "1rem" }}>Features</h2>
      <ul style={{ "line-height": "1.8" }}>
        <li class="feature-item">Click any element to add annotations</li>
        <li class="feature-item">Select text to annotate specific passages</li>
        <li class="feature-item">Drag to select multiple elements at once</li>
        <li class="feature-item">Export annotations as markdown for AI agents</li>
        <li class="feature-item">Annotations persist in localStorage</li>
      </ul>

      <div style={{ "margin-top": "2rem", padding: "1rem", background: "#e0f2fe", "border-radius": "8px" }}>
        <p style={{ margin: 0 }}>
          <strong>Tip:</strong> Look for the floating toolbar at the bottom of the page.
          Click the annotation icon to start annotating!
        </p>
      </div>
    </main>
  );
}
