import { Palette } from '@/constants/theme';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View, ViewStyle } from 'react-native';

export interface AvatarProps {
  size?: number;
  name?: string;
  uri?: string;
  source?: ImageSourcePropType;
  style?: ViewStyle;
}

export function Avatar({ size = 36, name, uri, source, style }: AvatarProps) {
  const borderRadius = size / 2;
  const initials = (name ?? '?')
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (uri || source) {
    return <Image source={source ?? { uri }} style={[{ width: size, height: size, borderRadius }, style]} />;
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius }, style]}>
      <Text style={{ color: '#fff', fontWeight: '700' }}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.blue[600],
  },
});

export default Avatar;


