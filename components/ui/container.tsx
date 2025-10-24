import { Spacing } from '@/constants/theme';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import React from 'react';
import { View, ViewProps } from 'react-native';

export function Container({ style, ...rest }: ViewProps) {
  const { name } = useBreakpoint();
  const maxWidth = name === 'wide' ? 1280 : name === 'desktop' ? 1024 : name === 'tablet' ? 768 : undefined;
  return (
    <View
      style={[
        { width: '100%', alignSelf: 'center', paddingHorizontal: Spacing.lg },
        maxWidth ? { maxWidth } : null,
        style,
      ]}
      {...rest}
    />
  );
}

export default Container;


