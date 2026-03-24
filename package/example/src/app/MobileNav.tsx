"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Overview" },
  { href: "/install", label: "Install" },
  { href: "/features", label: "Features" },
  { href: "/output", label: "Output" },
  { href: "/schema", label: "Schema" },
  { href: "/mcp", label: "MCP" },
  { href: "/api", label: "API" },
  { href: "/webhooks", label: "Webhooks" },
  { href: "/changelog", label: "Changelog" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

type OutputFormat = 'compact' | 'standard' | 'detailed' | 'forensic';

function MobileForensicBunny({ isForensic }: { isForensic: boolean }) {
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

  const earLeftClass = hasEntered
    ? `mobile-ear-left-idle${isForensic ? ' forensic-perk' : ''}`
    : 'mobile-ear-left-enter';
  const earRightClass = hasEntered
    ? `mobile-ear-right-idle${isForensic ? ' forensic-perk' : ''}`
    : 'mobile-ear-right-enter';

  return (
    <svg
      width="28"
      height="28"
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
        @keyframes mobileBunnyEnterEar {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes mobileBunnyEnterFace {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes mobileBunnyEnterEye {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        /* Idle animations */
        @keyframes mobileLeftEarTwitch {
          0%, 9% { transform: rotate(0deg); }
          12% { transform: rotate(-8deg); }
          16%, 34% { transform: rotate(0deg); }
          38% { transform: rotate(-12deg); }
          42% { transform: rotate(-6deg); }
          48%, 100% { transform: rotate(0deg); }
        }
        @keyframes mobileRightEarTwitch {
          0%, 9% { transform: rotate(0deg); }
          12% { transform: rotate(6deg); }
          16%, 34% { transform: rotate(0deg); }
          38% { transform: rotate(10deg); }
          42% { transform: rotate(4deg); }
          48%, 71% { transform: rotate(0deg); }
          74% { transform: rotate(8deg); }
          78%, 100% { transform: rotate(0deg); }
        }
        @keyframes mobileLeftEyeMove {
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
        @keyframes mobileRightEyeMove {
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
        @keyframes mobileForensicLeftEarPerk {
          0% { transform: rotate(0deg) translateY(0); }
          15% { transform: rotate(-25deg) translateY(-2px); }
          100% { transform: rotate(0deg) translateY(0); }
        }
        @keyframes mobileForensicRightEarPerk {
          0% { transform: rotate(0deg) translateY(0); }
          15% { transform: rotate(25deg) translateY(-2px); }
          100% { transform: rotate(0deg) translateY(0); }
        }
        /* Entrance state */
        .mobile-ear-left-enter {
          opacity: 0;
          animation: mobileBunnyEnterEar 0.3s ease-out 0.1s forwards, mobileLeftEarTwitch 5s ease-in-out 0.4s infinite;
          transform-origin: bottom center;
          transform-box: fill-box;
        }
        .mobile-ear-right-enter {
          opacity: 0;
          animation: mobileBunnyEnterEar 0.3s ease-out 0.15s forwards, mobileRightEarTwitch 5s ease-in-out 0.45s infinite;
          transform-origin: bottom center;
          transform-box: fill-box;
        }
        /* Idle state (after entrance) */
        .mobile-ear-left-idle {
          animation: mobileLeftEarTwitch 5s ease-in-out infinite;
          transform-origin: bottom center;
          transform-box: fill-box;
        }
        .mobile-ear-right-idle {
          animation: mobileRightEarTwitch 5s ease-in-out infinite;
          transform-origin: bottom center;
          transform-box: fill-box;
        }
        /* Forensic perk state (after entrance) */
        .mobile-ear-left-idle.forensic-perk {
          animation: mobileForensicLeftEarPerk 0.8s ease-out, mobileLeftEarTwitch 5s ease-in-out 0.8s infinite;
        }
        .mobile-ear-right-idle.forensic-perk {
          animation: mobileForensicRightEarPerk 0.8s ease-out, mobileRightEarTwitch 5s ease-in-out 0.8s infinite;
        }
        .mobile-face-enter {
          opacity: 0;
          animation: mobileBunnyEnterFace 0.3s ease-out 0.25s forwards;
          transform-origin: center;
          transform-box: fill-box;
        }
        .mobile-eye-left-enter {
          opacity: 0;
          animation: mobileBunnyEnterEye 0.3s ease-out 0.35s forwards, mobileLeftEyeMove 5s ease-in-out 0.65s infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        .mobile-eye-right-enter {
          opacity: 0;
          animation: mobileBunnyEnterEye 0.3s ease-out 0.4s forwards, mobileRightEyeMove 5s ease-in-out 0.7s infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        .mobile-eye-left-idle {
          animation: mobileLeftEyeMove 5s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        .mobile-eye-right-idle {
          animation: mobileRightEyeMove 5s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
        .mobile-x-eye {
          transition: opacity 0.2s ease-out;
        }
      `}</style>
      <path
        key={isForensic ? `mobile-left-ear-forensic-${forensicPerkKey}` : 'mobile-left-ear'}
        className={earLeftClass}
        d="M3.738 10.2164L7.224 2.007H9.167L5.676 10.2164H3.738ZM10.791 6.42705C10.791 5.90346 10.726 5.42764 10.596 4.99959C10.47 4.57155 10.292 4.16643 10.063 3.78425C9.833 3.39825 9.56 3.01797 9.243 2.64343C8.926 2.26507 8.767 2.07589 8.767 2.07589L10.24 0.957996C10.24 0.957996 10.433 1.17203 10.819 1.60007C11.209 2.0243 11.559 2.49056 11.869 2.99886C12.178 3.50717 12.413 4.04222 12.574 4.60403C12.734 5.16584 12.814 5.77352 12.814 6.42705C12.814 7.10734 12.73 7.7303 12.562 8.29593C12.394 8.85774 12.153 9.3966 11.84 9.9126C11.526 10.4247 11.181 10.8833 10.802 11.2884C10.428 11.6974 10.24 11.9018 10.24 11.9018L8.767 10.7839C8.767 10.7839 8.924 10.5948 9.237 10.2164C9.554 9.8419 9.83 9.4597 10.063 9.06985C10.3 8.6762 10.479 8.26726 10.602 7.84304C10.728 7.41499 10.791 6.943 10.791 6.42705Z"
        fill={color}
        style={{ transition: 'fill 0.2s ease-out' }}
      />
      <path
        key={isForensic ? `mobile-right-ear-forensic-${forensicPerkKey}` : 'mobile-right-ear'}
        className={earRightClass}
        d="M15.003 10.2164L18.489 2.007H20.432L16.941 10.2164H15.003ZM22.056 6.42705C22.056 5.90346 21.991 5.42764 21.861 4.99959C21.735 4.57155 21.557 4.16643 21.328 3.78425C21.098 3.39825 20.825 3.01797 20.508 2.64343C20.191 2.26507 20.032 2.07589 20.032 2.07589L21.505 0.957996C21.505 0.957996 21.698 1.17203 22.084 1.60007C22.474 2.0243 22.824 2.49056 23.133 2.99886C23.443 3.50717 23.678 4.04222 23.839 4.60403C23.999 5.16584 24.079 5.77352 24.079 6.42705C24.079 7.10734 23.995 7.7303 23.827 8.29593C23.659 8.85774 23.418 9.3966 23.105 9.9126C22.791 10.4247 22.445 10.8833 22.067 11.2884C21.693 11.6974 21.505 11.9018 21.505 11.9018L20.032 10.7839C20.032 10.7839 20.189 10.5948 20.502 10.2164C20.819 9.8419 21.094 9.4597 21.328 9.06985C21.565 8.6762 21.744 8.26726 21.866 7.84304C21.993 7.41499 22.056 6.943 22.056 6.42705Z"
        fill={color}
        style={{ transition: 'fill 0.2s ease-out' }}
      />
      <path
        className={hasEntered ? '' : 'mobile-face-enter'}
        d="M2.03 20.4328C2.03 20.9564 2.093 21.4322 2.219 21.8602C2.345 22.2883 2.523 22.6953 2.752 23.0813C2.981 23.4635 3.254 23.8419 3.572 24.2164C3.889 24.5948 4.047 24.7839 4.047 24.7839L2.574 25.9018C2.574 25.9018 2.379 25.6878 1.989 25.2598C1.603 24.8355 1.256 24.3693 0.946 23.861C0.636 23.3527 0.401 22.8176 0.241 22.2558C0.08 21.694 0 21.0863 0 20.4328C0 19.7525 0.084 19.1314 0.252 18.5696C0.421 18.004 0.661 17.4651 0.975 16.953C1.288 16.4371 1.632 15.9765 2.007 15.5714C2.385 15.1625 2.574 14.958 2.574 14.958L4.047 16.0759C4.047 16.0759 3.889 16.2651 3.572 16.6434C3.258 17.018 2.983 17.4021 2.746 17.7957C2.513 18.1855 2.335 18.5945 2.213 19.0225C2.091 19.4467 2.03 19.9168 2.03 20.4328ZM23.687 20.4271C23.687 19.9035 23.622 19.4276 23.492 18.9996C23.366 18.5715 23.188 18.1664 22.959 17.7843C22.729 17.3982 22.456 17.018 22.139 16.6434C21.822 16.2651 21.663 16.0759 21.663 16.0759L23.136 14.958C23.136 14.958 23.329 15.172 23.715 15.6001C24.105 16.0243 24.455 16.4906 24.765 16.9989C25.074 17.5072 25.309 18.0422 25.47 18.604C25.63 19.1658 25.71 19.7735 25.71 20.4271C25.71 21.1073 25.626 21.7303 25.458 22.2959C25.29 22.8577 25.049 23.3966 24.736 23.9126C24.422 24.4247 24.077 24.8833 23.698 25.2884C23.324 25.6974 23.136 25.9018 23.136 25.9018L21.663 24.7839C21.663 24.7839 21.82 24.5948 22.133 24.2164C22.45 23.8419 22.726 23.4597 22.959 23.0698C23.196 22.6762 23.375 22.2673 23.498 21.843C23.624 21.415 23.687 20.943 23.687 20.4271Z"
        fill={color}
        style={{ transition: 'fill 0.2s ease-out' }}
      />
      <circle
        className={hasEntered ? 'mobile-eye-left-idle' : 'mobile-eye-left-enter'}
        cx="8.277"
        cy="20.466"
        r="1.8"
        fill={color}
        style={{ opacity: isForensic ? 0 : undefined, transition: 'fill 0.2s ease-out, opacity 0.2s ease-out' }}
      />
      <circle
        className={hasEntered ? 'mobile-eye-right-idle' : 'mobile-eye-right-enter'}
        cx="19.878"
        cy="20.466"
        r="1.8"
        fill={color}
        style={{ opacity: isForensic ? 0 : undefined, transition: 'fill 0.2s ease-out, opacity 0.2s ease-out' }}
      />
      <g className="mobile-x-eye" stroke={color} strokeWidth="1.5" strokeLinecap="round" style={{ opacity: isForensic ? 1 : 0, transition: 'opacity 0.2s ease-out, stroke 0.2s ease-out' }}>
        <line x1="6.5" y1="18.7" x2="10" y2="22.2" />
        <line x1="10" y1="18.7" x2="6.5" y2="22.2" />
      </g>
      <g className="mobile-x-eye" stroke={color} strokeWidth="1.5" strokeLinecap="round" style={{ opacity: isForensic ? 1 : 0, transition: 'opacity 0.2s ease-out, stroke 0.2s ease-out' }}>
        <line x1="18.1" y1="18.7" x2="21.6" y2="22.2" />
        <line x1="21.6" y1="18.7" x2="18.1" y2="22.2" />
      </g>
    </svg>
  );
}

function MobileTypedLogo({ isForensic }: { isForensic: boolean }) {
  const text = "/agentation";
  const [showBunny, setShowBunny] = useState(false);
  const [showText, setShowText] = useState(false);

  // Bunny entrance time before text starts
  const bunnyEntranceTime = 0.5;

  // Text delays - offset by bunny entrance time
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
  ].map(d => d + bunnyEntranceTime);

  useEffect(() => {
    // Show bunny immediately
    setShowBunny(true);
    // Start text after bunny entrance
    const timer = setTimeout(() => setShowText(true), bunnyEntranceTime * 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mobile-typed-logo">
      <div className={`mobile-bunny-container${showBunny ? ' show' : ''}`}>
        {showBunny && <MobileForensicBunny isForensic={isForensic} />}
      </div>
      <div>
        {showText && text.split('').map((char, i) => (
          <span
            key={i}
            className="mobile-typed-char"
            style={{
              color: i === 0 ? '#4C74FF' : 'inherit',
              animationDelay: `${delays[i] - delays[0]}s`,
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isForensic, setIsForensic] = useState(false);
  const pathname = usePathname();

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

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // CSS handles display:none on desktop, so always render

  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-header">
        <Link href="/" style={{ display: 'flex', color: '#E5484D' }}>
          <svg width="86" height="19" viewBox="0 0 676 151" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M79.6666 100.561L104.863 15.5213C107.828 4.03448 99.1201 -3.00582 88.7449 1.25541L3.52015 39.6065C1.48217 40.5329 0 42.7562 0 45.1647C0 48.6848 2.77907 51.4639 6.29922 51.4639C7.22558 51.4639 8.15193 51.2786 9.07829 50.9081L93.7472 12.7422C97.2674 11.0748 93.7472 8.29572 92.6356 12.1864L67.624 97.2259C66.5123 100.931 69.4767 105.193 73.7379 105.193C76.517 105.193 79.1108 103.155 79.6666 100.561ZM663.641 100.005C665.679 107.231 677.537 104.081 675.499 96.8553L666.05 66.2856C663.456 57.7631 655.489 55.7251 648.82 61.098L618.991 86.6654C617.324 87.9623 621.029 89.815 621.214 88.1476L625.846 61.6538C626.958 55.3546 624.179 50.5375 615.841 50.5375L579.158 51.0934C576.008 51.0934 578.417 53.8724 578.417 57.022C578.417 60.1716 580.825 61.6538 583.975 61.6538L616.212 60.9127C616.397 60.9127 614.544 59.6158 614.544 59.8011L609.727 88.7034C607.875 99.6344 617.694 102.784 626.031 95.7437L655.86 70.1763L654.192 69.6205L663.641 100.005ZM571.191 89.0739C555.443 88.7034 562.298 61.4685 578.787 61.8391C594.72 62.0243 587.124 89.2592 571.191 89.0739ZM571.006 100.375C601.575 100.931 611.024 51.6492 579.158 51.0934C547.847 50.5375 540.065 99.8197 571.006 100.375ZM521.909 46.4616C525.985 46.4616 529.505 42.9414 529.505 38.6802C529.505 34.4189 525.985 31.0841 521.909 31.0841C517.833 31.0841 514.127 34.6042 514.127 38.6802C514.127 42.7562 517.648 46.4616 521.909 46.4616ZM472.256 103.525C493.192 103.71 515.98 73.3259 519.13 62.3949L509.866 60.9127C505.234 73.3259 497.638 101.672 519.871 102.043C536.545 102.228 552.479 85.3685 563.595 70.1763C564.151 69.2499 564.706 68.1383 564.706 66.8414C564.706 63.6918 563.965 61.098 560.816 61.098C558.963 61.098 557.296 62.0243 556.184 63.5065C546.365 77.0313 530.802 90.9266 522.094 90.7414C511.904 90.5561 517.462 71.4732 519.871 64.9887C523.391 55.7251 512.831 53.5019 509.681 60.9127C506.531 68.6941 488.19 92.4088 475.035 92.2235C467.439 92.0383 464.29 83.8863 472.441 59.9864L486.707 17.7445C487.634 14.4097 485.41 10.519 481.334 10.519C478.741 10.519 476.517 12.1864 475.962 14.4097L461.696 56.4662C451.506 86.4801 455.211 103.155 472.256 103.525ZM447.43 42.5709L496.527 41.4593C499.306 41.4593 501.529 39.0507 501.529 36.2717C501.529 33.3073 499.306 31.0841 496.341 31.0841L447.245 32.1957C444.466 32.1957 442.242 34.4189 442.242 37.3833C442.242 40.1624 444.466 42.5709 447.43 42.5709ZM422.974 106.304C435.387 106.489 457.249 94.8173 472.441 53.8724C473.553 50.7228 472.071 48.3143 468.365 48.3143C466.142 48.3143 464.29 49.6112 463.548 51.6492C450.394 87.2212 431.682 96.1142 424.456 95.929C419.454 95.929 417.972 93.3352 418.713 85.5538C419.454 78.1429 410.376 74.9933 406.114 81.1073C401.297 87.777 394.442 94.2615 385.549 94.0763C370.172 93.891 376.471 67.0267 399.815 67.3972C408.338 67.5825 414.452 71.4732 417.045 76.6608C417.786 78.3282 419.454 79.6251 421.492 79.6251C424.271 79.6251 426.679 77.2166 426.679 74.4375C426.679 73.6964 426.494 72.9553 426.124 72.2143C421.862 63.6918 412.414 57.3926 400 57.2073C363.502 56.6515 353.497 104.451 383.326 104.822C397.036 105.193 410.005 94.0763 413.34 85.9243C412.599 86.8507 408.338 86.6654 408.523 84.4422C407.411 97.4111 410.931 106.119 422.974 106.304ZM335.897 104.266C335.897 115.012 347.569 117.606 347.569 103.34C347.569 89.0739 358.5 54.4282 361.464 45.1647L396.666 43.6825C405.929 43.1267 404.262 33.1221 397.036 33.3073L364.984 34.4189L368.875 22.7469C369.801 20.1531 370.542 17.9298 370.542 16.2624C370.542 13.4833 368.504 11.8159 365.911 11.8159C362.946 11.8159 360.352 12.7422 357.573 21.0794L352.942 35.16L330.153 36.0864C326.263 36.4569 323.483 38.1244 323.483 41.6445C323.483 45.5352 326.448 47.0174 330.709 46.8321L349.421 45.9058C345.901 56.6515 335.897 90.7414 335.897 104.266ZM186.939 78.6988C193.979 56.4662 212.877 54.984 212.877 62.9507C212.877 68.3236 203.984 77.0313 186.939 78.6988ZM113.942 150.955C142.844 152.437 159.704 111.492 160.63 80.5515C161.556 73.3259 153.96 70.3616 148.773 75.7344C141.918 83.1453 129.505 93.1499 119.685 93.1499C103.011 93.1499 116.165 59.8011 143.956 59.8011C149.514 59.8011 153.59 61.6538 156.184 64.0623C160.815 68.3236 170.82 62.0243 165.818 56.0957C161.927 51.4639 155.072 48.129 144.882 48.129C102.455 48.129 83.7426 105.007 116.721 105.007C134.692 105.007 151.367 88.3329 155.257 82.7747C154.516 83.5158 149.329 81.2925 149.699 79.4398L149.143 83.5158C148.958 107.045 134.322 141.506 116.536 139.838C113.386 139.468 112.089 137.43 112.089 134.836C112.089 128.907 122.094 119.273 145.067 113.53C159.518 109.824 152.293 101.487 143.4 104.081C111.163 113.53 99.6759 127.425 99.6759 137.8C99.6759 145.026 105.605 150.584 113.942 150.955ZM194.72 109.454C214.359 109.454 239 95.3732 251.228 77.9577C250.301 82.96 246.596 96.8553 246.596 101.487C246.596 110.01 254.748 109.454 261.232 102.784L288.097 75.5491L290.32 85.7391C293.284 99.4491 299.213 104.822 308.847 104.822C326.263 104.822 342.196 85.7391 349.421 74.8081L344.049 63.6918C339.787 74.8081 321.631 92.5941 311.626 92.5941C306.994 92.5941 304.771 89.815 303.289 83.7011L300.325 71.2879C297.916 60.7275 289.023 58.3189 279.018 68.1383L261.788 84.8127L264.382 69.991C266.235 59.2453 255.674 58.1337 250.116 65.915C241.779 77.0313 216.767 97.7817 196.387 97.7817C187.865 97.7817 185.456 93.7057 185.456 88.3329C230.848 84.998 239.185 47.2027 208.986 47.2027C172.858 47.2027 157.11 109.454 194.72 109.454Z" fill="currentColor"/>
          </svg>
        </Link>
        <button
          className={`mobile-nav-toggle ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className="mobile-nav-icon">
            <span />
            <span />
          </span>
        </button>
      </div>

      <div className={`mobile-nav-links ${isOpen ? "open" : ""}`}>
        <div className="mobile-nav-links-inner">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-nav-link ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
