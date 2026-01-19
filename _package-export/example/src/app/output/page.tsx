"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Footer } from "../Footer";

type OutputFormat = 'compact' | 'standard' | 'detailed' | 'forensic';

const FORMAT_STORAGE_KEY = 'agentation-output-format';

function CodeBlock({ code, language = "tsx", textOpacity = 1 }: { code: string; language?: string; textOpacity?: number }) {
  return (
    <Highlight theme={themes.github} code={code.trim()} language={language}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre className="code-block" style={{ ...style, background: 'transparent' }}>
          <div style={{ opacity: textOpacity, transition: 'opacity 0.15s ease-out' }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </div>
        </pre>
      )}
    </Highlight>
  );
}

function AnimatedCodeBlock({ code, language }: { code: string; language?: string }) {
  const [textOpacity, setTextOpacity] = useState(1);
  const [displayedCode, setDisplayedCode] = useState(code);
  const pendingCode = useRef<string | null>(null);

  useEffect(() => {
    if (code === displayedCode) return;

    // Store the target and fade out
    pendingCode.current = code;
    setTextOpacity(0);

    // After fade, swap content and fade back in
    const timer = setTimeout(() => {
      if (pendingCode.current) {
        setDisplayedCode(pendingCode.current);
        pendingCode.current = null;
        setTimeout(() => setTextOpacity(1), 20);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [code, displayedCode]);

  return (
    <CodeBlock code={displayedCode} language={language} textOpacity={textOpacity} />
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

**Full DOM Path:** \`body > div.app > main.dashboard > div.form-container > div.actions > button.submit-btn\`

**CSS Classes:** \`submit-btn, primary\`
**Position:**
- Bounding box: x:450, y:320
- Dimensions: 120x40px
- Annotation at: 45.2% from left, 320px from top
**Computed Styles:** bg: rgb(59, 130, 246), font: 14px, weight: 600, padding: 8px 16px, radius: 6px
**Accessibility:** focusable

**Issue:** Button text should say "Save" not "Submit"

---

### 2. span.nav-label

**Full DOM Path:** \`body > div.app > aside.sidebar > nav > div.nav-item:nth-child(2) > span.nav-label\`

**CSS Classes:** \`nav-label\`
**Selected text:** "Settigns"
**Position:**
- Bounding box: x:24, y:156
- Dimensions: 64x20px
- Annotation at: 3.2% from left, 156px from top
**Computed Styles:** font: 13px, weight: 500, color: rgb(55, 65, 81)
**Accessibility:** none

**Issue:** Typo - should be "Settings"`,
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
        <h1>Output</h1>
        <p className="tagline">How Agentation structures feedback for AI agents</p>
      </header>

      <section>
        <p>
          When you copy, you get structured markdown that agents can parse and act on.
          Four formats are available:
        </p>
        {outputFormat && (
          <>
            <div className="format-toggle" style={{ marginTop: '0.75rem' }}>
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
            <AnimatedCodeBlock code={outputExamples[outputFormat]} language="markdown" />
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
