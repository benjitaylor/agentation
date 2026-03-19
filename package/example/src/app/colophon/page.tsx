"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";

const bunnyArt = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣤⣤⡄⢠⣤⣤⡄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡟⢦⡀⠛⣿⠁⠀⢹⣇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢻⡆⠓⡆⠛⣶⠀⠀⣿⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢹⡆⠓⡄⢹⡆⠀⠉⣷⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⡇⢹⠈⢹⡇⠀⡿⣤⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⡀⠈⣿⣀⣹⠀⠙⠛⠃⠘⠛⢣⣄⠀⠀
⠀⠀⠀⠀⣰⠶⠞⠛⠛⠛⠛⠳⠶⣆⡿⠀⠀⠀⠀⢀⣀⣤⠀⠙⣷⠀
⠀⠀⣤⠾⠉⠀⠀⠀⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀⠸⠿⠿⠀⠀⣉⣷
⠀⢸⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⣿
⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣤⣤⡟⠛⠀
⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠀⠀⠀⠀
⠸⢧⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠀⠀⠀⠀
⠀⠺⣧⡀⢠⣀⠀⠀⣀⣟⠛⠛⣧⣄⡀⠀⠀⣸⡇⠀⣿⠉⠀⠀⠀⠀
⠀⠀⠀⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠀⠀⠀⠀⠀⠀`;

const COLORS = ['#4f46e5', '#7c3aed', '#e11d77', '#f97316', '#059669'];

// Seeded random for consistent "imperfect" delays
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function AnimatedBunny() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Pre-calculate character data once, including random delay offset
  const charData = useMemo(() => {
    const chars = bunnyArt.split('');
    let lineIndex = 0;
    let colIndex = 0;

    return chars.map((char, i) => {
      if (char === '\n') {
        lineIndex++;
        colIndex = 0;
        return { char, line: lineIndex - 1, col: colIndex, isNewline: true, randomOffset: 0 };
      }
      // Add randomness: some chars appear early, some late
      const randomOffset = (seededRandom(i * 7 + 13) - 0.5) * 180; // ±90ms variance
      const data = { char, line: lineIndex, col: colIndex, isNewline: false, randomOffset };
      colIndex++;
      return data;
    });
  }, []);

  const updateStyles = useCallback((time: number) => {
    if (!containerRef.current) return;

    const elapsed = time - startTimeRef.current;
    const tick = elapsed / 40; // Match original 40ms interval timing

    // Intro phase: 0 to 1 over ~3 seconds
    const introPhase = Math.min(elapsed / 3000, 1);
    const colorThreshold = 0.6 - introPhase * 0.4;
    const opacityBoost = (1 - introPhase) * 0.2;

    const spans = containerRef.current.children;
    let spanIndex = 0;

    for (let i = 0; i < charData.length; i++) {
      const { isNewline, line, col, randomOffset } = charData[i];
      if (isNewline) continue;

      const span = spans[spanIndex] as HTMLSpanElement;
      if (!span) { spanIndex++; continue; }

      // Intro reveal: staggered by line and column, with random variance for organic feel
      const baseDelay = (line * 35) + (col * 10); // base timing
      const revealDelay = Math.max(0, baseDelay + randomOffset); // add randomness
      const charVisible = elapsed > revealDelay;
      const revealProgress = charVisible ? Math.min((elapsed - revealDelay) / 450, 1) : 0;

      // Wave calculations
      const wave1 = (tick + i) % 150;
      const wave2 = (tick * 0.7 + i + 75) % 150;
      const intensity1 = wave1 < 30 ? Math.sin((wave1 / 30) * Math.PI) : 0;
      const intensity2 = wave2 < 30 ? Math.sin((wave2 / 30) * Math.PI) : 0;
      const intensity = Math.max(intensity1, intensity2);

      // Base opacity for wave effect
      const waveOpacity = 0.08 + intensity * (0.35 + opacityBoost);
      // Apply reveal animation
      const opacity = waveOpacity * revealProgress;

      const useColor = intensity > colorThreshold;
      const color = useColor ? COLORS[i % COLORS.length] : '';

      span.style.opacity = String(opacity);
      span.style.color = color;

      spanIndex++;
    }

    frameRef.current = requestAnimationFrame(updateStyles);
  }, [charData]);

  useEffect(() => {
    startTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(updateStyles);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [updateStyles]);

  // Only render visible characters (skip newlines, handle them with CSS)
  const visibleChars = useMemo(() => {
    return charData.filter(d => !d.isNewline);
  }, [charData]);

  return (
    <span className="colophon-bunny" ref={containerRef}>
      {visibleChars.map((data, i) => (
        <span
          key={i}
          style={{ opacity: 0 }}
        >
          {data.char}
          {/* Insert line break after each line's last char */}
          {i < visibleChars.length - 1 && visibleChars[i + 1].line !== data.line && '\n'}
        </span>
      ))}
    </span>
  );
}

export default function ColophonPage() {
  return (
    <>
      <style>{`
        .colophon-page {
          max-width: 36rem;
          margin: 0 auto;
          padding: 4rem 1.5rem 3rem;
        }
        @media (max-width: 900px) {
          .colophon-page {
            padding-top: 2rem;
          }
        }
        .colophon-page h1 {
          font-size: 0.8125rem;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.4);
          margin-bottom: 1.25rem;
        }
        .colophon-content {
          font-size: 0.75rem;
          color: rgba(0, 0, 0, 0.4);
          line-height: 1.8;
        }
        .colophon-content p {
          margin-bottom: 0.5rem;
        }
        .colophon-content a {
          color: rgba(0, 0, 0, 0.5);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .colophon-content a:hover {
          color: rgba(0, 0, 0, 0.65);
        }
        .colophon-table-wrapper {
          position: relative;
          margin-top: 1.5rem;
        }
        .colophon-table {
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }
        .colophon-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.3rem 0;
          border-bottom: 1px dotted rgba(0, 0, 0, 0.1);
        }
        .colophon-row:last-child {
          border-bottom: none;
        }
        .colophon-row-label {
          color: rgba(0, 0, 0, 0.35);
        }
        .colophon-row-value {
          color: rgba(0, 0, 0, 0.5);
          text-align: right;
        }
        .colophon-row-value a {
          color: rgba(0, 0, 0, 0.5);
        }
        .colophon-bunny {
          position: absolute;
          top: -2rem;
          right: 2rem;
          white-space: pre;
          line-height: 1;
          font-size: 0.85rem;
          color: rgba(0, 0, 0, 1);
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
      <div className="colophon-page">
        <div className="colophon-content">
          <p>
            Agentation is a React component for annotating web pages and generating structured
            feedback for AI coding agents. Zero runtime dependencies beyond React 18+, written
            in TypeScript with full type definitions. Available on <a href="https://www.npmjs.com/package/agentation" target="_blank" rel="noopener noreferrer">npm</a> and <a href="https://github.com/benjitaylor/agentation" target="_blank" rel="noopener noreferrer">GitHub</a>.
          </p>
          <p>
            Made by <a href="https://x.com/benjitaylor" target="_blank" rel="noopener noreferrer">Benji Taylor</a>, <a href="https://x.com/seldom" target="_blank" rel="noopener noreferrer">Dennis Jin</a>, and <a href="https://x.com/alexvanderzon" target="_blank" rel="noopener noreferrer">Alex Vanderzon</a>,
            with help from <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer">Claude Code</a>.<br />
            See <a href="https://benji.org/annotating" target="_blank" rel="noopener noreferrer">the original post</a> for
            more on the motivation behind the project.
          </p>

          <div className="colophon-table-wrapper">
            <AnimatedBunny />
            <div className="colophon-table">
            <div className="colophon-row">
              <span className="colophon-row-label">Framework</span>
              <span className="colophon-row-value"><a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a></span>
            </div>
            <div className="colophon-row">
              <span className="colophon-row-label">Hosting</span>
              <span className="colophon-row-value"><a href="https://vercel.com" target="_blank" rel="noopener noreferrer">Vercel</a></span>
            </div>
            <div className="colophon-row">
              <span className="colophon-row-label">Typeface</span>
              <span className="colophon-row-value"><a href="https://rsms.me/inter" target="_blank" rel="noopener noreferrer">Inter</a></span>
            </div>
            <div className="colophon-row">
              <span className="colophon-row-label">Icons</span>
              <span className="colophon-row-value"><a href="https://dip.org" target="_blank" rel="noopener noreferrer">Dip</a></span>
            </div>
            <div className="colophon-row">
              <span className="colophon-row-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="11" viewBox="0 0 20 20" width="11" fill="currentColor" style={{ opacity: 0.5 }}><path d="M10.75,6.37C11.39,6.15,11.9,5.64,12.12,5H15l-2.5,5.75c0,1.24,1.23,2.25,2.75,2.25c1.52,0,2.75-1.01,2.75-2.25L15.5,5H17 V3.5h-4.88C11.81,2.63,10.98,2,10,2S8.19,2.63,7.88,3.5H3V5h1.5L2,10.75C2,11.99,3.23,13,4.75,13s2.75-1.01,2.75-2.25L5,5h2.88 C8.1,5.64,8.61,6.15,9.25,6.37v9.13H2V17h16v-1.5h-7.25V6.37z M16.91,10.75h-3.32l1.66-3.82L16.91,10.75z M6.41,10.75H3.09 l1.66-3.82L6.41,10.75z M10,5C9.59,5,9.25,4.66,9.25,4.25C9.25,3.84,9.59,3.5,10,3.5s0.75,0.34,0.75,0.75C10.75,4.66,10.41,5,10,5z"/></svg>
                License
              </span>
              <span className="colophon-row-value"><a href="https://github.com/benjitaylor/agentation/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">PolyForm Shield</a></span>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
