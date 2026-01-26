"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "./Footer";
import { HeroDemo } from "./components/HeroDemo";

export default function AgentationDocs() {
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <article className="article">
        <header>
          <h1>Overview</h1>
          <p className="tagline">Point at problems, not code</p>
        </header>

        {/* Animated demo */}
        <HeroDemo />

        <section>
          <p>
            Agentation (
            <span style={{ color: "rgba(0,0,0,0.5)" }}>agent + annotation</span>
            ) is a dev tool that lets you annotate elements on your webpage and
            generate structured feedback for AI coding agents.
          </p>
          <p>
            Click elements, select text, add notes, and paste the output into
            Claude Code, Cursor, or any agent that has access to your codebase.
            It&rsquo;s fully agent-agnostic, so the markdown output works with
            any AI tool. Zero dependencies beyond React.
          </p>
          <p>
            The key insight: agents can find and fix code much faster when they
            know exactly which element you&rsquo;re referring to. Agentation
            captures class names, selectors, and positions so the agent can
            locate the corresponding source files.
          </p>
          <p>
            It grew out of{" "}
            <a
              href="https://benji.org/annotating"
              className="styled-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              a post by Benji Taylor
            </a>{" "}
            exploring how to give better feedback to AI coding agents.
          </p>
        </section>

        <section>
          <h2>Quick start</h2>
          <ol>
            <li>
              Click the{" "}
              <svg
                style={{
                  display: "inline-block",
                  verticalAlign: "-0.45em",
                  width: "1.5em",
                  height: "1.5em",
                  margin: "0 -0.1em",
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11.5 12L5.5 12" />
                <path d="M18.5 6.75L5.5 6.75" />
                <path d="M9.25 17.25L5.5 17.25" />
                <path d="M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z" />
              </svg>{" "}
              icon in the bottom-right corner to activate
            </li>
            <li>
              <strong>Hover</strong> over elements to see their names
              highlighted
            </li>
            <li>
              <strong>Click</strong> any element to add an annotation
            </li>
            <li>
              Write your feedback and click <strong>Add</strong>
            </li>
            <li>
              Click{" "}
              <svg
                style={{
                  display: "inline-block",
                  verticalAlign: "-0.45em",
                  width: "1.5em",
                  height: "1.5em",
                  margin: "0 -0.1em",
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z" />
                <path d="M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75" />
              </svg>{" "}
              to copy formatted markdown
            </li>
            <li>Paste into your agent</li>
          </ol>
        </section>

        <section>
          <h2>How it works with agents</h2>
          <p>
            Agentation works best with AI tools that have access to your
            codebase (Claude Code, Cursor, Windsurf, etc.):
          </p>
          <ol>
            <li>You see a bug or want a change in your running app</li>
            <li>Use Agentation to annotate the element with your feedback</li>
            <li>Copy the output and paste it into your agent</li>
            <li>
              The agent uses the class names and selectors to{" "}
              <strong>search your codebase</strong>
            </li>
            <li>It finds the relevant component/file and makes the fix</li>
          </ol>
          <p>
            Without Agentation, you&rsquo;d have to describe the element
            (&ldquo;the blue button in the sidebar&rdquo;) and hope the agent
            guesses right. With Agentation, you give it
            <code>.sidebar &gt; .nav-actions &gt; button.primary</code> and it
            can grep for that directly.
          </p>
        </section>

        {/* Interactive Demo Section - hidden on mobile since tool is desktop-only */}
        <section className="demo-section hide-on-mobile">
          <h2>Try it</h2>
          <p>
            The toolbar is active on this page. Try annotating these demo
            elements:
          </p>

          <div className="demo-elements">
            <div className="button-group">
              <button
                className="demo-button"
                onClick={() => alert("Primary clicked!")}
                data-testid="demo-primary-button"
              >
                Primary Button
              </button>
              <button
                className="demo-button secondary"
                onClick={() => alert("Secondary clicked!")}
              >
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

            <div className="demo-card" data-testid="example-card">
              <h3>Example Card</h3>
              <p>
                Click on this card (it has a{" "}
                <code>data-testid="example-card"</code>) or select this text to
                create an annotation. The output will include the element path
                and your feedback.
              </p>
            </div>
          </div>
        </section>

        {/* Animation Demo - hidden on mobile since tool is desktop-only */}
        <section className="demo-section hide-on-mobile">
          <h2>Animation pause demo</h2>
          <p>
            Click{" "}
            <svg
              style={{
                display: "inline-block",
                verticalAlign: "-0.45em",
                width: "1.5em",
                height: "1.5em",
                margin: "0 -0.1em",
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M8 6L8 18" />
              <path d="M16 18L16 6" />
            </svg>{" "}
            in the toolbar to freeze this animation:
          </p>
          <div className="animation-demo">
            <div className="progress-bar-demo">
              <div className="progress-bar" />
            </div>
          </div>
        </section>

        <section>
          <h2>Best practices</h2>
          <ul>
            <li>
              <strong>Be specific</strong> &mdash; &ldquo;Button text
              unclear&rdquo; is better than &ldquo;fix this&rdquo;
            </li>
            <li>
              <strong>One issue per annotation</strong> &mdash; easier for the
              agent to address individually
            </li>
            <li>
              <strong>Include context</strong> &mdash; mention what you expected
              vs. what you see
            </li>
            <li>
              <strong>Use text selection</strong> &mdash; for typos or content
              issues, select the exact text
            </li>
            <li>
              <strong>Pause animations</strong> &mdash; to annotate a specific
              animation frame
            </li>
          </ul>
        </section>
      </article>

      <Footer />
    </>
  );
}
