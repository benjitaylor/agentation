import { useEffect, useState } from "react";

export function useShadowRoot(ref: React.RefObject<HTMLElement>) {
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | Document>(
    () => (typeof document !== "undefined" ? document : null!)
  );

  useEffect(() => {
    if (ref.current) {
      setShadowRoot((ref.current.getRootNode() as ShadowRoot) ?? document);
    }
  }, []);

  return shadowRoot;
}