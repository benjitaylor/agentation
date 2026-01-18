"use client";

import { useState, useEffect, useCallback } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { motion, AnimatePresence } from "framer-motion";

type OutputFormat = 'standard' | 'detailed' | 'compact';

const FORMAT_STORAGE_KEY = 'agentation-output-format';

// Code block with syntax highlighting
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

// Animated code block with smooth height transitions
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
**Viewport:** 1512×738

### 1. button.submit-btn
**Selector:** \`.form-container > .actions > button.submit-btn\`
**Classes:** \`submit-btn primary\`
**Position:** 450, 320 (120×40)
**Feedback:** Button text should say "Save" not "Submit"

### 2. span.nav-label
**Selector:** \`.sidebar > nav > .nav-item > span\`
**Selected:** "Settigns"
**Feedback:** Typo - should be "Settings"`,

  detailed: `## Page Feedback: /dashboard
**Viewport:** 1512×738
**URL:** https://myapp.com/dashboard
**User Agent:** Chrome/120.0

---

### 1. button.submit-btn

**Selector:** \`.form-container > .actions > button.submit-btn\`
**Classes:** \`.submit-btn\`, \`.primary\`
**Bounding box:** x:450, y:320, 120×40px
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
};

export default function AgentationDocs() {
  const [inputValue, setInputValue] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('standard');

  // Load saved format on mount
  useEffect(() => {
    const saved = localStorage.getItem(FORMAT_STORAGE_KEY);
    if (saved && ['compact', 'standard', 'detailed'].includes(saved)) {
      setOutputFormat(saved as OutputFormat);
    }
  }, []);

  // Save format to localStorage and notify toolbar
  const handleFormatChange = useCallback((format: OutputFormat) => {
    setOutputFormat(format);
    localStorage.setItem(FORMAT_STORAGE_KEY, format);
    // Dispatch custom event for toolbar to listen to
    window.dispatchEvent(new CustomEvent('agentation-format-change', { detail: format }));
  }, []);

  return (
    <>
      <article className="article">
        <header>
          <svg width="101" height="18" viewBox="0 0 124 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Agentation">
            <path d="M114.336 16.72V5.368H116.734V7.304H116.844C116.961 7.01067 117.108 6.732 117.284 6.468C117.475 6.18934 117.702 5.95467 117.966 5.764C118.23 5.55867 118.538 5.39734 118.89 5.28C119.242 5.16267 119.653 5.104 120.122 5.104C121.266 5.104 122.19 5.478 122.894 6.226C123.598 6.974 123.95 8.03734 123.95 9.416V16.72H121.552V9.768C121.552 7.964 120.767 7.062 119.198 7.062C118.89 7.062 118.589 7.106 118.296 7.194C118.003 7.26734 117.739 7.38467 117.504 7.546C117.269 7.70734 117.079 7.91267 116.932 8.162C116.8 8.41134 116.734 8.69734 116.734 9.02V16.72H114.336Z" fill="black"/>
            <path d="M107.656 16.984C106.82 16.984 106.064 16.8447 105.39 16.566C104.73 16.2873 104.165 15.8913 103.696 15.378C103.241 14.8647 102.889 14.2413 102.64 13.508C102.39 12.7747 102.266 11.9533 102.266 11.044C102.266 10.1347 102.39 9.31334 102.64 8.58C102.889 7.84667 103.241 7.22334 103.696 6.71C104.165 6.19667 104.73 5.80067 105.39 5.522C106.064 5.24334 106.82 5.104 107.656 5.104C108.492 5.104 109.24 5.24334 109.9 5.522C110.574 5.80067 111.139 6.19667 111.594 6.71C112.063 7.22334 112.422 7.84667 112.672 8.58C112.921 9.31334 113.046 10.1347 113.046 11.044C113.046 11.9533 112.921 12.7747 112.672 13.508C112.422 14.2413 112.063 14.8647 111.594 15.378C111.139 15.8913 110.574 16.2873 109.9 16.566C109.24 16.8447 108.492 16.984 107.656 16.984ZM107.656 15.092C108.536 15.092 109.232 14.828 109.746 14.3C110.274 13.7573 110.538 12.958 110.538 11.902V10.186C110.538 9.13 110.274 8.338 109.746 7.81C109.232 7.26734 108.536 6.996 107.656 6.996C106.776 6.996 106.072 7.26734 105.544 7.81C105.03 8.338 104.774 9.13 104.774 10.186V11.902C104.774 12.958 105.03 13.7573 105.544 14.3C106.072 14.828 106.776 15.092 107.656 15.092Z" fill="black"/>
            <path d="M96.9277 3.30019C96.3117 3.30019 95.879 3.17552 95.6297 2.92619C95.395 2.67685 95.2777 2.36885 95.2777 2.00219V1.54019C95.2777 1.17352 95.395 0.86552 95.6297 0.616187C95.879 0.366854 96.3044 0.242188 96.9057 0.242188C97.5217 0.242188 97.947 0.366854 98.1817 0.616187C98.431 0.86552 98.5557 1.17352 98.5557 1.54019V2.00219C98.5557 2.36885 98.431 2.67685 98.1817 2.92619C97.947 3.17552 97.529 3.30019 96.9277 3.30019ZM91.8457 14.7842H95.7177V7.30419H91.8457V5.36819H98.1157V14.7842H101.746V16.7202H91.8457V14.7842Z" fill="black"/>
            <path d="M85.4743 16.7203C84.4769 16.7203 83.7436 16.4563 83.2743 15.9283C82.8049 15.3856 82.5703 14.6889 82.5703 13.8383V7.30426H79.0723V5.36826H81.5583C81.9836 5.36826 82.2843 5.28759 82.4603 5.12626C82.6363 4.95026 82.7243 4.64226 82.7243 4.20226V1.36426H84.9683V5.36826H89.8083V7.30426H84.9683V14.7843H89.8083V16.7203H85.4743Z" fill="black"/>
            <path d="M77.586 16.72C76.8967 16.72 76.376 16.544 76.024 16.192C75.6867 15.84 75.4814 15.378 75.408 14.806H75.298C75.078 15.4953 74.6747 16.0307 74.088 16.412C73.516 16.7933 72.7827 16.984 71.888 16.984C70.7294 16.984 69.8054 16.6833 69.116 16.082C68.4267 15.466 68.082 14.6227 68.082 13.552C68.082 12.452 68.4854 11.616 69.292 11.044C70.1134 10.4573 71.3674 10.164 73.054 10.164H75.232V9.284C75.232 7.744 74.418 6.974 72.79 6.974C72.0567 6.974 71.4627 7.12067 71.008 7.414C70.5534 7.69267 70.172 8.06667 69.864 8.536L68.434 7.37C68.7567 6.754 69.2994 6.226 70.062 5.786C70.8247 5.33134 71.8074 5.104 73.01 5.104C74.4474 5.104 75.5767 5.44867 76.398 6.138C77.2194 6.82734 77.63 7.82467 77.63 9.13V14.828H79.06V16.72H77.586ZM72.57 15.224C73.3474 15.224 73.9854 15.048 74.484 14.696C74.9827 14.344 75.232 13.8893 75.232 13.332V11.682H73.098C71.3674 11.682 70.502 12.2027 70.502 13.244V13.684C70.502 14.1973 70.6854 14.586 71.052 14.85C71.4187 15.0993 71.9247 15.224 72.57 15.224Z" fill="black"/>
            <path d="M62.6129 16.7203C61.6156 16.7203 60.8823 16.4563 60.4129 15.9283C59.9436 15.3856 59.7089 14.6889 59.7089 13.8383V7.30426H56.2109V5.36826H58.6969C59.1223 5.36826 59.4229 5.28759 59.5989 5.12626C59.7749 4.95026 59.8629 4.64226 59.8629 4.20226V1.36426H62.1069V5.36826H66.9469V7.30426H62.1069V14.7843H66.9469V16.7203H62.6129Z" fill="black"/>
            <path d="M45.7461 16.72V5.368H48.1441V7.304H48.2541C48.3714 7.01067 48.5181 6.732 48.6941 6.468C48.8848 6.18934 49.1121 5.95467 49.3761 5.764C49.6401 5.55867 49.9481 5.39734 50.3001 5.28C50.6521 5.16267 51.0628 5.104 51.5321 5.104C52.6761 5.104 53.6001 5.478 54.3041 6.226C55.0081 6.974 55.3601 8.03734 55.3601 9.416V16.72H52.9621V9.768C52.9621 7.964 52.1774 7.062 50.6081 7.062C50.3001 7.062 49.9994 7.106 49.7061 7.194C49.4128 7.26734 49.1488 7.38467 48.9141 7.546C48.6794 7.70734 48.4888 7.91267 48.3421 8.162C48.2101 8.41134 48.1441 8.69734 48.1441 9.02V16.72H45.7461Z" fill="black"/>
            <path d="M39.3091 16.984C38.4438 16.984 37.6664 16.8447 36.9771 16.566C36.2878 16.2873 35.7084 15.8913 35.2391 15.378C34.7698 14.8647 34.4104 14.2487 34.1611 13.53C33.9118 12.7967 33.7871 11.9753 33.7871 11.066C33.7871 10.1567 33.9118 9.33534 34.1611 8.602C34.4251 7.86867 34.7844 7.24534 35.2391 6.732C35.7084 6.204 36.2731 5.80067 36.9331 5.522C37.5931 5.24334 38.3264 5.104 39.1331 5.104C39.9251 5.104 40.6438 5.24334 41.2891 5.522C41.9344 5.786 42.4844 6.16734 42.9391 6.666C43.3938 7.16467 43.7384 7.75867 43.9731 8.448C44.2224 9.13734 44.3471 9.9 44.3471 10.736V11.638H36.2071V12.012C36.2071 12.9067 36.4858 13.64 37.0431 14.212C37.6004 14.7693 38.3704 15.048 39.3531 15.048C40.0864 15.048 40.7098 14.894 41.2231 14.586C41.7511 14.2633 42.1764 13.838 42.4991 13.31L43.9951 14.63C43.6138 15.29 43.0271 15.8473 42.2351 16.302C41.4578 16.7567 40.4824 16.984 39.3091 16.984ZM39.1331 6.93C38.7078 6.93 38.3118 7.00334 37.9451 7.15C37.5931 7.29667 37.2851 7.50934 37.0211 7.788C36.7718 8.052 36.5738 8.36734 36.4271 8.734C36.2804 9.10067 36.2071 9.504 36.2071 9.944V10.098H41.9051V9.878C41.9051 8.98334 41.6484 8.272 41.1351 7.744C40.6364 7.20134 39.9691 6.93 39.1331 6.93Z" fill="black"/>
            <path d="M33.576 17.9525C33.576 19.1258 33.0847 19.9911 32.102 20.5485C31.1193 21.1058 29.6233 21.3845 27.614 21.3845C26.6313 21.3845 25.8027 21.3185 25.128 21.1865C24.468 21.0691 23.9253 20.8931 23.5 20.6585C23.0893 20.4238 22.7887 20.1378 22.598 19.8005C22.422 19.4631 22.334 19.0818 22.334 18.6565C22.334 18.0405 22.5027 17.5565 22.84 17.2045C23.192 16.8671 23.6833 16.6178 24.314 16.4565V16.2365C23.9327 16.0898 23.6247 15.8845 23.39 15.6205C23.17 15.3565 23.06 15.0118 23.06 14.5865C23.06 14.0291 23.2507 13.6111 23.632 13.3325C24.0133 13.0391 24.5047 12.8191 25.106 12.6725V12.5625C24.4167 12.2398 23.8813 11.7851 23.5 11.1985C23.1187 10.6118 22.928 9.90779 22.928 9.08645C22.928 8.48512 23.038 7.94245 23.258 7.45845C23.478 6.95979 23.786 6.54179 24.182 6.20445C24.5927 5.85245 25.0767 5.58112 25.634 5.39045C26.206 5.19979 26.844 5.10445 27.548 5.10445C28.34 5.10445 29.0513 5.22912 29.682 5.47845V5.10445C29.682 4.66445 29.8067 4.29779 30.056 4.00445C30.3053 3.71112 30.6867 3.56445 31.2 3.56445H33.268V5.45645H30.628V5.98445C31.1266 6.32179 31.508 6.75445 31.772 7.28245C32.036 7.79579 32.168 8.39712 32.168 9.08645C32.168 9.68779 32.058 10.2378 31.838 10.7365C31.618 11.2205 31.3026 11.6385 30.892 11.9905C30.496 12.3278 30.012 12.5918 29.44 12.7825C28.8827 12.9585 28.252 13.0465 27.548 13.0465C27.0493 13.0465 26.58 13.0025 26.14 12.9145C25.876 12.9878 25.612 13.1125 25.348 13.2885C25.084 13.4645 24.952 13.7065 24.952 14.0145C24.952 14.3665 25.1207 14.5865 25.458 14.6745C25.7953 14.7625 26.2133 14.8065 26.712 14.8065H29.264C30.7893 14.8065 31.8893 15.0998 32.564 15.6865C33.2387 16.2585 33.576 17.0138 33.576 17.9525ZM31.332 18.1065C31.332 17.7251 31.178 17.4171 30.87 17.1825C30.562 16.9625 30.0047 16.8525 29.198 16.8525H25.26C24.7027 17.1165 24.424 17.5418 24.424 18.1285C24.424 18.5538 24.6 18.9205 24.952 19.2285C25.3187 19.5365 25.92 19.6905 26.756 19.6905H28.538C29.4473 19.6905 30.1367 19.5511 30.606 19.2725C31.09 19.0085 31.332 18.6198 31.332 18.1065ZM27.548 11.3965C28.3253 11.3965 28.8973 11.2131 29.264 10.8465C29.6307 10.4798 29.814 9.98845 29.814 9.37245V8.77845C29.814 8.16245 29.6307 7.67112 29.264 7.30445C28.8973 6.93779 28.3253 6.75445 27.548 6.75445C26.7707 6.75445 26.1987 6.93779 25.832 7.30445C25.4653 7.67112 25.282 8.16245 25.282 8.77845V9.37245C25.282 9.98845 25.4653 10.4798 25.832 10.8465C26.1987 11.2131 26.7707 11.3965 27.548 11.3965Z" fill="black"/>
            <path d="M20.4278 16.72C19.7385 16.72 19.2178 16.544 18.8658 16.192C18.5285 15.84 18.3232 15.378 18.2498 14.806H18.1398C17.9198 15.4953 17.5165 16.0307 16.9298 16.412C16.3578 16.7933 15.6245 16.984 14.7298 16.984C13.5712 16.984 12.6472 16.6833 11.9578 16.082C11.2685 15.466 10.9238 14.6227 10.9238 13.552C10.9238 12.452 11.3272 11.616 12.1338 11.044C12.9552 10.4573 14.2092 10.164 15.8958 10.164H18.0738V9.284C18.0738 7.744 17.2598 6.974 15.6318 6.974C14.8985 6.974 14.3045 7.12067 13.8498 7.414C13.3952 7.69267 13.0138 8.06667 12.7058 8.536L11.2758 7.37C11.5985 6.754 12.1412 6.226 12.9038 5.786C13.6665 5.33134 14.6492 5.104 15.8518 5.104C17.2892 5.104 18.4185 5.44867 19.2398 6.138C20.0612 6.82734 20.4718 7.82467 20.4718 9.13V14.828H21.9018V16.72H20.4278ZM15.4118 15.224C16.1892 15.224 16.8272 15.048 17.3258 14.696C17.8245 14.344 18.0738 13.8893 18.0738 13.332V11.682H15.9398C14.2092 11.682 13.3438 12.2027 13.3438 13.244V13.684C13.3438 14.1973 13.5272 14.586 13.8938 14.85C14.2605 15.0993 14.7665 15.224 15.4118 15.224Z" fill="black"/>
            <path d="M0 19.756L7.414 0H9.548L2.134 19.756H0Z" fill="#4C74FF"/>
          </svg>
          <p className="tagline">Visual feedback for AI coding agents</p>
        </header>

        <section>
          <p>
            Agentation is a dev tool that lets you annotate elements on your webpage
            and generate structured feedback for AI coding agents. Click elements,
            select text, add notes, and paste the output into Claude Code, Cursor, or
            any agent that has access to your codebase.
          </p>
          <p>
            The key insight: agents can find and fix code much faster when they
            know exactly which element you&rsquo;re referring to. Agentation captures
            class names, selectors, and positions so the agent can locate the corresponding
            source files.
          </p>
        </section>

        <section>
          <h2>Quick start</h2>
          <ol>
            <li>Click the <strong>chat bubble</strong> in the bottom-right corner to activate</li>
            <li><strong>Hover</strong> over elements to see their names highlighted</li>
            <li><strong>Click</strong> any element to add an annotation</li>
            <li>Write your feedback and click <strong>Add</strong></li>
            <li>Click the <strong>copy button</strong> to get formatted markdown</li>
            <li>Paste into your agent</li>
          </ol>
        </section>

        <section>
          <h2>Features</h2>
          <ul>
            <li><strong>Element annotation</strong> &mdash; Click any element to add feedback with automatic element identification (class names, IDs, semantic tags)</li>
            <li><strong>Text selection</strong> &mdash; Select text to annotate specific content with the quoted text included in output</li>
            <li><strong>Animation pause</strong> &mdash; Freeze CSS animations to annotate specific states</li>
            <li><strong>Marker visibility</strong> &mdash; Toggle annotation markers on/off while working</li>
            <li><strong>Structured output</strong> &mdash; Copies as markdown with page URL, viewport size, element details, and your notes</li>
          </ul>
        </section>

        <section>
          <h2>Keyboard shortcuts</h2>
          <ul>
            <li><code>⌘⇧A</code> / <code>Ctrl+Shift+A</code> &mdash; Toggle feedback mode on/off</li>
            <li><code>Esc</code> &mdash; Close toolbar or cancel annotation</li>
            <li><code>P</code> &mdash; Pause/resume animations</li>
            <li><code>H</code> &mdash; Hide/show annotation markers</li>
            <li><code>C</code> &mdash; Copy feedback to clipboard</li>
            <li><code>X</code> &mdash; Clear all annotations</li>
          </ul>
          <p>
            Shortcuts are disabled when typing in an input field.
          </p>
        </section>

        <section>
          <h2>Output format</h2>
          <p>
            When you copy, you get structured markdown that agents can parse and act on.
            Three formats are available:
          </p>
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
          </div>
          <AnimatedCodeBlock code={outputExamples[outputFormat]} language="markdown" formatKey={outputFormat} />
          <p>
            The output includes searchable selectors and class names that agents can <code>grep</code> for
            in your codebase to find the exact component.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', marginTop: '0.5rem' }}>
            Changing the format here will also change the output from the toolbar on this page,
            so you can try it out for yourself.
          </p>
        </section>

        <section>
          <h2>What it is</h2>
          <ul>
            <li>A <strong>dev tool</strong> for communicating visual feedback to AI coding agents</li>
            <li>A way to <strong>point at things</strong> in your running app so the agent can find them in code</li>
            <li>A bridge between <strong>what you see</strong> in the browser and <strong>what the agent can search</strong> in your codebase</li>
          </ul>
        </section>

        <section>
          <h2>How it works with agents</h2>
          <p>
            Agentation works best with AI tools that have access to your codebase
            (Claude Code, Cursor, Windsurf, etc.):
          </p>
          <ol>
            <li>You see a bug or want a change in your running app</li>
            <li>Use Agentation to annotate the element with your feedback</li>
            <li>Copy the output and paste it into your agent</li>
            <li>The agent uses the class names and selectors to <strong>search your codebase</strong></li>
            <li>It finds the relevant component/file and makes the fix</li>
          </ol>
          <p>
            Without Agentation, you&rsquo;d have to describe the element (&ldquo;the blue button
            in the sidebar&rdquo;) and hope the agent guesses right. With Agentation, you give it
            <code>.sidebar &gt; .nav-actions &gt; button.primary</code> and it can grep for that directly.
          </p>
        </section>

        <section>
          <h2>What it isn&rsquo;t</h2>
          <ul>
            <li><strong>Not a bug tracker</strong> &mdash; annotations aren&rsquo;t persisted or synced</li>
            <li><strong>Not a design tool</strong> &mdash; you can&rsquo;t edit styles or layouts</li>
            <li><strong>Not a testing framework</strong> &mdash; no assertions or automation</li>
            <li><strong>Not for production</strong> &mdash; dev-only, should not ship to users</li>
          </ul>
        </section>

        <section>
          <h2>Limitations</h2>
          <ul>
            <li><strong>Session-only</strong> &mdash; annotations clear on page refresh</li>
            <li><strong>Single page</strong> &mdash; annotations don&rsquo;t follow across navigation</li>
            <li><strong>Static positions</strong> &mdash; markers don&rsquo;t update if layout changes</li>
            <li><strong>No screenshots</strong> &mdash; output is text-only (paste alongside screenshots if needed)</li>
            <li><strong>React only</strong> &mdash; currently requires React 18+</li>
          </ul>
        </section>

        <section>
          <h2>Best practices</h2>
          <ul>
            <li><strong>Be specific</strong> &mdash; &ldquo;Button text unclear&rdquo; is better than &ldquo;fix this&rdquo;</li>
            <li><strong>One issue per annotation</strong> &mdash; easier for the agent to address individually</li>
            <li><strong>Include context</strong> &mdash; mention what you expected vs. what you see</li>
            <li><strong>Use text selection</strong> &mdash; for typos or content issues, select the exact text</li>
            <li><strong>Pause animations</strong> &mdash; to annotate a specific animation frame</li>
          </ul>
        </section>

        <section>
          <h2>Installation</h2>
          <CodeBlock code="npm install agentation" language="bash" />
          <p>Add to your root layout (Next.js App Router):</p>
          <CodeBlock
            code={`// app/layout.tsx
import { Agentation } from "agentation";
// or use AgentationCSS for zero-dep version (no framer-motion)

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}`}
            language="tsx"
          />
          <p>
            The <code>NODE_ENV</code> check ensures it only loads in development.
          </p>
          <p>
            <strong>Two versions available:</strong>
          </p>
          <ul>
            <li><code>Agentation</code> &mdash; Smoother animations, requires framer-motion peer dependency</li>
            <li><code>AgentationCSS</code> &mdash; CSS-only animations, zero runtime dependencies</li>
          </ul>
        </section>

        <section>
          <h2>Security notes</h2>
          <p>
            Agentation runs in your browser and reads DOM content to generate feedback.
            It does <strong>not</strong> send data anywhere &mdash; everything stays local
            until you manually copy and paste.
          </p>
          <ul>
            <li><strong>No network requests</strong> &mdash; all processing is client-side</li>
            <li><strong>No data collection</strong> &mdash; nothing is tracked or stored remotely</li>
            <li><strong>Dev-only</strong> &mdash; use the NODE_ENV check to exclude from production</li>
            <li><strong>Open source</strong> &mdash; review the source if you have concerns</li>
          </ul>
          <p>
            Since it runs in the same context as your app, treat it like any dev dependency:
            install from the official npm package or clone from the repo.
          </p>
        </section>

        {/* Interactive Demo Section */}
        <section className="demo-section">
          <h2>Try it</h2>
          <p>
            The toolbar is active on this page. Try annotating these demo elements:
          </p>

          <div className="button-group" style={{ marginTop: "1rem" }}>
            <button className="demo-button" onClick={() => alert("Primary clicked!")}>
              Primary Button
            </button>
            <button className="demo-button secondary" onClick={() => alert("Secondary clicked!")}>
              Secondary Button
            </button>
          </div>

          <input
            type="text"
            className="demo-input"
            placeholder="Try selecting this text..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <div className="demo-card">
            <h3>Example Card</h3>
            <p>
              Click on this card or select this text to create an annotation.
              The output will include the element path and your feedback.
            </p>
          </div>
        </section>

        {/* Animation Demo */}
        <section className="demo-section">
          <h2>Animation pause demo</h2>
          <p>
            Click the pause button in the toolbar to freeze these animations:
          </p>
          <div className="animation-demo">
            <div className="floating-circle" />
            <div className="floating-circle delay-1" />
            <div className="floating-circle delay-2" />
          </div>
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
          <p>
            The structured format helps the agent understand <em>what</em> you&rsquo;re pointing at.
            Your edits help it understand <em>what to do</em>.
          </p>
        </section>

        <section>
          <h2>Why not just describe it?</h2>
          <p>
            You could type &ldquo;the blue button in the header is misaligned&rdquo; but:
          </p>
          <ul>
            <li>Which blue button? There might be several.</li>
            <li>What&rsquo;s the actual class name the agent can search for?</li>
            <li>What component renders this element?</li>
            <li>What&rsquo;s the parent container&rsquo;s class?</li>
          </ul>
          <p>
            Agentation captures selectors that the agent can actually <code>grep</code> for in your codebase.
            Instead of guessing which file to look at, it can search for <code>className=&quot;submit-btn&quot;</code>
            and find the exact component.
          </p>
        </section>
      </article>

      <footer className="footer">
        <p>Created by <a href="https://benji.org" target="_blank" rel="noopener noreferrer">Benji Taylor</a></p>
      </footer>
    </>
  );
}
