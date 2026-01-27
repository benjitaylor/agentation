import { useRef, useEffect, useMemo } from 'react';
import { Animated } from 'react-native';
import { SPRING_BOUNCY, SPRING_SMOOTH, DELAYS, TIMING } from '../utils/animations';

export interface ToolbarAnimationValues {
  expandAnim: Animated.Value;
  settingsAnim: Animated.Value;
  settingsScale: Animated.Value;
  settingsTranslateY: Animated.Value;
  entranceScale: Animated.Value;
  entranceRotate: Animated.Value;
  entranceOpacity: Animated.Value;
  badgeScale: Animated.Value;
  fabOpacity: Animated.AnimatedInterpolation<number>;
  toolbarOpacity: Animated.Value;
  settingsOpacity: Animated.Value;
  entranceRotateInterpolate: Animated.AnimatedInterpolation<string>;
}

export function useToolbarAnimations(
  isExpanded: boolean,
  showSettingsMenu: boolean,
  annotationCount: number
): ToolbarAnimationValues {
  const expandAnim = useRef(new Animated.Value(0)).current;
  const settingsAnim = useRef(new Animated.Value(0)).current;
  const settingsScale = useRef(new Animated.Value(0.95)).current;
  const settingsTranslateY = useRef(new Animated.Value(10)).current;
  const entranceScale = useRef(new Animated.Value(0.5)).current;
  const entranceRotate = useRef(new Animated.Value(90)).current;
  const entranceOpacity = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;
  const hadBadge = useRef(false);
  const badgeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isUnmountedRef = useRef(false);

  const fabOpacity = useMemo(() => expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  }), [expandAnim]);

  // toolbarOpacity removed - was identity interpolation (0→0, 1→1), expandAnim used directly

  const entranceRotateInterpolate = useMemo(() => entranceRotate.interpolate({
    inputRange: [0, 90],
    outputRange: ['0deg', '90deg'],
  }), [entranceRotate]);

  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      if (badgeTimeoutRef.current) {
        clearTimeout(badgeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(entranceScale, {
        toValue: 1,
        friction: SPRING_BOUNCY.friction,
        tension: SPRING_BOUNCY.tension,
        useNativeDriver: true,
      }),
      Animated.spring(entranceRotate, {
        toValue: 0,
        friction: SPRING_BOUNCY.friction,
        tension: SPRING_BOUNCY.tension,
        useNativeDriver: true,
      }),
      Animated.timing(entranceOpacity, {
        toValue: 1,
        duration: TIMING.normal,
        useNativeDriver: true,
      }),
    ]).start();
  }, [entranceScale, entranceRotate, entranceOpacity]);

  useEffect(() => {
    if (badgeTimeoutRef.current) {
      clearTimeout(badgeTimeoutRef.current);
      badgeTimeoutRef.current = undefined;
    }

    if (annotationCount > 0 && !hadBadge.current) {
      hadBadge.current = true;
      badgeScale.setValue(0);
      badgeTimeoutRef.current = setTimeout(() => {
        Animated.spring(badgeScale, {
          toValue: 1,
          friction: SPRING_BOUNCY.friction,
          tension: SPRING_BOUNCY.tension,
          useNativeDriver: true,
        }).start();
      }, DELAYS.badgeEntrance);
    } else if (annotationCount === 0) {
      hadBadge.current = false;
      badgeScale.setValue(0);
    }
  }, [annotationCount, badgeScale]);

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: TIMING.normal,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, expandAnim]);

  useEffect(() => {
    if (showSettingsMenu) {
      Animated.parallel([
        Animated.spring(settingsScale, {
          toValue: 1,
          friction: SPRING_SMOOTH.friction,
          tension: SPRING_SMOOTH.tension,
          useNativeDriver: true,
        }),
        Animated.spring(settingsTranslateY, {
          toValue: 0,
          friction: SPRING_SMOOTH.friction,
          tension: SPRING_SMOOTH.tension,
          useNativeDriver: true,
        }),
        Animated.timing(settingsAnim, {
          toValue: 1,
          duration: TIMING.normal,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(settingsScale, {
          toValue: 0.95,
          duration: TIMING.fast,
          useNativeDriver: true,
        }),
        Animated.timing(settingsTranslateY, {
          toValue: 20,
          duration: TIMING.fast,
          useNativeDriver: true,
        }),
        Animated.timing(settingsAnim, {
          toValue: 0,
          duration: TIMING.fast,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (!isUnmountedRef.current) {
          settingsScale.setValue(0.95);
          settingsTranslateY.setValue(10);
        }
      });
    }
  }, [showSettingsMenu, settingsAnim, settingsScale, settingsTranslateY]);

  return {
    expandAnim,
    settingsAnim,
    settingsScale,
    settingsTranslateY,
    entranceScale,
    entranceRotate,
    entranceOpacity,
    badgeScale,
    fabOpacity,
    toolbarOpacity: expandAnim,
    settingsOpacity: settingsAnim,
    entranceRotateInterpolate,
  };
}
