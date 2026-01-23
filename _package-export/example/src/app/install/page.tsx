"use client";

import { useState, useId, useRef, useEffect } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Footer } from "../Footer";
import { motion, useAnimate, type AnimationSequence } from "framer-motion";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [scope, animate] = useAnimate();
  const maskId = useId();

  const inSequence: AnimationSequence = [
    [
      '[data-part="square-front"]',
      { y: [0, -4] },
      { duration: 0.12, ease: "easeOut" },
    ],
    [
      '[data-part="square-back"]',
      { x: [0, -4] },
      { at: "<", duration: 0.12, ease: "easeOut" },
    ],
    [
      '[data-part="square-front"], [data-part="square-back"]',
      {
        rx: [2, 7.25],
        width: [10.5, 14.5],
        height: [10.5, 14.5],
        rotate: [0, -45],
      },
      { at: "<", duration: 0.12, ease: "easeOut" },
    ],
    [
      '[data-part="check"]',
      { opacity: [0, 1], pathOffset: [1, 0] },
      { at: "-0.03", duration: 0 },
    ],
    ['[data-part="check"]', { pathLength: [0, 1] }, { duration: 0.1 }],
  ];

  const outSequence: AnimationSequence = [
    [
      '[data-part="check"]',
      { pathOffset: [0, 1] },
      { duration: 0.1, ease: "easeOut" },
    ],
    [
      '[data-part="check"]',
      { opacity: [1, 0], pathLength: [1, 0] },
      { duration: 0 },
    ],
    [
      '[data-part="square-front"], [data-part="square-back"]',
      {
        rx: [7.25, 2],
        width: [14.5, 10.5],
        height: [14.5, 10.5],
        rotate: [-45, 0],
      },
      { at: "+0.03", duration: 0.12, ease: "easeOut" },
    ],
    [
      '[data-part="square-front"]',
      { y: [-4, 0] },
      { at: "<", duration: 0.12, ease: "easeOut" },
    ],
    [
      '[data-part="square-back"]',
      { x: [-4, 0] },
      { at: "<", duration: 0.12, ease: "easeOut" },
    ],
  ];

  const isFirstRender = useRef(true);
  const hasAnimatedIn = useRef(false);
  const inAnimation = useRef<ReturnType<typeof animate> | null>(null);
  const outAnimation = useRef<ReturnType<typeof animate> | null>(null);

  const animateIn = async () => {
    if (
      !inAnimation.current &&
      !outAnimation.current &&
      !hasAnimatedIn.current
    ) {
      const animation = animate(inSequence);
      inAnimation.current = animation;
      await animation;
      inAnimation.current = null;
      if (animation.speed === 1) hasAnimatedIn.current = true;
    } else if (outAnimation.current) {
      outAnimation.current.speed = -1;
    } else if (inAnimation.current) {
      inAnimation.current.speed = 1;
    }
  };

  const animateOut = async () => {
    if (inAnimation.current) {
      inAnimation.current.speed = -1;
    } else if (hasAnimatedIn.current && !outAnimation.current) {
      const animation = animate(outSequence);
      outAnimation.current = animation;
      await animation;
      outAnimation.current = null;
      if (animation.speed === 1) hasAnimatedIn.current = false;
    } else if (outAnimation.current) {
      outAnimation.current.speed = 1;
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    copied ? animateIn() : animateOut();
  }, [copied]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="copy-button"
      title="Copy to clipboard"
      style={{
        position: "absolute",
        top: "50%",
        right: "0.75rem",
        transform: "translateY(-50%)",
        padding: "0.375rem",
        background: "transparent",
        border: "none",
        borderRadius: "0.25rem",
        cursor: "pointer",
        color: "rgba(0,0,0,0.35)",
        transition: "color 0.15s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        ref={scope}
        style={{ overflow: "visible" }}
        width={20}
        height={20}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        aria-hidden="true"
      >
        <motion.rect
          data-part="square-front"
          x="4.75"
          y="8.75"
          width="10.5"
          height="10.5"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <g mask={`url(#${maskId})`}>
          <motion.rect
            data-part="square-back"
            x="8.75"
            y="4.75"
            width="10.5"
            height="10.5"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </g>
        <motion.path
          data-part="check"
          initial={{ pathLength: 0, opacity: 0 }}
          d="M9.25 12.25L11 14.25L15 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#fff" />
          <motion.rect
            data-part="square-front"
            x="4.75"
            y="8.75"
            width="10.5"
            height="10.5"
            rx="2"
            fill="#000"
            stroke="#000"
            strokeWidth="1.5"
          />
        </mask>
      </svg>
    </button>
  );
}

function CodeBlock({
  code,
  language = "tsx",
  copyable = false,
}: {
  code: string;
  language?: string;
  copyable?: boolean;
}) {
  return (
    <div style={{ position: "relative" }}>
      <Highlight theme={themes.github} code={code.trim()} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="code-block"
            style={{ ...style, background: "transparent" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      {copyable && <CopyButton text={code.trim()} />}
    </div>
  );
}

export default function InstallPage() {
  return (
    <>
      <article className="article">
        <header>
          <h1>Installation</h1>
          <p className="tagline">Get started with Agentation in your project</p>
        </header>

        <section>
          <h2>Install the package</h2>
          <CodeBlock code="npm install agentation" language="bash" copyable />
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(0,0,0,0.5)",
              marginTop: "0.5rem",
            }}
          >
            Or use yarn, pnpm, or bun.
          </p>
        </section>

        <section>
          <h2>Add to your app</h2>
          <p>
            Add the component anywhere in your React app, ideally at the root
            level. The <code>NODE_ENV</code> check ensures it only loads in
            development.
          </p>
          <CodeBlock
            code={`import { Agentation } from "agentation";

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
}`}
            language="tsx"
          />
        </section>

        <section>
          <h2>Claude Code</h2>
          <p>
            If you use Claude Code, you can set up Agentation automatically with the <code>/agentation</code> skill. Install it:
          </p>
          <CodeBlock code="npx add-skill benjitaylor/agentation" language="bash" copyable />
          <p style={{ marginTop: "1rem" }}>
            Then in Claude Code:
          </p>
          <CodeBlock code="/agentation" language="bash" copyable />
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(0,0,0,0.5)",
              marginTop: "0.5rem",
            }}
          >
            Detects your framework, installs the package, creates a provider, and wires it into your layout.
          </p>
        </section>

        <section>
          <h2>Requirements</h2>
          <ul>
            <li>
              <strong>React 18+</strong> &mdash; Uses modern React features
            </li>
            <li>
              <strong>Client-side only</strong> &mdash; Requires DOM access
            </li>
            <li>
              <strong>Desktop only</strong> &mdash; Not optimized for mobile
              devices
            </li>
            <li>
              <strong>Zero dependencies</strong> &mdash; No runtime deps beyond
              React
            </li>
          </ul>
        </section>

        <section>
          <h2>Props</h2>
          <p>
            The <code>Agentation</code> component accepts optional props for
            programmatic integration:
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                <th style={{ textAlign: "left", padding: "0.5rem 1rem 0.5rem 0" }}>Prop</th>
                <th style={{ textAlign: "left", padding: "0.5rem 1rem 0.5rem 0" }}>Type</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0" }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <td style={{ padding: "0.5rem 1rem 0.5rem 0" }}><code>onAnnotation</code></td>
                <td style={{ padding: "0.5rem 1rem 0.5rem 0" }}><code>(annotation: Annotation) =&gt; void</code></td>
                <td style={{ padding: "0.5rem 0" }}>Callback fired when an annotation is added</td>
              </tr>
              <tr>
                <td style={{ padding: "0.5rem 1rem 0.5rem 0" }}><code>copyToClipboard</code></td>
                <td style={{ padding: "0.5rem 1rem 0.5rem 0" }}><code>boolean</code></td>
                <td style={{ padding: "0.5rem 0" }}>Whether to copy to clipboard (default: <code>true</code>)</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>Programmatic integration</h2>
          <p>
            Use the <code>onAnnotation</code> callback to receive structured
            annotation data directly, without clipboard intermediation:
          </p>
          <CodeBlock
            code={`import { Agentation, type Annotation } from "agentation";

function App() {
  const handleAnnotation = (annotation: Annotation) => {
    // Structured data - no parsing needed
    console.log(annotation.element);      // "Button"
    console.log(annotation.elementPath);  // "body > div > button"
    console.log(annotation.boundingBox);  // { x, y, width, height }

    // Send to your agent, API, etc.
    sendToAgent(annotation);
  };

  return (
    <>
      <YourApp />
      <Agentation
        onAnnotation={handleAnnotation}
        copyToClipboard={false}  // Skip clipboard if not needed
      />
    </>
  );
}`}
            language="tsx"
          />
        </section>

        <section>
          <h2>Security notes</h2>
          <p>
            Agentation runs in your browser and reads DOM content to generate
            feedback. It does <strong>not</strong> send data anywhere &mdash;
            everything stays local until you manually copy and paste.
          </p>
          <ul>
            <li>
              <strong>No network requests</strong> &mdash; all processing is
              client-side
            </li>
            <li>
              <strong>No data collection</strong> &mdash; nothing is tracked or
              stored remotely
            </li>
            <li>
              <strong>Dev-only</strong> &mdash; use the <code>NODE_ENV</code>{" "}
              check to exclude from production
            </li>
          </ul>
        </section>
      </article>

      <Footer />
    </>
  );
}
