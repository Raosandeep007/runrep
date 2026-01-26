import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/theme-context';
import { useAppState } from '../../lib/hooks/use-app-state';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Switch } from '../../components/ui/Switch';

export default function SettingsScreen() {
  const { colors, theme, setTheme } = useTheme();
  const {
    appState,
    toggleDeloadWeek,
    incrementWeek,
    resetAppState,
    isLoading,
  } = useAppState();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    if (showConfirm) {
      Alert.alert(
        'Reset All Data',
        'This will permanently delete all your workout logs and progress. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setShowConfirm(false) },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: () => {
              resetAppState();
              setShowConfirm(false);
            },
          },
        ]
      );
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  const exportData = async () => {
    try {
      const dataStr = JSON.stringify(appState, null, 2);
      await Share.share({
        message: dataStr,
        title: `RunRep Backup - ${new Date().toISOString().split('T')[0]}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.mutedForeground }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="settings" size={32} color={colors.foreground} />
            <Text style={[styles.title, { color: colors.foreground }]}>
              Settings
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Manage your training preferences
          </Text>
        </View>

        {/* App Information */}
        <Card style={styles.card}>
          <CardHeader>
            <View style={styles.cardHeaderRow}>
              <Ionicons
                name="information-circle"
                size={20}
                color={colors.foreground}
              />
              <CardTitle style={styles.cardTitle}>App Information</CardTitle>
            </View>
          </CardHeader>
          <CardContent>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
                Current Week
              </Text>
              <Badge variant="outline">
                {appState.weeklyProgression.weekNumber}
              </Badge>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
                Total Workouts
              </Text>
              <Badge variant="outline">
                {appState.workoutCompletions.length}
              </Badge>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
                Total Exercises
              </Text>
              <Badge variant="outline">{appState.exerciseLogs.length}</Badge>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
                Last Sync
              </Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {new Date(appState.lastSync).toLocaleDateString()}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose your preferred theme</CardDescription>
          </CardHeader>
          <CardContent>
            <View style={styles.themeGrid}>
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onPress={() => setTheme('light')}
                style={styles.themeButton}
              >
                <View style={styles.themeButtonContent}>
                  <Ionicons
                    name="sunny"
                    size={20}
                    color={
                      theme === 'light'
                        ? colors.primaryForeground
                        : colors.foreground
                    }
                  />
                  <Text
                    style={[
                      styles.themeButtonText,
                      {
                        color:
                          theme === 'light'
                            ? colors.primaryForeground
                            : colors.foreground,
                      },
                    ]}
                  >
                    Light
                  </Text>
                </View>
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onPress={() => setTheme('dark')}
                style={styles.themeButton}
              >
                <View style={styles.themeButtonContent}>
                  <Ionicons
                    name="moon"
                    size={20}
                    color={
                      theme === 'dark'
                        ? colors.primaryForeground
                        : colors.foreground
                    }
                  />
                  <Text
                    style={[
                      styles.themeButtonText,
                      {
                        color:
                          theme === 'dark'
                            ? colors.primaryForeground
                            : colors.foreground,
                      },
                    ]}
                  >
                    Dark
                  </Text>
                </View>
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onPress={() => setTheme('system')}
                style={styles.themeButton}
              >
                <View style={styles.themeButtonContent}>
                  <Ionicons
                    name="phone-portrait"
                    size={20}
                    color={
                      theme === 'system'
                        ? colors.primaryForeground
                        : colors.foreground
                    }
                  />
                  <Text
                    style={[
                      styles.themeButtonText,
                      {
                        color:
                          theme === 'system'
                            ? colors.primaryForeground
                            : colors.foreground,
                      },
                    ]}
                  >
                    System
                  </Text>
                </View>
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* Training Settings */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Training Settings</CardTitle>
            <CardDescription>Adjust your training program</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Deload Week Toggle */}
            <View
              style={[styles.settingRow, { borderBottomColor: colors.border }]}
            >
              <View style={styles.settingInfo}>
                <Ionicons
                  name="arrow-down"
                  size={20}
                  color={colors.mutedForeground}
                />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                    Deload Week
                  </Text>
                  <Text
                    style={[styles.settingDesc, { color: colors.mutedForeground }]}
                  >
                    Reduce volume by 40-50%
                  </Text>
                </View>
              </View>
              <Switch
                checked={appState.weeklyProgression.isDeloadWeek}
                onCheckedChange={toggleDeloadWeek}
              />
            </View>

            {/* Increment Week */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name="refresh"
                  size={20}
                  color={colors.mutedForeground}
                />
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                    Start Next Week
                  </Text>
                  <Text
                    style={[styles.settingDesc, { color: colors.mutedForeground }]}
                  >
                    Move to week {appState.weeklyProgression.weekNumber + 1}
                  </Text>
                </View>
              </View>
              <Button variant="outline" size="sm" onPress={incrementWeek}>
                <Text style={{ color: colors.foreground }}>Next Week</Text>
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export or reset your data</CardDescription>
          </CardHeader>
          <CardContent style={styles.dataContent}>
            {/* Export Data */}
            <Button
              variant="outline"
              onPress={exportData}
              style={styles.dataButton}
            >
              <View style={styles.dataButtonContent}>
                <Ionicons name="download" size={16} color={colors.foreground} />
                <Text style={[styles.dataButtonText, { color: colors.foreground }]}>
                  Export Data (JSON)
                </Text>
              </View>
            </Button>

            {/* Reset Data */}
            <Button
              variant={showConfirm ? 'destructive' : 'outline'}
              onPress={handleReset}
              style={styles.dataButton}
            >
              <View style={styles.dataButtonContent}>
                <Ionicons
                  name="trash"
                  size={16}
                  color={showConfirm ? colors.destructive : colors.foreground}
                />
                <Text
                  style={[
                    styles.dataButtonText,
                    {
                      color: showConfirm
                        ? colors.destructive
                        : colors.foreground,
                    },
                  ]}
                >
                  {showConfirm ? 'Tap again to confirm' : 'Reset All Data'}
                </Text>
              </View>
            </Button>
            {showConfirm && (
              <Text style={[styles.warningText, { color: colors.destructive }]}>
                Warning: This will permanently delete all your workout logs and
                progress!
              </Text>
            )}
          </CardContent>
        </Card>

        {/* Program Info */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Program Details</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.programSection}>
              <Text style={[styles.programHeader, { color: colors.foreground }]}>
                Advanced Hybrid Training
              </Text>
              <Text
                style={[styles.programText, { color: colors.mutedForeground }]}
              >
                This program combines maximal strength training with aerobic
                development. Designed for intermediate to advanced athletes.
              </Text>
            </View>
            <View style={styles.programSection}>
              <Text style={[styles.programHeader, { color: colors.foreground }]}>
                Weekly Structure
              </Text>
              <View style={styles.programList}>
                <Text
                  style={[styles.programItem, { color: colors.mutedForeground }]}
                >
                  • 3 strength sessions (Lower, Pull, Push)
                </Text>
                <Text
                  style={[styles.programItem, { color: colors.mutedForeground }]}
                >
                  • 3 running sessions (Easy, Zone 2, Speed)
                </Text>
                <Text
                  style={[styles.programItem, { color: colors.mutedForeground }]}
                >
                  • 1 flexible recovery/arm day
                </Text>
              </View>
            </View>
            <View style={styles.programSection}>
              <Text style={[styles.programHeader, { color: colors.foreground }]}>
                Progression Rules
              </Text>
              <View style={styles.programList}>
                <Text
                  style={[styles.programItem, { color: colors.mutedForeground }]}
                >
                  • Strength: +2.5kg every 1-2 weeks
                </Text>
                <Text
                  style={[styles.programItem, { color: colors.mutedForeground }]}
                >
                  • Running: +10% volume max per week
                </Text>
                <Text
                  style={[styles.programItem, { color: colors.mutedForeground }]}
                >
                  • Deload every 4th week
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* App Info */}
        <View style={[styles.appInfo, { backgroundColor: colors.muted }]}>
          <Text style={[styles.appInfoText, { color: colors.mutedForeground }]}>
            RunRep - Hybrid Training Tracker
          </Text>
          <Text style={[styles.appInfoText, { color: colors.mutedForeground }]}>
            Your data is stored locally on your device
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    marginLeft: 44,
  },
  card: {
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
  },
  themeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 16,
  },
  themeButtonContent: {
    alignItems: 'center',
    gap: 8,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  dataContent: {
    gap: 12,
  },
  dataButton: {
    justifyContent: 'flex-start',
  },
  dataButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dataButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  warningText: {
    fontSize: 12,
    marginTop: 4,
  },
  programSection: {
    marginBottom: 16,
  },
  programHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  programText: {
    fontSize: 14,
    lineHeight: 20,
  },
  programList: {
    gap: 4,
  },
  programItem: {
    fontSize: 14,
  },
  appInfo: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  appInfoText: {
    fontSize: 12,
    marginBottom: 4,
  },
});
