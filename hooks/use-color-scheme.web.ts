import { useEffect, useState } from 'react';
import { useThemeOverride } from './theme-provider';

export function useColorScheme(): 'light' | 'dark' {
  try {
    const { colorScheme } = useThemeOverride();
    return colorScheme;
  } catch {
    const getInitial = () => (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const [scheme, setScheme] = useState<'light' | 'dark'>(getInitial());
    useEffect(() => {
      if (!window.matchMedia) return;
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => setScheme(e.matches ? 'dark' : 'light');
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }, []);
    return scheme;
  }
}
