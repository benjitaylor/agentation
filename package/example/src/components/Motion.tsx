'use client';

import * as React from 'react';
import {
  AnimatePresence,
  motion,
  MotionConfig,
} from 'framer-motion';
import { useMeasure } from '../hooks/useMeasure';

/** Animated height wrapper - animates from height 0 to content height */
export const Height = (props: React.PropsWithChildren<React.ComponentProps<typeof motion.div>>) => {
  const [measureRef, { height = 0 }] = useMeasure<HTMLDivElement>();

  return (
    <motion.div
      {...props}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      style={{ ...props.style, overflow: 'hidden' }}
    >
      <div ref={measureRef}>{props.children}</div>
    </motion.div>
  );
};

export const Presence = AnimatePresence;
export const Config = MotionConfig;
