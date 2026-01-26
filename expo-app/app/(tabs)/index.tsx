import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/theme-context';
import { useAppState } from '../../lib/hooks/use-app-state';
import { getTodaysWorkout, getAllDaysInOrder } from '../../data/workouts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import Logo from '../../components/Logo';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const todaysWorkout = getTodaysWorkout();
  const { appState, getTodayCompletion, isLoading } = useAppState();
  const today = getAllDaysInOrder()[new Date().getDay()];
  const completion = todaysWorkout
    ? getTodayCompletion(todaysWorkout.day)
    : null;

  const totalExercises =
    todaysWorkout?.sections.reduce(
      (acc, section) => acc + section.exercises.length,
      0
    ) || 0;
  const completedExercises = completion?.exercisesCompleted.length || 0;
  const progressPercent =
    totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const isDeloadWeek = appState.weeklyProgression.isDeloadWeek;

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
          <Text style={[styles.title, { color: colors.foreground }]}>
            Dashboard
          </Text>
          <View style={styles.weekInfo}>
            <Text style={[styles.weekText, { color: colors.mutedForeground }]}>
              Week {appState.weeklyProgression.weekNumber}
            </Text>
            {isDeloadWeek && <Badge variant="secondary">Deload Week</Badge>}
          </View>
        </View>

        {/* Today's Workout Card */}
        {todaysWorkout ? (
          <Card style={styles.workoutCard}>
            <CardHeader>
              <View style={styles.workoutHeader}>
                <View style={styles.workoutInfo}>
                  <View style={styles.titleRow}>
                    <Logo size={36} color={colors.primary} />
                    <CardTitle style={styles.workoutTitle}>
                      {todaysWorkout.title}
                    </CardTitle>
                  </View>
                  <CardDescription style={styles.workoutGoal}>
                    {todaysWorkout.primaryGoal}
                  </CardDescription>
                </View>
                <Badge variant={completion?.completed ? 'default' : 'outline'}>
                  {completion?.completed ? 'Completed' : 'Pending'}
                </Badge>
              </View>
            </CardHeader>
            <CardContent style={styles.workoutContent}>
              {/* Progress Bar */}
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text
                    style={[styles.progressLabel, { color: colors.mutedForeground }]}
                  >
                    Progress
                  </Text>
                  <Text style={[styles.progressText, { color: colors.foreground }]}>
                    {completedExercises}/{totalExercises} exercises
                  </Text>
                </View>
                <Progress value={progressPercent} height={8} />
              </View>

              {/* Quick Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text
                    style={[styles.statLabel, { color: colors.mutedForeground }]}
                  >
                    Sections
                  </Text>
                  <Text style={[styles.statValue, { color: colors.foreground }]}>
                    {todaysWorkout.sections.length}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text
                    style={[styles.statLabel, { color: colors.mutedForeground }]}
                  >
                    Exercises
                  </Text>
                  <Text style={[styles.statValue, { color: colors.foreground }]}>
                    {totalExercises}
                  </Text>
                </View>
              </View>

              {/* Action Button */}
              <Button
                size="lg"
                onPress={() => router.push(`/workout/${todaysWorkout.day}`)}
                style={styles.actionButton}
              >
                <View style={styles.buttonContent}>
                  <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>
                    {completion?.completed ? 'View Workout' : 'Start Workout'}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={colors.primaryForeground}
                  />
                </View>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card style={styles.workoutCard}>
            <CardContent style={styles.noWorkoutContent}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={colors.mutedForeground}
              />
              <Text
                style={[styles.noWorkoutText, { color: colors.mutedForeground }]}
              >
                No workout scheduled for today
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push('/week')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="calendar"
                size={32}
                color={colors.primary}
              />
              <Text style={[styles.actionTitle, { color: colors.foreground }]}>
                Weekly Plan
              </Text>
              <Text
                style={[styles.actionSubtitle, { color: colors.mutedForeground }]}
              >
                View full week
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push('/progress')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="trophy"
                size={32}
                color={colors.primary}
              />
              <Text style={[styles.actionTitle, { color: colors.foreground }]}>
                Progress
              </Text>
              <Text
                style={[styles.actionSubtitle, { color: colors.mutedForeground }]}
              >
                View charts
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        {appState.workoutCompletions.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Recent Completions
            </Text>
            <View style={styles.recentList}>
              {appState.workoutCompletions
                .slice(-5)
                .reverse()
                .map((comp, idx) => (
                  <Card key={idx} style={styles.recentCard}>
                    <CardContent style={styles.recentContent}>
                      <View>
                        <Text
                          style={[styles.recentDay, { color: colors.foreground }]}
                        >
                          {comp.day.charAt(0).toUpperCase() + comp.day.slice(1)}
                        </Text>
                        <Text
                          style={[
                            styles.recentDate,
                            { color: colors.mutedForeground },
                          ]}
                        >
                          {new Date(comp.date).toLocaleDateString()}
                        </Text>
                      </View>
                      <Badge variant="outline">
                        {comp.exercisesCompleted.length} exercises
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
            </View>
          </View>
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
  weekInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  weekText: {
    fontSize: 16,
  },
  workoutCard: {
    marginBottom: 24,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  workoutInfo: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  workoutTitle: {
    fontSize: 20,
    flex: 1,
  },
  workoutGoal: {
    marginTop: 8,
  },
  workoutContent: {
    paddingTop: 16,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  actionButton: {
    marginTop: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  noWorkoutContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noWorkoutText: {
    fontSize: 16,
    marginTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  actionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  recentList: {
    gap: 8,
  },
  recentCard: {
    marginBottom: 0,
  },
  recentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  recentDay: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentDate: {
    fontSize: 12,
    marginTop: 2,
  },
});
