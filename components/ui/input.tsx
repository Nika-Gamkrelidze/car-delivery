import { Palette, Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

export interface InputProps extends TextInputProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  invalid?: boolean;
}

export function Input({ left, right, style, invalid, ...rest }: InputProps) {
  const borderColor = useThemeColor({}, 'border' as any);
  const surface = useThemeColor({}, 'surface' as any);
  const textColor = useThemeColor({}, 'text');
  return (
    <View style={[styles.wrapper, { borderColor, backgroundColor: surface }, invalid && styles.invalid]}>
      {left}
      <TextInput
        placeholderTextColor={Palette.gray[400]}
        style={[styles.input, { color: textColor }, style]}
        {...rest}
      />
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
  },
  invalid: {
    borderColor: Palette.red[600],
    backgroundColor: '#fff',
  },
});

export default Input;


