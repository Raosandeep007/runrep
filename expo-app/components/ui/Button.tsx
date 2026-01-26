import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/theme-context';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const { colors } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 0,
    };

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.paddingHorizontal = 12;
        baseStyle.paddingVertical = 6;
        baseStyle.minHeight = 32;
        break;
      case 'lg':
        baseStyle.paddingHorizontal = 20;
        baseStyle.paddingVertical = 12;
        baseStyle.minHeight = 48;
        break;
      case 'icon':
        baseStyle.width = 36;
        baseStyle.height = 36;
        baseStyle.paddingHorizontal = 0;
        baseStyle.paddingVertical = 0;
        break;
      default:
        baseStyle.paddingHorizontal = 16;
        baseStyle.paddingVertical = 8;
        baseStyle.minHeight = 40;
    }

    // Variant styles
    switch (variant) {
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.border;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
      case 'destructive':
        baseStyle.backgroundColor = colors.destructive + '20';
        break;
      case 'secondary':
        baseStyle.backgroundColor = colors.secondary;
        break;
      default:
        baseStyle.backgroundColor = colors.primary;
    }

    if (disabled || loading) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '500',
    };

    // Size styles
    switch (size) {
      case 'sm':
        baseTextStyle.fontSize = 12;
        break;
      case 'lg':
        baseTextStyle.fontSize = 16;
        break;
      default:
        baseTextStyle.fontSize = 14;
    }

    // Variant styles
    switch (variant) {
      case 'outline':
      case 'ghost':
        baseTextStyle.color = colors.foreground;
        break;
      case 'destructive':
        baseTextStyle.color = colors.destructive;
        break;
      case 'secondary':
        baseTextStyle.color = colors.secondaryForeground;
        break;
      default:
        baseTextStyle.color = colors.primaryForeground;
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'default' ? colors.primaryForeground : colors.primary}
        />
      ) : typeof children === 'string' ? (
        <Text style={[getTextStyle(), textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
