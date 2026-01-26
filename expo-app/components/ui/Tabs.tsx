import React, { createContext, useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/theme-context';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

interface TabsListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Tabs({ defaultValue, children, style }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <View style={[styles.tabs, style]}>{children}</View>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, style }: TabsListProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.tabsList,
        { backgroundColor: colors.muted },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  const { colors } = useTheme();

  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs');
  }

  const isActive = context.activeTab === value;

  return (
    <TouchableOpacity
      onPress={() => context.setActiveTab(value)}
      style={[
        styles.tabsTrigger,
        {
          backgroundColor: isActive ? colors.background : 'transparent',
        },
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.tabsTriggerText,
          {
            color: isActive ? colors.foreground : colors.mutedForeground,
            fontWeight: isActive ? '600' : '400',
          },
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export function TabsContent({ value, children, style }: TabsContentProps) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabsContent must be used within Tabs');
  }

  if (context.activeTab !== value) {
    return null;
  }

  return <View style={[styles.tabsContent, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  tabs: {
    width: '100%',
  },
  tabsList: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 0,
  },
  tabsTrigger: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },
  tabsTriggerText: {
    fontSize: 14,
  },
  tabsContent: {
    marginTop: 16,
  },
});
