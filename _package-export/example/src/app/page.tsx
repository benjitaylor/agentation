"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "./Footer";

function AnimatedBunny({ color = "#4C74FF" }: { color?: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes bunnyEnterEar {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes bunnyEnterFace {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes bunnyEnterEye {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes leftEyeLook {
          0%, 8% { transform: translate(0, 0); }
          10%, 18% { transform: translate(1.5px, 0); }
          20%, 22% { transform: translate(1.5px, 0) scaleY(0.1); }
          24%, 32% { transform: translate(1.5px, 0); }
          35%, 48% { transform: translate(-0.8px, -0.6px); }
          52%, 54% { transform: translate(0, 0) scaleY(0.1); }
          56%, 68% { transform: translate(0, 0); }
          72%, 82% { transform: translate(-0.5px, 0.5px); }
          85%, 100% { transform: translate(0, 0); }
        }
        @keyframes rightEyeLook {
          0%, 8% { transform: translate(0, 0); }
          10%, 18% { transform: translate(0.8px, 0); }
          20%, 22% { transform: translate(0.8px, 0) scaleY(0.1); }
          24%, 32% { transform: translate(0.8px, 0); }
          35%, 48% { transform: translate(-1.5px, -0.6px); }
          52%, 54% { transform: translate(0, 0) scaleY(0.1); }
          56%, 68% { transform: translate(0, 0); }
          72%, 82% { transform: translate(-1.2px, 0.5px); }
          85%, 100% { transform: translate(0, 0); }
        }
        @keyframes leftEarTwitch {
          0%, 9% { transform: rotate(0deg); }
          12% { transform: rotate(-8deg); }
          16%, 34% { transform: rotate(0deg); }
          38% { transform: rotate(15deg); }
          44% { transform: rotate(8deg); }
          50%, 71% { transform: rotate(0deg); }
          74% { transform: rotate(-12deg); }
          80%, 100% { transform: rotate(0deg); }
        }
        @keyframes rightEarTwitch {
          0%, 9% { transform: rotate(0deg); }
          12% { transform: rotate(-6deg); }
          16%, 34% { transform: rotate(0deg); }
          38% { transform: rotate(12deg); }
          44% { transform: rotate(6deg); }
          50%, 71% { transform: rotate(0deg); }
          74% { transform: rotate(-10deg); }
          80%, 100% { transform: rotate(0deg); }
        }
        .bunny-eye-left {
          opacity: 0;
          animation: bunnyEnterEye 0.3s ease-out 0.35s forwards, leftEyeLook 5s ease-in-out 0.65s infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        .bunny-eye-right {
          opacity: 0;
          animation: bunnyEnterEye 0.3s ease-out 0.4s forwards, rightEyeLook 5s ease-in-out 0.7s infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        .bunny-ear-left {
          opacity: 0;
          animation: bunnyEnterEar 0.3s ease-out 0.1s forwards, leftEarTwitch 5s ease-in-out 0.4s infinite;
          transform-origin: bottom center;
          transform-box: fill-box;
        }
        .bunny-ear-right {
          opacity: 0;
          animation: bunnyEnterEar 0.3s ease-out 0.15s forwards, rightEarTwitch 5s ease-in-out 0.45s infinite;
          transform-origin: bottom center;
          transform-box: fill-box;
        }
        .bunny-face {
          opacity: 0;
          animation: bunnyEnterFace 0.3s ease-out 0.25s forwards;
          transform-origin: center;
          transform-box: fill-box;
        }
      `}</style>
      {/* Left ear */}
      <path className="bunny-ear-left" d="M3.738 10.2164L7.224 2.007H9.167L5.676 10.2164H3.738ZM10.791 6.42705C10.791 5.90346 10.726 5.42764 10.596 4.99959C10.47 4.57155 10.292 4.16643 10.063 3.78425C9.833 3.39825 9.56 3.01797 9.243 2.64343C8.926 2.26507 8.767 2.07589 8.767 2.07589L10.24 0.957996C10.24 0.957996 10.433 1.17203 10.819 1.60007C11.209 2.0243 11.559 2.49056 11.869 2.99886C12.178 3.50717 12.413 4.04222 12.574 4.60403C12.734 5.16584 12.814 5.77352 12.814 6.42705C12.814 7.10734 12.73 7.7303 12.562 8.29593C12.394 8.85774 12.153 9.3966 11.84 9.9126C11.526 10.4247 11.181 10.8833 10.802 11.2884C10.428 11.6974 10.24 11.9018 10.24 11.9018L8.767 10.7839C8.767 10.7839 8.924 10.5948 9.237 10.2164C9.554 9.8419 9.83 9.4597 10.063 9.06985C10.3 8.6762 10.479 8.26726 10.602 7.84304C10.728 7.41499 10.791 6.943 10.791 6.42705Z" fill={color}/>
      {/* Right ear */}
      <path className="bunny-ear-right" d="M15.003 10.2164L18.489 2.007H20.432L16.941 10.2164H15.003ZM22.056 6.42705C22.056 5.90346 21.991 5.42764 21.861 4.99959C21.735 4.57155 21.557 4.16643 21.328 3.78425C21.098 3.39825 20.825 3.01797 20.508 2.64343C20.191 2.26507 20.032 2.07589 20.032 2.07589L21.505 0.957996C21.505 0.957996 21.698 1.17203 22.084 1.60007C22.474 2.0243 22.824 2.49056 23.133 2.99886C23.443 3.50717 23.678 4.04222 23.839 4.60403C23.999 5.16584 24.079 5.77352 24.079 6.42705C24.079 7.10734 23.995 7.7303 23.827 8.29593C23.659 8.85774 23.418 9.3966 23.105 9.9126C22.791 10.4247 22.445 10.8833 22.067 11.2884C21.693 11.6974 21.505 11.9018 21.505 11.9018L20.032 10.7839C20.032 10.7839 20.189 10.5948 20.502 10.2164C20.819 9.8419 21.094 9.4597 21.328 9.06985C21.565 8.6762 21.744 8.26726 21.866 7.84304C21.993 7.41499 22.056 6.943 22.056 6.42705Z" fill={color}/>
      {/* Face outline */}
      <path className="bunny-face" d="M2.03 20.4328C2.03 20.9564 2.093 21.4322 2.219 21.8602C2.345 22.2883 2.523 22.6953 2.752 23.0813C2.981 23.4635 3.254 23.8419 3.572 24.2164C3.889 24.5948 4.047 24.7839 4.047 24.7839L2.574 25.9018C2.574 25.9018 2.379 25.6878 1.989 25.2598C1.603 24.8355 1.256 24.3693 0.946 23.861C0.636 23.3527 0.401 22.8176 0.241 22.2558C0.08 21.694 0 21.0863 0 20.4328C0 19.7525 0.084 19.1314 0.252 18.5696C0.421 18.004 0.661 17.4651 0.975 16.953C1.288 16.4371 1.632 15.9765 2.007 15.5714C2.385 15.1625 2.574 14.958 2.574 14.958L4.047 16.0759C4.047 16.0759 3.889 16.2651 3.572 16.6434C3.258 17.018 2.983 17.4021 2.746 17.7957C2.513 18.1855 2.335 18.5945 2.213 19.0225C2.091 19.4467 2.03 19.9168 2.03 20.4328ZM23.687 20.4271C23.687 19.9035 23.622 19.4276 23.492 18.9996C23.366 18.5715 23.188 18.1664 22.959 17.7843C22.729 17.3982 22.456 17.018 22.139 16.6434C21.822 16.2651 21.663 16.0759 21.663 16.0759L23.136 14.958C23.136 14.958 23.329 15.172 23.715 15.6001C24.105 16.0243 24.455 16.4906 24.765 16.9989C25.074 17.5072 25.309 18.0422 25.47 18.604C25.63 19.1658 25.71 19.7735 25.71 20.4271C25.71 21.1073 25.626 21.7303 25.458 22.2959C25.29 22.8577 25.049 23.3966 24.736 23.9126C24.422 24.4247 24.077 24.8833 23.698 25.2884C23.324 25.6974 23.136 25.9018 23.136 25.9018L21.663 24.7839C21.663 24.7839 21.82 24.5948 22.133 24.2164C22.45 23.8419 22.726 23.4597 22.959 23.0698C23.196 22.6762 23.375 22.2673 23.498 21.843C23.624 21.415 23.687 20.943 23.687 20.4271Z" fill={color}/>
      {/* Animated bunny eyes */}
      <circle className="bunny-eye-left" cx="8.277" cy="20.466" r="1.8" fill={color}/>
      <circle className="bunny-eye-right" cx="19.878" cy="20.466" r="1.8" fill={color}/>
    </svg>
  );
}

export default function AgentationDocs() {
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <article className="article">
        <header>
          <h1 style={{ position: 'relative' }}>
            <span style={{ color: '#4C74FF' }}>/</span>agentation
            <span style={{ position: 'absolute', marginLeft: '0.3rem', bottom: '-3px' }}><AnimatedBunny /></span>
          </h1>
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

        <section>
          <h2>Why not just use screenshots?</h2>
          <p>
            Screenshots seem like a natural way to show an agent what you&rsquo;re looking at,
            but they add friction and lose information:
          </p>
          <ul>
            <li>You take a screenshot, then annotate it with arrows or circles anyway</li>
            <li>The agent has to <em>guess</em> which element you mean from pixels alone</li>
            <li>No class names, no selectors, no way to search your codebase</li>
            <li>If the agent guesses wrong, you go back and forth describing it differently</li>
          </ul>
          <p>
            With Agentation, you click directly on the element. The output includes
            everything the agent needs to find it in your code&mdash;no guessing, no extra steps.
          </p>
        </section>

        {/* Interactive Demo Section */}
        <section className="demo-section">
          <h2>Try it</h2>
          <p>
            The toolbar is active on this page. Try annotating these demo elements:
          </p>

          <div className="demo-elements">
            <div className="button-group">
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

      <Footer />
    </>
  );
}
