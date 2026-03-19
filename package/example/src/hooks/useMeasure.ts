import * as React from 'react';

type Bounds = {
  width: number | undefined;
  height: number | undefined;
};

/** Measures the width/height of an element using ResizeObserver. */
export const useMeasure = <T extends HTMLElement>(): [
  React.RefObject<T>,
  Bounds,
] => {
  const ref = React.useRef<T>(null);
  const [bounds, setBounds] = React.useState<Bounds>({
    width: undefined,
    height: undefined,
  });

  React.useLayoutEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      setBounds({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return [ref, bounds];
};
