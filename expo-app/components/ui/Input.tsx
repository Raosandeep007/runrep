import React from 'react';
import { TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '../../context/theme-context';

interface InputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

export function Input({ style, containerStyle, ...props }: InputProps) {
  const { colors } = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          color: colors.foreground,
        },
        style,
      ]}
      placeholderTextColor={colors.mutedForeground}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    minHeight: 40,
  },
});
