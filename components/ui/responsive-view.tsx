import { useBreakpoint } from '@/hooks/use-breakpoint';
import React from 'react';
import { View, ViewProps } from 'react-native';

export interface ResponsiveViewProps extends ViewProps {
  min?: 'phone' | 'tablet' | 'desktop' | 'wide';
  max?: 'phone' | 'tablet' | 'desktop' | 'wide';
}

export function ResponsiveView({ min, max, style, ...rest }: ResponsiveViewProps) {
  const { name } = useBreakpoint();
  const order = ['phone', 'tablet', 'desktop', 'wide'] as const;
  const minOk = min ? order.indexOf(name as any) >= order.indexOf(min) : true;
  const maxOk = max ? order.indexOf(name as any) <= order.indexOf(max) : true;
  if (!minOk || !maxOk) return null;
  return <View style={style} {...rest} />;
}

export default ResponsiveView;


