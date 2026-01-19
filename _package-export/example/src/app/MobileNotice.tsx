"use client";

import { useState, useEffect } from "react";

export function MobileNotice() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="mobile-notice">
      Agentation is a desktop tool. View on a larger screen to try it out.
    </div>
  );
}
