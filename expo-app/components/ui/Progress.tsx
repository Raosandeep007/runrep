import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/theme-context';

interface ProgressProps {
  value?: number;
  style?: ViewStyle;
  height?: number;
}

export function Progress({ value = 0, style, height = 8 }: ProgressProps) {
  const { colors } = useTheme();

  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.secondary, height },
        style,
      ]}
    >
      <View
        style={[
          styles.indicator,
          {
            backgroundColor: colors.primary,
            width: `${clampedValue}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 0,
    overflow: 'hidden',
  },
  indicator: {
    height: '100%',
    borderRadius: 0,
  },
});
