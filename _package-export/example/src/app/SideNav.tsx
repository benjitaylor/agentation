"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

function TypedLogo({ isForensic }: { isForensic: boolean }) {
  const text = "/agentation";
  const [showBunny, setShowBunny] = useState(false);

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
    const timer = setTimeout(() => setShowBunny(true), totalTypingTime * 1000);
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
      `}</style>
      {showBunny && (
        <div className="bunny-slide-container">
          <ForensicBunny isForensic={isForensic} />
        </div>
      )}
      <div>
        {text.split('').map((char, i) => (
          <span
            key={i}
            className={i === 0 ? 'typed-slash' : 'typed-char'}
            style={{
              color: i === 0 ? '#4C74FF' : 'inherit',
              animationDelay: i === 0 ? '0s' : `${delays[i]}s`,
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  const kb = bytes / 1024;
  return kb.toFixed(1) + ' kB';
}

export function SideNav() {
  const pathname = usePathname();
  const [isForensic, setIsForensic] = useState(false);
  const [npmVersion, setNpmVersion] = useState<string | null>(null);
  const [packageSize, setPackageSize] = useState<string | null>(null);

  useEffect(() => {
    // Fetch published npm version and size from registry
    fetch('https://registry.npmjs.org/agentation')
      .then(res => res.json())
      .then(data => {
        const latest = data['dist-tags']?.latest;
        setNpmVersion(latest);
        // Get unpacked size from the latest version
        if (latest && data.versions?.[latest]?.dist?.unpackedSize) {
          setPackageSize(formatBytes(data.versions[latest].dist.unpackedSize));
        }
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

  const links = [
    { href: "/", label: "Overview" },
    { href: "/install", label: "Install" },
    { href: "/features", label: "Features" },
    { href: "/output", label: "Output" },
    { href: "/faq", label: "FAQ" },
    { href: "/to-do", label: "To-Do", badge: "(Temp)" },
  ];

  return (
    <nav className="side-nav">
      <TypedLogo isForensic={isForensic && pathname === '/output'} />
      <div className="nav-links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${pathname === link.href ? "active" : ""}`}
          >
            {link.label}
            {link.badge && <span className="nav-badge">{link.badge}</span>}
          </Link>
        ))}
      </div>
      {(npmVersion || packageSize) && (
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
          {packageSize && <span className="nav-size">{packageSize}</span>}
        </div>
      )}
    </nav>
  );
}
