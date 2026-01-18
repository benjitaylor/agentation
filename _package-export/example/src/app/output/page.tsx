"use client";

import { useState, useEffect, useCallback } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "../Footer";

type OutputFormat = 'compact' | 'standard' | 'detailed' | 'forensic';

const FORMAT_STORAGE_KEY = 'agentation-output-format';

function CodeBlock({ code, language = "tsx" }: { code: string; language?: string }) {
  return (
    <Highlight theme={themes.github} code={code.trim()} language={language}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre className="code-block" style={{ ...style, background: 'transparent' }}>
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
  );
}

function ForensicBunny() {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes forensicEnterEars {
          0% { opacity: 0; transform: translateY(-4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes forensicEnterFace {
          0% { opacity: 0; transform: translateY(-3px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes forensicEnterEyes {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes forensicLeftEarTwitch {
          0%, 9% { transform: rotate(0deg); }
          12% { transform: rotate(-8deg); }
          16%, 34% { transform: rotate(0deg); }
          38% { transform: rotate(15deg); }
          44% { transform: rotate(8deg); }
          50%, 71% { transform: rotate(0deg); }
          74% { transform: rotate(-12deg); }
          80%, 100% { transform: rotate(0deg); }
        }
        @keyframes forensicRightEarTwitch {
          0%, 9% { transform: rotate(0deg); }
          12% { transform: rotate(-6deg); }
          16%, 34% { transform: rotate(0deg); }
          38% { transform: rotate(12deg); }
          44% { transform: rotate(6deg); }
          50%, 71% { transform: rotate(0deg); }
          74% { transform: rotate(-10deg); }
          80%, 100% { transform: rotate(0deg); }
        }
        @keyframes forensicLeftEyeMove {
          0%, 8% { transform: translate(0, 0); }
          10%, 18% { transform: translate(1.2px, 0); }
          24%, 32% { transform: translate(1.2px, 0); }
          35%, 48% { transform: translate(-0.6px, -0.5px); }
          56%, 68% { transform: translate(0, 0); }
          72%, 82% { transform: translate(-0.4px, 0.4px); }
          85%, 100% { transform: translate(0, 0); }
        }
        @keyframes forensicRightEyeMove {
          0%, 8% { transform: translate(0, 0); }
          10%, 18% { transform: translate(0.6px, 0); }
          24%, 32% { transform: translate(0.6px, 0); }
          35%, 48% { transform: translate(-1.2px, -0.5px); }
          56%, 68% { transform: translate(0, 0); }
          72%, 82% { transform: translate(-1px, 0.4px); }
          85%, 100% { transform: translate(0, 0); }
        }
        .forensic-ear-left {
          animation: forensicEnterEars 0.3s ease-out forwards, forensicLeftEarTwitch 5s ease-in-out 0.3s infinite;
          transform-origin: bottom center;
          transform-box: fill-box;
          opacity: 0;
        }
        .forensic-ear-right {
          animation: forensicEnterEars 0.3s ease-out 0.05s forwards, forensicRightEarTwitch 5s ease-in-out 0.35s infinite;
          transform-origin: bottom center;
          transform-box: fill-box;
          opacity: 0;
        }
        .forensic-face {
          animation: forensicEnterFace 0.3s ease-out 0.1s forwards;
          opacity: 0;
        }
        .forensic-eye-left {
          animation: forensicEnterEyes 0.25s ease-out 0.2s forwards, forensicLeftEyeMove 5s ease-in-out 0.45s infinite;
          transform-origin: center;
          transform-box: fill-box;
          opacity: 0;
        }
        .forensic-eye-right {
          animation: forensicEnterEyes 0.25s ease-out 0.25s forwards, forensicRightEyeMove 5s ease-in-out 0.5s infinite;
          transform-origin: center;
          transform-box: fill-box;
          opacity: 0;
        }
      `}</style>
      {/* Left ear */}
      <path className="forensic-ear-left" d="M3.738 10.2164L7.224 2.007H9.167L5.676 10.2164H3.738ZM10.791 6.42705C10.791 5.90346 10.726 5.42764 10.596 4.99959C10.47 4.57155 10.292 4.16643 10.063 3.78425C9.833 3.39825 9.56 3.01797 9.243 2.64343C8.926 2.26507 8.767 2.07589 8.767 2.07589L10.24 0.957996C10.24 0.957996 10.433 1.17203 10.819 1.60007C11.209 2.0243 11.559 2.49056 11.869 2.99886C12.178 3.50717 12.413 4.04222 12.574 4.60403C12.734 5.16584 12.814 5.77352 12.814 6.42705C12.814 7.10734 12.73 7.7303 12.562 8.29593C12.394 8.85774 12.153 9.3966 11.84 9.9126C11.526 10.4247 11.181 10.8833 10.802 11.2884C10.428 11.6974 10.24 11.9018 10.24 11.9018L8.767 10.7839C8.767 10.7839 8.924 10.5948 9.237 10.2164C9.554 9.8419 9.83 9.4597 10.063 9.06985C10.3 8.6762 10.479 8.26726 10.602 7.84304C10.728 7.41499 10.791 6.943 10.791 6.42705Z" fill="#dc2626"/>
      {/* Right ear */}
      <path className="forensic-ear-right" d="M15.003 10.2164L18.489 2.007H20.432L16.941 10.2164H15.003ZM22.056 6.42705C22.056 5.90346 21.991 5.42764 21.861 4.99959C21.735 4.57155 21.557 4.16643 21.328 3.78425C21.098 3.39825 20.825 3.01797 20.508 2.64343C20.191 2.26507 20.032 2.07589 20.032 2.07589L21.505 0.957996C21.505 0.957996 21.698 1.17203 22.084 1.60007C22.474 2.0243 22.824 2.49056 23.133 2.99886C23.443 3.50717 23.678 4.04222 23.839 4.60403C23.999 5.16584 24.079 5.77352 24.079 6.42705C24.079 7.10734 23.995 7.7303 23.827 8.29593C23.659 8.85774 23.418 9.3966 23.105 9.9126C22.791 10.4247 22.445 10.8833 22.067 11.2884C21.693 11.6974 21.505 11.9018 21.505 11.9018L20.032 10.7839C20.032 10.7839 20.189 10.5948 20.502 10.2164C20.819 9.8419 21.094 9.4597 21.328 9.06985C21.565 8.6762 21.744 8.26726 21.866 7.84304C21.993 7.41499 22.056 6.943 22.056 6.42705Z" fill="#dc2626"/>
      {/* Face outline */}
      <path className="forensic-face" d="M2.03 20.4328C2.03 20.9564 2.093 21.4322 2.219 21.8602C2.345 22.2883 2.523 22.6953 2.752 23.0813C2.981 23.4635 3.254 23.8419 3.572 24.2164C3.889 24.5948 4.047 24.7839 4.047 24.7839L2.574 25.9018C2.574 25.9018 2.379 25.6878 1.989 25.2598C1.603 24.8355 1.256 24.3693 0.946 23.861C0.636 23.3527 0.401 22.8176 0.241 22.2558C0.08 21.694 0 21.0863 0 20.4328C0 19.7525 0.084 19.1314 0.252 18.5696C0.421 18.004 0.661 17.4651 0.975 16.953C1.288 16.4371 1.632 15.9765 2.007 15.5714C2.385 15.1625 2.574 14.958 2.574 14.958L4.047 16.0759C4.047 16.0759 3.889 16.2651 3.572 16.6434C3.258 17.018 2.983 17.4021 2.746 17.7957C2.513 18.1855 2.335 18.5945 2.213 19.0225C2.091 19.4467 2.03 19.9168 2.03 20.4328ZM23.687 20.4271C23.687 19.9035 23.622 19.4276 23.492 18.9996C23.366 18.5715 23.188 18.1664 22.959 17.7843C22.729 17.3982 22.456 17.018 22.139 16.6434C21.822 16.2651 21.663 16.0759 21.663 16.0759L23.136 14.958C23.136 14.958 23.329 15.172 23.715 15.6001C24.105 16.0243 24.455 16.4906 24.765 16.9989C25.074 17.5072 25.309 18.0422 25.47 18.604C25.63 19.1658 25.71 19.7735 25.71 20.4271C25.71 21.1073 25.626 21.7303 25.458 22.2959C25.29 22.8577 25.049 23.3966 24.736 23.9126C24.422 24.4247 24.077 24.8833 23.698 25.2884C23.324 25.6974 23.136 25.9018 23.136 25.9018L21.663 24.7839C21.663 24.7839 21.82 24.5948 22.133 24.2164C22.45 23.8419 22.726 23.4597 22.959 23.0698C23.196 22.6762 23.375 22.2673 23.498 21.843C23.624 21.415 23.687 20.943 23.687 20.4271Z" fill="#dc2626"/>
      {/* X eyes - animated */}
      <g className="forensic-eye-left" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round">
        <line x1="6.5" y1="18.7" x2="10" y2="22.2" />
        <line x1="10" y1="18.7" x2="6.5" y2="22.2" />
      </g>
      <g className="forensic-eye-right" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round">
        <line x1="18.1" y1="18.7" x2="21.6" y2="22.2" />
        <line x1="21.6" y1="18.7" x2="18.1" y2="22.2" />
      </g>
    </svg>
  );
}

function AnimatedCodeBlock({ code, language, formatKey }: { code: string; language?: string; formatKey: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={formatKey}
        initial={{ opacity: 0, height: 'auto' }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        layout
      >
        <CodeBlock code={code} language={language} />
      </motion.div>
    </AnimatePresence>
  );
}

const outputExamples: Record<OutputFormat, string> = {
  standard: `## Page Feedback: /dashboard
**Viewport:** 1512x738

### 1. button.submit-btn
**Location:** \`.form-container > .actions > button.submit-btn\`
**Classes:** \`submit-btn primary\`
**Position:** 450, 320 (120x40)
**Feedback:** Button text should say "Save" not "Submit"

### 2. span.nav-label
**Location:** \`.sidebar > nav > .nav-item > span\`
**Selected:** "Settigns"
**Feedback:** Typo - should be "Settings"`,

  detailed: `## Page Feedback: /dashboard
**Viewport:** 1512x738
**URL:** https://myapp.com/dashboard
**User Agent:** Chrome/120.0

---

### 1. button.submit-btn

**Selector:** \`.form-container > .actions > button.submit-btn\`
**Classes:** \`.submit-btn\`, \`.primary\`
**Bounding box:** x:450, y:320, 120x40px
**Nearby text:** "Cancel Save Changes"

**Issue:** Button text should say "Save" not "Submit"

---

### 2. span.nav-label

**Selector:** \`.sidebar > nav > .nav-item > span\`
**Classes:** \`.nav-label\`
**Selected text:** "Settigns"
**Nearby text:** "Dashboard Settigns Profile"

**Issue:** Typo - should be "Settings"

---

**Search tips:** Use the class names or selectors above to find these elements. Try \`grep -r "className.*submit-btn"\` or search for the nearby text.`,

  compact: `## Feedback: /dashboard

1. **.submit-btn**
   Button text should say "Save" not "Submit"

2. **.nav-label** ("Settigns...")
   Typo - should be "Settings"`,

  forensic: `## Page Feedback: /dashboard

**Environment:**
- Viewport: 1440x900
- URL: http://localhost:3000/dashboard
- User Agent: Mozilla/5.0 Chrome/142.0.0.0
- Timestamp: 2024-01-15T10:30:00.000Z
- Device Pixel Ratio: 2

---

### 1. button.submit-btn

**Full DOM Path:**
\`\`\`
body > div.app > main.dashboard > div.form-container > div.actions > button.submit-btn
\`\`\`

**CSS Classes:** \`submit-btn, primary\`
**Position:**
- Bounding box: x:450, y:320
- Dimensions: 120x40px
- Annotation at: 45.2% from left, 320px from top
**Computed Styles:** bg: rgb(59, 130, 246), font: 14px, weight: 600, padding: 8px 16px, radius: 6px
**Accessibility:** focusable

**Issue:** Button text should say "Save" not "Submit"`,
};

export default function OutputPage() {
  const [outputFormat, setOutputFormat] = useState<OutputFormat | null>(null);

  useEffect(() => {
    const savedFormat = localStorage.getItem(FORMAT_STORAGE_KEY);
    if (savedFormat && ['compact', 'standard', 'detailed', 'forensic'].includes(savedFormat)) {
      setOutputFormat(savedFormat as OutputFormat);
    } else {
      setOutputFormat('standard');
    }
  }, []);

  const handleFormatChange = useCallback((format: OutputFormat) => {
    setOutputFormat(format);
    localStorage.setItem(FORMAT_STORAGE_KEY, format);
    window.dispatchEvent(new CustomEvent('agentation-format-change', { detail: format }));
  }, []);

  return (
    <>
      <article className="article">
      <header>
        <h1>Output Format</h1>
        <p className="tagline">How Agentation structures feedback for AI agents</p>
      </header>

      <section>
        <p>
          When you copy, you get structured markdown that agents can parse and act on.
          Four formats are available:
        </p>
        {outputFormat && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
              <div className="format-toggle">
                <button
                  className={outputFormat === 'compact' ? 'active' : ''}
                  onClick={() => handleFormatChange('compact')}
                >
                  Compact
                </button>
                <button
                  className={outputFormat === 'standard' ? 'active' : ''}
                  onClick={() => handleFormatChange('standard')}
                >
                  Standard
                </button>
                <button
                  className={outputFormat === 'detailed' ? 'active' : ''}
                  onClick={() => handleFormatChange('detailed')}
                >
                  Detailed
                </button>
                <button
                  className={outputFormat === 'forensic' ? 'active' : ''}
                  onClick={() => handleFormatChange('forensic')}
                >
                  Forensic
                </button>
              </div>
              <AnimatePresence>
                {outputFormat === 'forensic' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <ForensicBunny />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatedCodeBlock code={outputExamples[outputFormat]} language="markdown" formatKey={outputFormat} />
          </>
        )}
        <p style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', marginTop: '0.5rem' }}>
          Changing format here updates the toolbar output.
        </p>
      </section>

      <section>
        <h2>When to use each format</h2>
        <ul>
          <li><strong>Compact</strong> &mdash; Quick feedback with minimal context. Good for small fixes.</li>
          <li><strong>Standard</strong> &mdash; Balanced detail for most use cases. Includes location and classes.</li>
          <li><strong>Detailed</strong> &mdash; Full context with bounding boxes and nearby text. Good for complex issues.</li>
          <li><strong>Forensic</strong> &mdash; Maximum detail including computed styles. For debugging layout/style issues.</li>
        </ul>
      </section>

      <section>
        <h2>Why structured output?</h2>
        <p>
          The output includes searchable selectors and class names that agents can <code>grep</code> for
          in your codebase to find the exact component.
        </p>
        <p>
          Without Agentation, you&rsquo;d have to describe the element (&ldquo;the blue button
          in the sidebar&rdquo;) and hope the agent guesses right. With Agentation, you give it
          <code>.sidebar &gt; .nav-actions &gt; button.primary</code> and it can search for that directly.
        </p>
      </section>

      <section>
        <h2>Customizing output</h2>
        <p>
          The copied output is plain markdown. Feel free to edit it before pasting
          into your agent:
        </p>
        <ul>
          <li><strong>Add context</strong> &mdash; prepend with &ldquo;I&rsquo;m working on the dashboard page...&rdquo;</li>
          <li><strong>Prioritize</strong> &mdash; reorder annotations by importance</li>
          <li><strong>Remove noise</strong> &mdash; delete annotations that aren&rsquo;t relevant</li>
          <li><strong>Add instructions</strong> &mdash; append &ldquo;Fix these issues and run the tests&rdquo;</li>
        </ul>
      </section>
    </article>

    <Footer />
    </>
  );
}
