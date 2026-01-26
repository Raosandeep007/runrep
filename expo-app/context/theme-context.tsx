import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface Colors {
  primary: string;
  primaryForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  secondary: string;
  secondaryForeground: string;
  destructive: string;
  destructiveForeground: string;
  accent: string;
  accentForeground: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
}

const lightColors: Colors = {
  primary: '#FA7A17',
  primaryForeground: '#FFFFFF',
  background: '#FFFFFF',
  foreground: '#1C1917',
  card: '#FFFFFF',
  cardForeground: '#1C1917',
  muted: '#F5F5F4',
  mutedForeground: '#78716C',
  border: '#E7E5E4',
  secondary: '#F5F5F4',
  secondaryForeground: '#1C1917',
  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',
  accent: '#F5F5F4',
  accentForeground: '#1C1917',
  chart1: '#FA7A17',
  chart2: '#2563EB',
  chart3: '#10B981',
  chart4: '#F59E0B',
  chart5: '#8B5CF6',
};

const darkColors: Colors = {
  primary: '#FA7A17',
  primaryForeground: '#FFFFFF',
  background: '#0C0A09',
  foreground: '#F5F5F4',
  card: '#1C1917',
  cardForeground: '#F5F5F4',
  muted: '#292524',
  mutedForeground: '#A8A29E',
  border: '#292524',
  secondary: '#292524',
  secondaryForeground: '#F5F5F4',
  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',
  accent: '#292524',
  accentForeground: '#F5F5F4',
  chart1: '#FA7A17',
  chart2: '#3B82F6',
  chart3: '#34D399',
  chart4: '#FBBF24',
  chart5: '#A78BFA',
};

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  colors: Colors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'runrep-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const isDark = theme === 'system'
    ? systemColorScheme === 'dark'
    : theme === 'dark';

  const colors = isDark ? darkColors : lightColors;

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { lightColors, darkColors };
export type { Colors, ThemeMode };
