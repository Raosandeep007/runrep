import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/theme-context';
import { useAppState } from '../../lib/hooks/use-app-state';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';

const screenWidth = Dimensions.get('window').width - 64;

export default function ProgressScreen() {
  const { colors, isDark } = useTheme();
  const { appState, getAllStrengthLogs, getAllRunningLogs, isLoading } =
    useAppState();

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.mutedForeground,
    style: {
      borderRadius: 0,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  // Process strength data for charts
  const strengthData = useMemo(() => {
    const logs = getAllStrengthLogs();
    const data = logs
      .slice(0, 10)
      .reverse()
      .map((log) => ({
        date: new Date(log.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        weight: log.weight || 0,
        reps: log.reps || 0,
      }));
    return data;
  }, [getAllStrengthLogs]);

  // Process running volume by week
  const runningVolumeData = useMemo(() => {
    const logs = getAllRunningLogs();
    const weeklyData: Record<string, number> = {};

    logs.forEach((log) => {
      const date = new Date(log.date);
      const weekKey = `W${
        Math.floor(
          (date.getTime() -
            new Date(appState.weeklyProgression.startDate).getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        ) + 1
      }`;
      weeklyData[weekKey] = (weeklyData[weekKey] || 0) + (log.distance || 0);
    });

    return Object.entries(weeklyData)
      .slice(0, 8)
      .map(([week, distance]) => ({
        week,
        distance: Math.round(distance * 10) / 10,
      }));
  }, [getAllRunningLogs, appState.weeklyProgression.startDate]);

  // Process pace trend data
  const paceTrendData = useMemo(() => {
    const logs = getAllRunningLogs().filter((log) => log.pace);
    return logs
      .slice(0, 10)
      .reverse()
      .map((log) => ({
        date: new Date(log.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        pace: log.pace || 0,
      }));
  }, [getAllRunningLogs]);

  const totalWorkouts = appState.workoutCompletions.length;
  const totalExercises = appState.exerciseLogs.length;
  const currentWeek = appState.weeklyProgression.weekNumber;

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

  const renderEmptyChart = (message: string) => (
    <View style={styles.emptyChart}>
      <Ionicons
        name="pulse-outline"
        size={48}
        color={colors.mutedForeground}
        style={{ opacity: 0.5 }}
      />
      <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
        {message}
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.mutedForeground }]}>
        Start logging to see your progress
      </Text>
    </View>
  );

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
          <Text style={[styles.title, { color: colors.foreground }]}>
            Progress
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Track your training journey
          </Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <Ionicons name="trophy" size={24} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {totalWorkouts}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Workouts
              </Text>
            </CardContent>
          </Card>
          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <Ionicons name="pulse" size={24} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {totalExercises}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Exercises
              </Text>
            </CardContent>
          </Card>
          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <Ionicons name="stats-chart" size={24} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {currentWeek}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Weeks
              </Text>
            </CardContent>
          </Card>
        </View>

        {/* Charts */}
        <Tabs defaultValue="strength" style={styles.tabs}>
          <TabsList>
            <TabsTrigger value="strength">Strength</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="pace">Pace</TabsTrigger>
          </TabsList>

          {/* Strength Progression Chart */}
          <TabsContent value="strength">
            <Card>
              <CardHeader>
                <View style={styles.chartHeader}>
                  <Ionicons name="stats-chart" size={20} color={colors.foreground} />
                  <CardTitle style={styles.chartTitle}>
                    Strength Progression
                  </CardTitle>
                </View>
              </CardHeader>
              <CardContent>
                {strengthData.length > 0 ? (
                  <LineChart
                    data={{
                      labels: strengthData.map((d) => d.date),
                      datasets: [
                        {
                          data: strengthData.map((d) => d.weight || 0),
                        },
                      ],
                    }}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    fromZero
                    yAxisSuffix="kg"
                  />
                ) : (
                  renderEmptyChart('No strength data logged yet')
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Running Volume Chart */}
          <TabsContent value="volume">
            <Card>
              <CardHeader>
                <View style={styles.chartHeader}>
                  <Ionicons name="pulse" size={20} color={colors.foreground} />
                  <CardTitle style={styles.chartTitle}>
                    Weekly Running Volume
                  </CardTitle>
                </View>
              </CardHeader>
              <CardContent>
                {runningVolumeData.length > 0 ? (
                  <BarChart
                    data={{
                      labels: runningVolumeData.map((d) => d.week),
                      datasets: [
                        {
                          data: runningVolumeData.map((d) => d.distance || 0),
                        },
                      ],
                    }}
                    width={screenWidth}
                    height={220}
                    chartConfig={{
                      ...chartConfig,
                      color: (opacity = 1) => colors.chart2,
                    }}
                    style={styles.chart}
                    fromZero
                    yAxisLabel=""
                    yAxisSuffix="km"
                  />
                ) : (
                  renderEmptyChart('No running data logged yet')
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pace Trend Chart */}
          <TabsContent value="pace">
            <Card>
              <CardHeader>
                <View style={styles.chartHeader}>
                  <Ionicons name="speedometer" size={20} color={colors.foreground} />
                  <CardTitle style={styles.chartTitle}>Pace Trend</CardTitle>
                </View>
              </CardHeader>
              <CardContent>
                {paceTrendData.length > 0 ? (
                  <LineChart
                    data={{
                      labels: paceTrendData.map((d) => d.date),
                      datasets: [
                        {
                          data: paceTrendData.map((d) => d.pace || 0),
                        },
                      ],
                    }}
                    width={screenWidth}
                    height={220}
                    chartConfig={{
                      ...chartConfig,
                      color: (opacity = 1) => colors.chart3,
                    }}
                    bezier
                    style={styles.chart}
                    fromZero
                    yAxisSuffix=""
                  />
                ) : (
                  renderEmptyChart('No pace data logged yet')
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Logs */}
        {appState.exerciseLogs.length > 0 && (
          <Card style={styles.recentCard}>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {appState.exerciseLogs
                .slice(-10)
                .reverse()
                .map((log, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.logItem,
                      idx < appState.exerciseLogs.slice(-10).length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <View>
                      <Text
                        style={[styles.logTitle, { color: colors.foreground }]}
                      >
                        Exercise #{log.exerciseId.slice(-4)}
                      </Text>
                      <Text
                        style={[styles.logDate, { color: colors.mutedForeground }]}
                      >
                        {new Date(log.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.logBadges}>
                      {log.weight && <Badge variant="outline">{log.weight}kg</Badge>}
                      {log.reps && <Badge variant="outline">{log.reps} reps</Badge>}
                      {log.duration && (
                        <Badge variant="outline">{log.duration}min</Badge>
                      )}
                    </View>
                  </View>
                ))}
            </CardContent>
          </Card>
        )}
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  tabs: {
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartTitle: {
    fontSize: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 0,
  },
  emptyChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  recentCard: {
    marginTop: 8,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  logDate: {
    fontSize: 12,
    marginTop: 2,
  },
  logBadges: {
    flexDirection: 'row',
    gap: 8,
  },
});
