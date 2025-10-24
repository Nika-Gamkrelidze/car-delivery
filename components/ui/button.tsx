import { ThemedText } from '@/components/themed-text';
import { Palette, Radius, Spacing } from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, GestureResponderEvent, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: Variant;
  size?: Size;
}

export function Button({ title, onPress, disabled, loading, style, textStyle, variant = 'primary', size = 'md' }: ButtonProps) {
  const { container, label } = getStyles(variant, size, disabled);
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={[container, style]}>
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? Palette.blue[600] : '#fff'} />
      ) : (
        <ThemedText style={[label, textStyle]}>{title}</ThemedText>
      )}
    </TouchableOpacity>
  );
}

function getStyles(variant: Variant, size: Size, disabled?: boolean) {
  const base: ViewStyle = {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  };
  const paddings: Record<Size, ViewStyle> = {
    sm: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md },
    md: { paddingVertical: Spacing.sm + 2, paddingHorizontal: Spacing.lg },
    lg: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
  };
  const labelBase: TextStyle = { fontWeight: '600' };

  let container: ViewStyle = { ...base, ...paddings[size] };
  let label: TextStyle = { ...labelBase };

  switch (variant) {
    case 'primary':
      container = { ...container, backgroundColor: disabled ? Palette.blue[300] : Palette.blue[600] };
      label = { ...label, color: '#fff' };
      break;
    case 'secondary':
      container = { ...container, borderWidth: 1, borderColor: Palette.blue[600], backgroundColor: '#fff' };
      label = { ...label, color: Palette.blue[700] };
      break;
    case 'danger':
      container = { ...container, backgroundColor: disabled ? Palette.red[100] : Palette.red[600] };
      label = { ...label, color: '#fff' };
      break;
    case 'ghost':
      container = { ...container, backgroundColor: 'transparent' };
      label = { ...label, color: Palette.blue[700] };
      break;
  }

  return StyleSheet.create({ container, label });
}

export default Button;


