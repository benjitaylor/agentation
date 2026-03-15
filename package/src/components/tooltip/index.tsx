import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { originalSetTimeout } from "../../utils/freeze-animations";

export const Tooltip = ({
  content,
  children,
  ...props
}: {
  content: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>) => {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height / 2,
        right: window.innerWidth - rect.left + 8,
      });
    }
  };

  const handleMouseEnter = () => {
    setShouldRender(true);
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    updatePosition();
    timeoutRef.current = originalSetTimeout(() => {
      setVisible(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
    // Keep rendered during exit animation
    exitTimeoutRef.current = originalSetTimeout(() => {
      setShouldRender(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </span>
      {shouldRender &&
        createPortal(
          <div
            data-feedback-toolbar
            style={{
              position: "fixed",
              top: position.top,
              right: position.right,
              transform: "translateY(-50%)",
              padding: "6px 10px",
              background: "#383838",
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "11px",
              fontWeight: 400,
              lineHeight: "14px",
              borderRadius: "10px",
              width: "180px",
              textAlign: "left" as const,
              zIndex: 100020,
              pointerEvents: "none" as const,
              boxShadow: "0px 1px 8px rgba(0, 0, 0, 0.28)",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.15s ease",
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};
