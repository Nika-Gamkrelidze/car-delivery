import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';
import { useThemeOverride } from '@/hooks/theme-provider';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export function ThemeSelector() {
  const { preference, setPreference } = useThemeOverride();

  const Item = ({ value, label }: { value: 'system' | 'light' | 'dark'; label: string }) => {
    const active = preference === value;
    return (
      <TouchableOpacity
        style={[styles.segment, active && styles.segmentActive]}
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  segmentActive: {
    borderColor: '#2563eb',
    backgroundColor: '#dbeafe',
  },
  segmentText: {
    fontWeight: '500',
  },
  segmentTextActive: {
    fontWeight: '700',
  },
});


