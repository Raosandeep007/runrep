import React from 'react';
import { Switch as RNSwitch, SwitchProps as RNSwitchProps } from 'react-native';
import { useTheme } from '../../context/theme-context';

interface SwitchProps extends Omit<RNSwitchProps, 'trackColor' | 'thumbColor'> {
  checked?: boolean;
  onCheckedChange?: (value: boolean) => void;
}

export function Switch({ checked, onCheckedChange, ...props }: SwitchProps) {
  const { colors } = useTheme();

  return (
    <RNSwitch
      value={checked}
      onValueChange={onCheckedChange}
      trackColor={{
        false: colors.muted,
        true: colors.primary,
      }}
      thumbColor={colors.background}
      ios_backgroundColor={colors.muted}
      {...props}
    />
  );
}
