export default function MotionSandbox() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f0f11",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: 420,
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {/* Heading */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h1
            className="sandbox-heading"
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 700,
              color: "#f5f5f7",
              letterSpacing: "-0.02em",
            }}
          >
            Motion Sandbox
          </h1>
          <p
            className="sandbox-subtitle"
            style={{ margin: 0, fontSize: 14, color: "#888" }}
          >
            Tag elements below and sequence them in the timeline.
          </p>
        </div>

        {/* Card */}
        <div
          className="sandbox-card"
          style={{
            background: "#1a1a1f",
            border: "1px solid #2a2a30",
            borderRadius: 12,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <label
            className="sandbox-label"
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <span
              style={{ fontSize: 13, fontWeight: 500, color: "#aaa" }}
            >
              Email address
            </span>
            <input
              className="sandbox-input"
              type="email"
              placeholder="you@example.com"
              style={{
                background: "#111114",
                border: "1px solid #2e2e36",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 15,
                color: "#f5f5f7",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </label>

          <label
            className="sandbox-label"
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <span
              style={{ fontSize: 13, fontWeight: 500, color: "#aaa" }}
            >
              Password
            </span>
            <input
              className="sandbox-input"
              type="password"
              placeholder="••••••••"
              style={{
                background: "#111114",
                border: "1px solid #2e2e36",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 15,
                color: "#f5f5f7",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </label>

          <button
            className="sandbox-button"
            style={{
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "11px 20px",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
            }}
          >
            Sign in
          </button>
        </div>

        {/* Footer link */}
        <p
          className="sandbox-footer"
          style={{
            margin: 0,
            fontSize: 13,
            color: "#555",
            textAlign: "center",
          }}
        >
          Don&apos;t have an account?{" "}
          <span style={{ color: "#6366f1", cursor: "pointer" }}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
