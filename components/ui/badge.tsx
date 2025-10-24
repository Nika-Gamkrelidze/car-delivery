import { ThemedText } from '@/components/themed-text';
import { Palette, Radius, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export function Badge({ label, tone = 'neutral', style }: { label: string; tone?: Tone; style?: ViewStyle }) {
  const { container, text } = getStyles(tone);
  return (
    <View style={[container, style]}>
      <ThemedText style={text}>{label}</ThemedText>
    </View>
  );
}

function getStyles(tone: Tone) {
  const base: ViewStyle = {
    borderRadius: Radius.pill,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    alignSelf: 'flex-start',
  };
  let container: ViewStyle = { ...base, backgroundColor: Palette.gray[100] };
  let color = '#111827';
  switch (tone) {
    case 'success':
      container = { ...container, backgroundColor: Palette.green[100] };
      color = Palette.green[600];
      break;
    case 'warning':
      container = { ...container, backgroundColor: Palette.amber[100] };
      color = Palette.amber[600];
      break;
    case 'danger':
      container = { ...container, backgroundColor: Palette.red[100] };
      color = Palette.red[600];
      break;
    case 'info':
      container = { ...container, backgroundColor: Palette.blue[100] };
      color = Palette.blue[700];
      break;
  }
  return StyleSheet.create({ container, text: { color, fontWeight: '600' } });
}

export default Badge;


