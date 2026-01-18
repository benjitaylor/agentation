"use client";

import { useState } from "react";
import Link from "next/link";

export default function AgentationDocs() {
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <article className="article">
        <header>
          <h1>Agentation</h1>
          <p className="tagline">Visual feedback for AI coding agents</p>
        </header>

        <section>
          <p>
            Agentation (agent + annotation) is a dev tool that lets you annotate elements on your webpage
            and generate structured feedback for AI coding agents. Click elements,
            select text, add notes, and paste the output into Claude Code, Cursor, or
            any agent that has access to your codebase. Zero dependencies beyond React.
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
            Click the pause button in the toolbar to freeze this animation:
          </p>
          <div className="animation-demo">
            <div className="slider-track">
              <div className="slider-circle" />
            </div>
          </div>
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
          <h2>Learn more</h2>
          <ul>
            <li><Link href="/install">Installation</Link> &mdash; Add Agentation to your project</li>
            <li><Link href="/features">Features</Link> &mdash; Everything the toolbar can do</li>
            <li><Link href="/output">Output Format</Link> &mdash; How feedback is structured for agents</li>
          </ul>
        </section>
      </article>

      <footer className="footer">
        <p>Made by <a href="https://benji.org" target="_blank" rel="noopener noreferrer">Benji Taylor</a> and <a href="https://dennisjin.com" target="_blank" rel="noopener noreferrer">Dennis Jin</a></p>
      </footer>
    </>
  );
}
