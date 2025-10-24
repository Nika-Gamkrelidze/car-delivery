import { Breakpoints } from '@/constants/theme';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export type BreakpointName = keyof typeof Breakpoints; // 'phone' | 'tablet' | 'desktop' | 'wide'

export function useBreakpoint(): { width: number; height: number; name: BreakpointName } {
  const get = () => {
    const { width, height } = Dimensions.get('window');
    const name: BreakpointName = width >= Breakpoints.wide
      ? 'wide'
      : width >= Breakpoints.desktop
      ? 'desktop'
      : width >= Breakpoints.tablet
      ? 'tablet'
      : 'phone';
    return { width, height, name };
  };

  const [state, setState] = useState(get);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', () => setState(get()));
    return () => {
      // @ts-expect-error - RN types allow both patterns across versions
      if (typeof sub?.remove === 'function') sub.remove();
      // RN >= 0.65 returns { remove: fn } whereas newer returns subscription with remove
    };
  }, []);

  return state;
}

export function useIsDesktop(): boolean {
  return useBreakpoint().name === 'desktop' || useBreakpoint().name === 'wide';
}

export function useIsPhone(): boolean {
  return useBreakpoint().name === 'phone';
}


