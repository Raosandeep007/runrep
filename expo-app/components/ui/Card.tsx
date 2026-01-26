import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/theme-context';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return <View style={[styles.cardHeader, style]}>{children}</View>;
}

export function CardTitle({ children, style }: CardTitleProps) {
  const { colors } = useTheme();

  return (
    <Text style={[styles.cardTitle, { color: colors.cardForeground }, style]}>
      {children}
    </Text>
  );
}

export function CardDescription({ children, style }: CardDescriptionProps) {
  const { colors } = useTheme();

  return (
    <Text style={[styles.cardDescription, { color: colors.mutedForeground }, style]}>
      {children}
    </Text>
  );
}

export function CardContent({ children, style }: CardContentProps) {
  return <View style={[styles.cardContent, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  cardContent: {
    padding: 16,
    paddingTop: 0,
  },
});
