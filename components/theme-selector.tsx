import { ThemedText } from '@/components/themed-text';
import { Palette, Radius } from '@/constants/theme';
import { useThemeOverride } from '@/hooks/theme-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export function ThemeSelector() {
  const { preference, setPreference } = useThemeOverride();
  
  const borderColor = useThemeColor({ light: Palette.gray[300], dark: Palette.gray[700] }, 'border');
  const segmentBg = useThemeColor({ light: '#fff', dark: Palette.gray[800] }, 'surface');
  const segmentActiveBg = useThemeColor({ light: Palette.blue[50], dark: Palette.blue[900] }, 'surface');

  const Item = ({ value, label }: { value: 'system' | 'light' | 'dark'; label: string }) => {
    const active = preference === value;
    return (
      <TouchableOpacity
        style={[
          styles.segment,
          { borderColor, backgroundColor: segmentBg },
          active && { ...styles.segmentActive, backgroundColor: segmentActiveBg },
        ]}
        onPress={() => setPreference(value)}
      >
        <ThemedText style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.segmentContainer}>
      <Item value="system" label="System" />
      <Item value="light" label="Light" />
      <Item value="dark" label="Dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  segmentContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  segmentActive: {
    borderColor: Palette.blue[600],
  },
  segmentText: {
    fontWeight: '500',
  },
  segmentTextActive: {
    fontWeight: '700',
  },
});


