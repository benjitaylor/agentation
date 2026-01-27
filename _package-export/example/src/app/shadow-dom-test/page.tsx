"use client";

import { useEffect, useRef, useState } from "react";
import {
  identifyElement,
  getElementPath,
  isInShadowDOM,
  getShadowHost,
  getShadowAwareSelectors,
} from "agentation";

/**
 * Test page for shadow DOM support in agentation.
 * Creates a web component with shadow DOM and tests element identification.
 */
export default function ShadowDOMTestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    
    // Check if shadow root already exists (React strict mode / hot reload)
    let shadowRoot = hostRef.current.shadowRoot;
    if (!shadowRoot) {
      shadowRoot = hostRef.current.attachShadow({ mode: "open" });
    }
    
    // Add some content inside the shadow DOM
    shadowRoot.innerHTML = `
      <style>
        .shadow-container { padding: 16px; background: #1a1a2e; border-radius: 8px; }
        .shadow-button { padding: 8px 16px; background: #4a4ae0; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .shadow-heading { color: #fff; margin-bottom: 12px; }
        .shadow-text { color: #aaa; margin: 8px 0; }
        .nested-div { padding: 8px; background: #2a2a4e; border-radius: 4px; margin-top: 8px; }
      </style>
      <div class="shadow-container">
        <h3 class="shadow-heading">Inside Shadow DOM</h3>
        <p class="shadow-text">This content is inside a shadow root.</p>
        <button class="shadow-button" id="shadow-btn">Shadow Button</button>
        <div class="nested-div">
          <span class="nested-span">Nested content</span>
          <a href="#test" class="nested-link">Shadow Link</a>
        </div>
      </div>
    `;

    // Run tests after DOM is set up
    runTests(shadowRoot);
  }, []);

  const runTests = (shadowRoot: ShadowRoot) => {
    const results: string[] = [];
    
    results.push("=== Shadow DOM Element Identification Tests ===");
    results.push("");

    // Test 1: isInShadowDOM
    const button = shadowRoot.querySelector(".shadow-button") as HTMLElement;
    if (button) {
      results.push("Test 1: isInShadowDOM()");
      results.push(`  Button is in shadow DOM: ${isInShadowDOM(button)}`);
      results.push(`  Expected: true`);
      results.push(`  ${isInShadowDOM(button) ? "✓ PASS" : "✗ FAIL"}`);
      results.push("");
    }

    // Test 2: getShadowHost
    if (button) {
      results.push("Test 2: getShadowHost()");
      const host = getShadowHost(button);
      results.push(`  Shadow host tag: ${host?.tagName || "null"}`);
      results.push(`  Expected: DIV`);
      results.push(`  ${host?.tagName === "DIV" ? "✓ PASS" : "✗ FAIL"}`);
      results.push("");
    }

    // Test 3: getElementPath with shadow boundary marker
    if (button) {
      results.push("Test 3: getElementPath() - should mark shadow boundary");
      const path = getElementPath(button);
      results.push(`  Path: ${path}`);
      const hasShadowMarker = path.includes("⟨shadow⟩");
      results.push(`  Contains ⟨shadow⟩ marker: ${hasShadowMarker}`);
      results.push(`  ${hasShadowMarker ? "✓ PASS" : "✗ FAIL"}`);
      results.push("");
    }

    // Test 4: identifyElement
    if (button) {
      results.push("Test 4: identifyElement()");
      const identity = identifyElement(button);
      results.push(`  Name: ${identity.name}`);
      results.push(`  Path: ${identity.path}`);
      const identifiesAsButton = identity.name.toLowerCase().includes("button");
      results.push(`  ${identifiesAsButton ? "✓ PASS" : "✗ FAIL"}`);
      results.push("");
    }

    // Test 5: getShadowAwareSelectors
    if (button) {
      results.push("Test 5: getShadowAwareSelectors()");
      const selectors = getShadowAwareSelectors(button);
      results.push(`  Selectors: ${JSON.stringify(selectors)}`);
      results.push(`  Selector count: ${selectors.length}`);
      const hasMultipleSelectors = selectors.length >= 2;
      results.push(`  Has multiple selectors (for shadow boundary): ${hasMultipleSelectors}`);
      results.push(`  ${hasMultipleSelectors ? "✓ PASS" : "✗ FAIL"}`);
      results.push("");
    }

    // Test 6: Nested element in shadow DOM
    const nestedSpan = shadowRoot.querySelector(".nested-span") as HTMLElement;
    if (nestedSpan) {
      results.push("Test 6: Nested element identification");
      const path = getElementPath(nestedSpan);
      const identity = identifyElement(nestedSpan);
      results.push(`  Path: ${path}`);
      results.push(`  Identity: ${identity.name}`);
      results.push(`  ✓ PASS (no errors)`);
      results.push("");
    }

    // Test 7: Link in shadow DOM
    const link = shadowRoot.querySelector(".nested-link") as HTMLElement;
    if (link) {
      results.push("Test 7: Link element in shadow DOM");
      const identity = identifyElement(link);
      results.push(`  Identity: ${identity.name}`);
      const identifiesAsLink = identity.name.toLowerCase().includes("link");
      results.push(`  ${identifiesAsLink ? "✓ PASS" : "✗ FAIL"}`);
      results.push("");
    }

    // Test light DOM element (outside shadow)
    const lightElement = document.body;
    results.push("Test 8: Light DOM element (control)");
    results.push(`  isInShadowDOM(body): ${isInShadowDOM(lightElement)}`);
    results.push(`  Expected: false`);
    results.push(`  ${!isInShadowDOM(lightElement) ? "✓ PASS" : "✗ FAIL"}`);

    results.push("");
    results.push("=== Tests Complete ===");

    setTestResults(results);
  };

  return (
    <main style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Shadow DOM Support Test</h1>
      <p style={{ marginBottom: "16px", color: "#666" }}>
        This page tests the shadow DOM support in agentation&apos;s element identification utilities.
      </p>

      <section style={{ marginBottom: "24px" }}>
        <h2>Shadow DOM Host Element</h2>
        <div 
          ref={hostRef} 
          id="shadow-host"
          style={{ 
            border: "2px dashed #666", 
            padding: "8px", 
            borderRadius: "8px",
            minHeight: "120px"
          }}
        >
          {/* Shadow content will be attached here */}
        </div>
      </section>

      <section>
        <h2>Test Results</h2>
        <pre style={{ 
          background: "#1a1a1a", 
          color: "#0f0",
          padding: "16px", 
          borderRadius: "8px",
          overflow: "auto",
          fontSize: "13px",
          lineHeight: "1.5"
        }}>
          {testResults.length > 0 
            ? testResults.join("\n") 
            : "Running tests..."}
        </pre>
      </section>
    </main>
  );
}
