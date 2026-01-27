import { useCallback, useContext } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { AgenationContext } from '../context/AgenationContext';

export interface UseAgentationScrollReturn {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle: number;
}

const NOOP_RETURN: UseAgentationScrollReturn = {
  onScroll: () => {},
  scrollEventThrottle: 16,
};

export function useAgentationScroll(): UseAgentationScrollReturn {
  if (!__DEV__) {
    return NOOP_RETURN;
  }

  const context = useContext(AgenationContext);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!context?.reportScrollOffset) return;

      const { contentOffset } = event.nativeEvent;
      context.reportScrollOffset(contentOffset.x, contentOffset.y);
    },
    [context]
  );

  if (!context) {
    return NOOP_RETURN;
  }

  return {
    onScroll,
    scrollEventThrottle: 16,
  };
}
