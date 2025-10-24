import { Radius, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

export function Card({ style, ...rest }: ViewProps) {
  const borderColor = useThemeColor({}, 'border' as any);
  const surface = useThemeColor({}, 'surface' as any);
  return <View style={[styles.card, { borderColor, backgroundColor: surface }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
});

export default Card;


