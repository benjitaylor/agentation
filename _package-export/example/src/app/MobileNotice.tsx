// CSS handles display:none on desktop via media query
export function MobileNotice() {
  return (
    <div className="mobile-notice">
      <span className="mobile-notice-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      </span>
      Agentation is currently desktop only.
    </div>
  );
}
