"use client";

import { useState, useEffect } from "react";
import { Agentation } from "agentation";

export function ToolbarProvider() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) return null;

  const endpoint = process.env.NODE_ENV === "development"
    ? "http://localhost:4747"
    : undefined;

  return <Agentation endpoint={endpoint} />;
}
