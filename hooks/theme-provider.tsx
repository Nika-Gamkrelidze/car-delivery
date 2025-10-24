import { getThemePreference, saveThemePreference, ThemePreference } from '@/lib/storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

type ThemeContextValue = {
  preference: ThemePreference;
  colorScheme: 'light' | 'dark';
  setPreference: (pref: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProviderOverride({ children }: { children: React.ReactNode }) {
  const [preference, setPref] = useState<ThemePreference>('system');
  const [system, setSystem] = useState<'light' | 'dark'>(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    getThemePreference().then(setPref).catch(() => {});
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystem(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => sub.remove();
  }, []);

  const colorScheme = preference === 'system' ? system : preference;

  const setPreference = (pref: ThemePreference) => {
    setPref(pref);
    saveThemePreference(pref).catch(() => {});
  };

  const value = useMemo(() => ({ preference, colorScheme, setPreference }), [preference, colorScheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeOverride(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeOverride must be used within ThemeProviderOverride');
  return ctx;
}


