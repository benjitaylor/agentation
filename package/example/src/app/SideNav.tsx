"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOC } from "../components/TOC";
import * as Motion from "../components/Motion";

type OutputFormat = 'compact' | 'standard' | 'detailed' | 'forensic';

function ForensicBunny({ isForensic }: { isForensic: boolean }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [forensicPerkKey, setForensicPerkKey] = useState(0);
  const prevForensicRef = useRef(isForensic);

  // Track when entrance animations complete
  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Trigger perk animation when switching to forensic (only after entrance)
  useEffect(() => {
    if (hasEntered && isForensic && !prevForensicRef.current) {
      setForensicPerkKey(k => k + 1);
    }
    prevForensicRef.current = isForensic;
  }, [isForensic, hasEntered]);

  const color = isForensic ? '#dc2626' : 'rgba(0, 0, 0, 0.85)';

  // During entrance: show entrance animations
  // After entrance: show idle + forensic perk when triggered
  const earLeftClass = hasEntered
    ? `nav-ear-left-idle${isForensic ? ' forensic-perk' : ''}`
    : 'nav-ear-left-enter';
  const earRightClass = hasEntered
    ? `nav-ear-right-idle${isForensic ? ' forensic-perk' : ''}`
    : 'nav-ear-right-enter';

  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: isForensic ? 'scale(1.15)' : 'scale(1)',
        transformOrigin: 'center',
        transition: 'transform 0.3s ease-out',
      }}
    >
      <style>{`
        /* Entrance animations */
        @keyframes navBunnyEnterEar {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes navBunnyEnterFace {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes navBunnyEnterEye {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        /* Idle animations */
        @keyframes navLeftEarTwitch {
          0%, 9% { transform: rotate(0deg); }
          12% { transform: rotate(-8deg); }
          16%, 34% { transform: rotate(0deg); }
          38% { transform: rotate(-12deg); }
          42% { transform: rotate(-6deg); }
          48%, 100% { transform: rotate(0deg); }
        }
        @keyframes navRightEarTwitch {
          0%, 9% { transform: rotate(0deg); }
          12% { transform: rotate(6deg); }
          16%, 34% { transform: rotate(0deg); }
          38% { transform: rotate(10deg); }
          42% { transform: rotate(4deg); }
          48%, 71% { transform: rotate(0deg); }
          74% { transform: rotate(8deg); }
          78%, 100% { transform: rotate(0deg); }
        }
        @keyframes navLeftEyeMove {
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
        @keyframes navRightEyeMove {
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
        /* Forensic ear perk */
        @keyframes navForensicLeftEarPerk {
          0% { transform: rotate(0deg) translateY(0); }
          15% { transform: rotate(-25deg) translateY(-2px); }
          100% { transform: rotate(0deg) translateY(0); }
        }
        @keyframes navForensicRightEarPerk {
          0% { transform: rotate(0deg) translateY(0); }
          15% { transform: rotate(25deg) translateY(-2px); }
          100% { transform: rotate(0deg) translateY(0); }
        }
        /* Entrance state */
        .nav-ear-left-enter {
          opacity: 0;
          animation: navBunnyEnterEar 0.3s ease-out 0.1s forwards, navLeftEarTwitch 5s ease-in-out 0.4s infinite;
          transform-origin: bottom center;
          transform-box: fill-box;
        }
        .nav-ear-right-enter {
          opacity: 0;
          animation: navBunnyEnterEar 0.3s ease-out 0.15s forwards, navRightEarTwitch 5s ease-in-out 0.45s infinite;
          transform-origin: bottom center;
          transform-box: fill-box;
        }
        /* Idle state (after entrance) */
        .nav-ear-left-idle {
          animation: navLeftEarTwitch 5s ease-in-out infinite;
          transform-origin: bottom center;
          transform-box: fill-box;
        }
        .nav-ear-right-idle {
          animation: navRightEarTwitch 5s ease-in-out infinite;
          transform-origin: bottom center;
          transform-box: fill-box;
        }
        /* Forensic perk state (after entrance) */
        .nav-ear-left-idle.forensic-perk {
          animation: navForensicLeftEarPerk 0.8s ease-out, navLeftEarTwitch 5s ease-in-out 0.8s infinite;
        }
        .nav-ear-right-idle.forensic-perk {
          animation: navForensicRightEarPerk 0.8s ease-out, navRightEarTwitch 5s ease-in-out 0.8s infinite;
        }
        .nav-face-enter {
          opacity: 0;
          animation: navBunnyEnterFace 0.3s ease-out 0.25s forwards;
          transform-origin: center;
          transform-box: fill-box;
        }
        .nav-eye-left-enter {
          opacity: 0;
          animation: navBunnyEnterEye 0.3s ease-out 0.35s forwards, navLeftEyeMove 5s ease-in-out 0.65s infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        .nav-eye-right-enter {
          opacity: 0;
          animation: navBunnyEnterEye 0.3s ease-out 0.4s forwards, navRightEyeMove 5s ease-in-out 0.7s infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        .nav-eye-left-idle {
          animation: navLeftEyeMove 5s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        .nav-eye-right-idle {
          animation: navRightEyeMove 5s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        .nav-x-eye {
          transition: opacity 0.2s ease-out;
        }
      `}</style>
      {/* Left ear */}
      <path
        key={isForensic ? `nav-left-ear-forensic-${forensicPerkKey}` : 'nav-left-ear'}
        className={earLeftClass}
        d="M3.738 10.2164L7.224 2.007H9.167L5.676 10.2164H3.738ZM10.791 6.42705C10.791 5.90346 10.726 5.42764 10.596 4.99959C10.47 4.57155 10.292 4.16643 10.063 3.78425C9.833 3.39825 9.56 3.01797 9.243 2.64343C8.926 2.26507 8.767 2.07589 8.767 2.07589L10.24 0.957996C10.24 0.957996 10.433 1.17203 10.819 1.60007C11.209 2.0243 11.559 2.49056 11.869 2.99886C12.178 3.50717 12.413 4.04222 12.574 4.60403C12.734 5.16584 12.814 5.77352 12.814 6.42705C12.814 7.10734 12.73 7.7303 12.562 8.29593C12.394 8.85774 12.153 9.3966 11.84 9.9126C11.526 10.4247 11.181 10.8833 10.802 11.2884C10.428 11.6974 10.24 11.9018 10.24 11.9018L8.767 10.7839C8.767 10.7839 8.924 10.5948 9.237 10.2164C9.554 9.8419 9.83 9.4597 10.063 9.06985C10.3 8.6762 10.479 8.26726 10.602 7.84304C10.728 7.41499 10.791 6.943 10.791 6.42705Z"
        fill={color}
        style={{ transition: 'fill 0.2s ease-out' }}
      />
      {/* Right ear */}
      <path
        key={isForensic ? `nav-right-ear-forensic-${forensicPerkKey}` : 'nav-right-ear'}
        className={earRightClass}
        d="M15.003 10.2164L18.489 2.007H20.432L16.941 10.2164H15.003ZM22.056 6.42705C22.056 5.90346 21.991 5.42764 21.861 4.99959C21.735 4.57155 21.557 4.16643 21.328 3.78425C21.098 3.39825 20.825 3.01797 20.508 2.64343C20.191 2.26507 20.032 2.07589 20.032 2.07589L21.505 0.957996C21.505 0.957996 21.698 1.17203 22.084 1.60007C22.474 2.0243 22.824 2.49056 23.133 2.99886C23.443 3.50717 23.678 4.04222 23.839 4.60403C23.999 5.16584 24.079 5.77352 24.079 6.42705C24.079 7.10734 23.995 7.7303 23.827 8.29593C23.659 8.85774 23.418 9.3966 23.105 9.9126C22.791 10.4247 22.445 10.8833 22.067 11.2884C21.693 11.6974 21.505 11.9018 21.505 11.9018L20.032 10.7839C20.032 10.7839 20.189 10.5948 20.502 10.2164C20.819 9.8419 21.094 9.4597 21.328 9.06985C21.565 8.6762 21.744 8.26726 21.866 7.84304C21.993 7.41499 22.056 6.943 22.056 6.42705Z"
        fill={color}
        style={{ transition: 'fill 0.2s ease-out' }}
      />
      {/* Face outline */}
      <path
        className={hasEntered ? '' : 'nav-face-enter'}
        d="M2.03 20.4328C2.03 20.9564 2.093 21.4322 2.219 21.8602C2.345 22.2883 2.523 22.6953 2.752 23.0813C2.981 23.4635 3.254 23.8419 3.572 24.2164C3.889 24.5948 4.047 24.7839 4.047 24.7839L2.574 25.9018C2.574 25.9018 2.379 25.6878 1.989 25.2598C1.603 24.8355 1.256 24.3693 0.946 23.861C0.636 23.3527 0.401 22.8176 0.241 22.2558C0.08 21.694 0 21.0863 0 20.4328C0 19.7525 0.084 19.1314 0.252 18.5696C0.421 18.004 0.661 17.4651 0.975 16.953C1.288 16.4371 1.632 15.9765 2.007 15.5714C2.385 15.1625 2.574 14.958 2.574 14.958L4.047 16.0759C4.047 16.0759 3.889 16.2651 3.572 16.6434C3.258 17.018 2.983 17.4021 2.746 17.7957C2.513 18.1855 2.335 18.5945 2.213 19.0225C2.091 19.4467 2.03 19.9168 2.03 20.4328ZM23.687 20.4271C23.687 19.9035 23.622 19.4276 23.492 18.9996C23.366 18.5715 23.188 18.1664 22.959 17.7843C22.729 17.3982 22.456 17.018 22.139 16.6434C21.822 16.2651 21.663 16.0759 21.663 16.0759L23.136 14.958C23.136 14.958 23.329 15.172 23.715 15.6001C24.105 16.0243 24.455 16.4906 24.765 16.9989C25.074 17.5072 25.309 18.0422 25.47 18.604C25.63 19.1658 25.71 19.7735 25.71 20.4271C25.71 21.1073 25.626 21.7303 25.458 22.2959C25.29 22.8577 25.049 23.3966 24.736 23.9126C24.422 24.4247 24.077 24.8833 23.698 25.2884C23.324 25.6974 23.136 25.9018 23.136 25.9018L21.663 24.7839C21.663 24.7839 21.82 24.5948 22.133 24.2164C22.45 23.8419 22.726 23.4597 22.959 23.0698C23.196 22.6762 23.375 22.2673 23.498 21.843C23.624 21.415 23.687 20.943 23.687 20.4271Z"
        fill={color}
        style={{ transition: 'fill 0.2s ease-out' }}
      />
      {/* Circle eyes - shown when not forensic */}
      <circle
        className={hasEntered ? 'nav-eye-left-idle' : 'nav-eye-left-enter'}
        cx="8.277"
        cy="20.466"
        r="1.8"
        fill={color}
        style={{ opacity: isForensic ? 0 : undefined, transition: 'fill 0.2s ease-out, opacity 0.2s ease-out' }}
      />
      <circle
        className={hasEntered ? 'nav-eye-right-idle' : 'nav-eye-right-enter'}
        cx="19.878"
        cy="20.466"
        r="1.8"
        fill={color}
        style={{ opacity: isForensic ? 0 : undefined, transition: 'fill 0.2s ease-out, opacity 0.2s ease-out' }}
      />
      {/* X eyes - shown when forensic */}
      <g className="nav-x-eye" stroke={color} strokeWidth="1.5" strokeLinecap="round" style={{ opacity: isForensic ? 1 : 0, transition: 'opacity 0.2s ease-out, stroke 0.2s ease-out' }}>
        <line x1="6.5" y1="18.7" x2="10" y2="22.2" />
        <line x1="10" y1="18.7" x2="6.5" y2="22.2" />
      </g>
      <g className="nav-x-eye" stroke={color} strokeWidth="1.5" strokeLinecap="round" style={{ opacity: isForensic ? 1 : 0, transition: 'opacity 0.2s ease-out, stroke 0.2s ease-out' }}>
        <line x1="18.1" y1="18.7" x2="21.6" y2="22.2" />
        <line x1="21.6" y1="18.7" x2="18.1" y2="22.2" />
      </g>
    </svg>
  );
}

// Module-level flag - persists across navigations but resets on page refresh
let hasPlayedEntranceAnimation = false;

function TypedLogo({ isForensic, isOverview }: { isForensic: boolean; isOverview: boolean }) {
  const text = "/agentation";
  const [showBunny, setShowBunny] = useState(hasPlayedEntranceAnimation);
  const [skipAnimation, setSkipAnimation] = useState(hasPlayedEntranceAnimation);

  const delays = [
    0.1,    // /
    0.4,    // a (pause after slash)
    0.48,   // g
    0.54,   // e
    0.62,   // n
    0.7,    // t
    1.0,    // a (longer pause - "agent" + "ation")
    1.08,   // t
    1.14,   // i
    1.22,   // o
    1.3,    // n
  ];

  const totalTypingTime = delays[delays.length - 1] + 0.2;

  useEffect(() => {
    if (hasPlayedEntranceAnimation) {
      setShowBunny(true);
      setSkipAnimation(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowBunny(true);
      hasPlayedEntranceAnimation = true;
    }, totalTypingTime * 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="side-nav-logo">
      <style>{`
        @keyframes typeChar {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .typed-slash {
          display: inline-block;
        }
        @keyframes bunnySlideIn {
          from {
            height: 0;
            margin-bottom: 0;
            opacity: 0;
          }
          to {
            height: 44px;
            margin-bottom: 0.5rem;
            opacity: 1;
          }
        }
        .typed-char {
          opacity: 0;
          display: inline-block;
          animation: typeChar 0.1s ease-out forwards;
        }
        .bunny-slide-container {
          height: 0;
          margin-bottom: 0;
          opacity: 0;
          animation: bunnySlideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          padding-top: 8px;
        }
        .bunny-slide-container.skip-animation {
          height: 44px;
          margin-bottom: 0.5rem;
          opacity: 1;
          animation: none;
        }
      `}</style>
      {showBunny && (
        <div className={skipAnimation ? 'bunny-slide-container skip-animation' : 'bunny-slide-container'}>
          <Link
            href="/"
            style={{
              display: 'flex',
              cursor: isOverview ? 'default' : 'pointer',
              pointerEvents: isOverview ? 'none' : 'auto'
            }}
            tabIndex={isOverview ? -1 : 0}
          >
            <ForensicBunny isForensic={isForensic} />
          </Link>
        </div>
      )}
      <div>
        {text.split('').map((char, i) => (
          <span
            key={i}
            className={skipAnimation ? '' : (i === 0 ? 'typed-slash' : 'typed-char')}
            style={{
              color: i === 0 ? '#4C74FF' : 'inherit',
              animationDelay: skipAnimation ? '0s' : (i === 0 ? '0s' : `${delays[i]}s`),
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SideNav() {
  const pathname = usePathname();
  const [isForensic, setIsForensic] = useState(false);
  const [npmVersion, setNpmVersion] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://registry.npmjs.org/agentation')
      .then(res => res.json())
      .then(data => {
        const latest = data['dist-tags']?.latest;
        setNpmVersion(latest);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Check initial format from localStorage
    const savedFormat = localStorage.getItem('agentation-output-format');
    setIsForensic(savedFormat === 'forensic');

    // Listen for format changes
    const handleFormatChange = (e: CustomEvent<OutputFormat>) => {
      setIsForensic(e.detail === 'forensic');
    };

    window.addEventListener('agentation-format-change', handleFormatChange as EventListener);
    return () => window.removeEventListener('agentation-format-change', handleFormatChange as EventListener);
  }, []);

  const links: ({ href: string; label: string; badge?: string; items?: { id: string; text: string }[] } | { section: string })[] = [
    { href: "/", label: "Overview" },
    { href: "/install", label: "Install" },
    {
      href: "/features",
      label: "Features",
      items: [
        { id: 'annotation-modes', text: 'Annotation Modes' },
        { id: 'toolbar-controls', text: 'Toolbar Controls' },
        { id: 'marker-types', text: 'Marker Types' },
        { id: 'smart-identification', text: 'Smart Identification' },
        { id: 'computed-styles', text: 'Computed Styles' },
        { id: 'react-detection', text: 'React Detection' },
        { id: 'keyboard-shortcuts', text: 'Keyboard Shortcuts' },
        { id: 'agent-sync', text: 'Agent Sync' },
        { id: 'settings', text: 'Settings' },
      ],
    },
    { href: "/output", label: "Output" },
    {
      href: "/schema",
      label: "Schema",
      badge: "v1.0",
      items: [
        { id: 'overview', text: 'Overview' },
        { id: 'design-goals', text: 'Design Goals' },
        { id: 'annotation-object', text: 'Annotation Object' },
        { id: 'typescript-definition', text: 'TypeScript' },
        { id: 'event-envelope', text: 'Event Envelope' },
        { id: 'json-schema', text: 'JSON Schema' },
        { id: 'example', text: 'Example' },
        { id: 'markdown-output', text: 'Markdown Output' },
        { id: 'implementations', text: 'Implementations' },
        { id: 'building', text: 'Building' },
        { id: 'why', text: 'Why This Format?' },
        { id: 'versioning', text: 'Versioning' },
      ],
    },
    { section: "Tools" },
    {
      href: "/mcp",
      label: "MCP",
      items: [
        { id: 'overview', text: 'Overview' },
        { id: 'installation', text: 'Installation' },
        { id: 'quick-start', text: 'Quick Start' },
        { id: 'cli-commands', text: 'CLI Commands' },
        { id: 'server-options', text: 'Server Options' },
        { id: 'claude-code', text: 'Claude Code' },
        { id: 'mcp-tools', text: 'MCP Tools' },
        { id: 'hands-free-mode', text: 'Hands-Free Mode' },
        { id: 'critique-mode', text: 'Critique Mode' },
        { id: 'self-driving-mode', text: 'Self-Driving Mode' },
        { id: 'types', text: 'TypeScript Types' },
      ],
    },
    {
      href: "/api",
      label: "API",
      items: [
        { id: 'overview', text: 'Overview' },
        { id: 'props', text: 'Props' },
        { id: 'basic-usage', text: 'Basic Usage' },
        { id: 'annotation-type', text: 'Annotation Type' },
        { id: 'http-api', text: 'HTTP API' },
        { id: 'real-time-events', text: 'Real-Time Events' },
        { id: 'environment-variables', text: 'Environment Variables' },
        { id: 'storage', text: 'Storage' },
        { id: 'programmatic-usage', text: 'Programmatic Usage' },
      ],
    },
    { href: "/webhooks", label: "Webhooks" },
    { section: "Resources" },
    { href: "/changelog", label: "Changelog" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <nav className="side-nav">
      <TypedLogo isForensic={isForensic && pathname === '/output'} isOverview={pathname === '/'} />
      <div className="nav-links">
        {links.map((link, index) => {
          if ('section' in link) {
            return (
              <div key={link.section} className="nav-section">
                {link.section}
              </div>
            );
          }

          const isActive = pathname === link.href;
          const hasItems = 'items' in link && link.items && link.items.length > 0;

          return (
            <div key={link.href} className="nav-item-wrapper">
              <Link
                href={link.href}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                {link.label}
                {link.badge && <span className="nav-badge">{link.badge}</span>}
              </Link>

              {/* Animated expand for TOC sub-items */}
              <Motion.Config
                transition={{
                  type: 'spring',
                  damping: 18,
                  mass: 0.2,
                  stiffness: 280,
                }}
              >
                <Motion.Presence mode="sync">
                  {isActive && hasItems && (
                    <Motion.Height>
                      <TOC
                        headings={link.items!.map((item) => ({
                          id: item.id,
                          level: 1,
                          text: item.text,
                        }))}
                        title=""
                        className="nav-toc"
                      />
                    </Motion.Height>
                  )}
                </Motion.Presence>
              </Motion.Config>
            </div>
          );
        })}
      </div>
      <div className="nav-meta">
        {npmVersion && (
          <a
            href="https://www.npmjs.com/package/agentation"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-version"
          >
            v{npmVersion}
          </a>
        )}
        <span className="nav-dot">·</span>
        <a
          href="https://github.com/benjitaylor/agentation"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-github"
          aria-label="GitHub"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6.71356 13.6687C6.71354 13.5709 6.69203 13.4744 6.65053 13.3858C6.60903 13.2973 6.54857 13.219 6.47343 13.1564C6.3983 13.0939 6.31032 13.0486 6.21574 13.0238C6.12115 12.9991 6.02228 12.9954 5.92613 13.0131C5.0534 13.1733 3.95152 13.1974 3.65855 12.3744C3.40308 11.7371 2.97993 11.1808 2.43394 10.7644C2.39498 10.7432 2.35785 10.7189 2.32294 10.6915C2.27515 10.5655 2.19028 10.4569 2.07951 10.38C1.96875 10.3032 1.83729 10.2618 1.70249 10.2612H1.69924C1.52297 10.2611 1.35386 10.3309 1.22891 10.4552C1.10397 10.5796 1.03337 10.7483 1.03257 10.9246C1.02996 11.4682 1.57324 11.8165 1.79364 11.9344C2.05353 12.1955 2.26241 12.5028 2.40952 12.8406C2.65236 13.5229 3.35809 14.5581 5.38674 14.4246C5.3874 14.448 5.38804 14.4702 5.38836 14.4904L5.39129 14.6687C5.39129 14.8456 5.46153 15.0151 5.58655 15.1402C5.71158 15.2652 5.88115 15.3354 6.05796 15.3354C6.23477 15.3354 6.40434 15.2652 6.52936 15.1402C6.65439 15.0151 6.72463 14.8456 6.72463 14.6687L6.72137 14.4565C6.71812 14.3302 6.71356 14.1472 6.71356 13.6687ZM13.8249 3.58471C13.8461 3.50137 13.8669 3.40893 13.8851 3.30476C13.9929 2.56182 13.8989 1.80355 13.613 1.10943C13.5769 1.01894 13.5215 0.937432 13.4505 0.870629C13.3796 0.803826 13.295 0.753341 13.2025 0.722714C12.9652 0.642634 12.0889 0.48508 10.4131 1.55605C9.02014 1.22824 7.57009 1.22824 6.17711 1.55605C4.50816 0.500767 3.63641 0.643967 3.40138 0.719487C3.30663 0.748874 3.21965 0.799091 3.14682 0.866459C3.07399 0.933826 3.01716 1.01664 2.98048 1.10882C2.68869 1.81627 2.59571 2.59 2.7116 3.34645C2.72789 3.43173 2.74546 3.51051 2.76369 3.58277C2.21141 4.3184 1.91723 5.21568 1.92678 6.13551C1.92498 6.34073 1.93443 6.5459 1.9551 6.75009C2.17777 9.81845 4.17776 10.7397 5.5713 11.0561C5.54234 11.1394 5.51597 11.2286 5.49253 11.323C5.45076 11.4945 5.47871 11.6756 5.57026 11.8266C5.66182 11.9775 5.80949 12.086 5.98091 12.1283C6.15233 12.1705 6.3335 12.143 6.4847 12.0519C6.63589 11.9607 6.74477 11.8133 6.78745 11.642C6.82987 11.4199 6.9386 11.2158 7.09931 11.0567C7.19648 10.9717 7.26683 10.8602 7.30181 10.7359C7.33679 10.6115 7.33488 10.4797 7.29632 10.3565C7.25777 10.2332 7.18422 10.1238 7.08463 10.0416C6.98504 9.95937 6.8637 9.90785 6.73537 9.89332C4.43264 9.6303 3.43296 8.69215 3.28257 6.6277C3.26591 6.46419 3.25841 6.29987 3.26011 6.13551C3.24942 5.47995 3.466 4.8409 3.87306 4.32692C3.91397 4.27334 3.95753 4.22184 4.0036 4.17262C4.08522 4.08129 4.1401 3.96923 4.16221 3.84876C4.18432 3.72828 4.1728 3.60404 4.12893 3.48968C4.08396 3.36937 4.04933 3.24543 4.02542 3.11923C3.97111 2.76038 3.98892 2.39429 4.07782 2.04241C4.65724 2.20606 5.20256 2.47243 5.68782 2.82886C5.76806 2.88231 5.85887 2.91788 5.95407 2.93316C6.04927 2.94843 6.14664 2.94306 6.23958 2.91741C7.58698 2.55174 9.00752 2.55197 10.3548 2.91807C10.4483 2.9437 10.5461 2.94877 10.6417 2.93292C10.7373 2.91707 10.8283 2.88069 10.9085 2.82628C11.3915 2.46837 11.9345 2.19961 12.512 2.03266C12.6005 2.3761 12.6203 2.73363 12.5703 3.08474C12.5462 3.2231 12.5084 3.35874 12.4577 3.48969C12.4138 3.60406 12.4023 3.72829 12.4244 3.84877C12.4465 3.96925 12.5014 4.0813 12.583 4.17263C12.6344 4.23057 12.6859 4.29307 12.7321 4.35167C13.1363 4.85695 13.3492 5.48865 13.3334 6.13551C13.3346 6.30858 13.3262 6.48159 13.3083 6.65373C13.1615 8.69084 12.1579 9.62965 9.84442 9.89331C9.71606 9.90793 9.59471 9.95953 9.49513 10.0418C9.39555 10.1241 9.32203 10.2336 9.28351 10.3569C9.24499 10.4802 9.24313 10.6121 9.27816 10.7365C9.31319 10.8608 9.38359 10.9723 9.48081 11.0574C9.64657 11.2207 9.75553 11.433 9.79169 11.6628C9.83674 11.8413 9.85743 12.0251 9.85321 12.2091V13.7651C9.84669 14.1967 9.84669 14.5203 9.84669 14.6687C9.84669 14.8455 9.91692 15.0151 10.0419 15.1401C10.167 15.2651 10.3365 15.3354 10.5134 15.3354C10.6902 15.3354 10.8597 15.2651 10.9848 15.1401C11.1098 15.0151 11.18 14.8455 11.18 14.6687C11.18 14.5242 11.18 14.2071 11.1865 13.7755V12.2091C11.1919 11.9143 11.1572 11.6202 11.0833 11.3347C11.0622 11.241 11.0364 11.1485 11.0059 11.0574C12.02 10.8889 12.9415 10.366 13.6063 9.5818C14.271 8.79757 14.636 7.8029 14.6361 6.77483C14.658 6.56245 14.6683 6.34902 14.6667 6.13551C14.6815 5.21469 14.3849 4.31586 13.8249 3.58472L13.8249 3.58471Z"/>
          </svg>
        </a>
      </div>
    </nav>
  );
}
