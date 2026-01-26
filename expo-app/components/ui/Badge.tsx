import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/theme-context';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  children,
  variant = 'default',
  style,
  textStyle,
}: BadgeProps) {
  const { colors } = useTheme();

  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 0,
    };

    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = colors.secondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.border;
        break;
      case 'destructive':
        baseStyle.backgroundColor = colors.destructive;
        break;
      default:
        baseStyle.backgroundColor = colors.primary;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontSize: 12,
      fontWeight: '500',
    };

    switch (variant) {
      case 'secondary':
        baseTextStyle.color = colors.secondaryForeground;
        break;
      case 'outline':
        baseTextStyle.color = colors.foreground;
        break;
      case 'destructive':
        baseTextStyle.color = colors.destructiveForeground;
        break;
      default:
        baseTextStyle.color = colors.primaryForeground;
    }

    return baseTextStyle;
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      {typeof children === 'string' ? (
        <Text style={[getTextStyle(), textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}
