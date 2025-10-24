import { Appearance } from 'react-native';
import { useThemeOverride } from './theme-provider';

export function useColorScheme(): 'light' | 'dark' {
  try {
    const { colorScheme } = useThemeOverride();
    return colorScheme;
  } catch {
    const scheme = Appearance.getColorScheme();
    return scheme === 'dark' ? 'dark' : 'light';
  }
}
