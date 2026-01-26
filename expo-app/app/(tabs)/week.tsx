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
import { TRAINING_PLAN, getAllDaysInOrder } from '../../data/workouts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export default function WeekScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { appState, isLoading } = useAppState();
  const today = new Date().getDay();

  const getTypeIcon = (day: string): string => {
    const workout = TRAINING_PLAN.find((w) => w.day === day);
    if (!workout) return 'calendar';

    const firstSection = workout.sections[0];
    if (!firstSection || !firstSection.exercises.length) return 'calendar';

    const firstType = firstSection.exercises[0].type;
    if (firstType === 'cardio') return 'walk';
    if (firstType === 'strength') return 'barbell';
    return 'fitness';
  };

  const getDayCompletion = (day: string) => {
    const todayDate = new Date().toISOString().split('T')[0];
    return appState.workoutCompletions.find(
      (c) => c.day === day && c.date.startsWith(todayDate)
    );
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
          <Text style={[styles.title, { color: colors.foreground }]}>
            Weekly Plan
          </Text>
          <View style={styles.weekInfo}>
            <Text style={[styles.weekText, { color: colors.mutedForeground }]}>
              Week {appState.weeklyProgression.weekNumber}
            </Text>
            {appState.weeklyProgression.isDeloadWeek && (
              <Badge variant="secondary">Deload Week</Badge>
            )}
          </View>
        </View>

        {/* Weekly Overview */}
        <View style={styles.workoutsList}>
          {TRAINING_PLAN.map((workout, idx) => {
            const isToday = idx === today;
            const completion = getDayCompletion(workout.day);
            const totalExercises = workout.sections.reduce(
              (acc, section) => acc + section.exercises.length,
              0
            );
            const iconName = getTypeIcon(workout.day);

            return (
              <TouchableOpacity
                key={workout.day}
                onPress={() => router.push(`/workout/${workout.day}`)}
                activeOpacity={0.7}
              >
                <Card
                  style={{
                    ...styles.workoutCard,
                    ...(isToday && {
                      borderWidth: 2,
                      borderColor: colors.primary,
                    }),
                  }}
                >
                  <CardContent style={styles.workoutContent}>
                    <View style={styles.workoutRow}>
                      {/* Day Icon */}
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: colors.muted },
                        ]}
                      >
                        <Ionicons
                          name={iconName as any}
                          size={24}
                          color={colors.primary}
                        />
                      </View>

                      {/* Workout Info */}
                      <View style={styles.workoutInfo}>
                        <View style={styles.dayRow}>
                          <Text
                            style={[styles.dayText, { color: colors.foreground }]}
                          >
                            {workout.day.charAt(0).toUpperCase() +
                              workout.day.slice(1)}
                          </Text>
                          {isToday && <Badge variant="default">Today</Badge>}
                        </View>
                        <Text
                          style={[
                            styles.workoutTitle,
                            { color: colors.foreground },
                          ]}
                        >
                          {workout.title}
                        </Text>
                        <Text
                          style={[styles.goalText, { color: colors.mutedForeground }]}
                          numberOfLines={1}
                        >
                          {workout.primaryGoal}
                        </Text>
                        <Text
                          style={[
                            styles.exerciseCount,
                            { color: colors.mutedForeground },
                          ]}
                        >
                          {totalExercises} exercises
                        </Text>
                      </View>

                      {/* Status */}
                      <View style={styles.statusContainer}>
                        <Ionicons
                          name={
                            completion?.completed
                              ? 'checkmark-circle'
                              : 'ellipse-outline'
                          }
                          size={24}
                          color={
                            completion?.completed
                              ? colors.primary
                              : colors.mutedForeground
                          }
                        />
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color={colors.mutedForeground}
                        />
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Program Notes */}
        <Card style={styles.notesCard}>
          <CardHeader>
            <CardTitle style={styles.notesTitle}>Program Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.notesSection}>
              <Text style={[styles.notesHeader, { color: colors.foreground }]}>
                Weekly Progression
              </Text>
              <View style={styles.notesList}>
                <Text
                  style={[styles.noteItem, { color: colors.mutedForeground }]}
                >
                  • Strength: Add 2.5 kg every 1-2 weeks
                </Text>
                <Text
                  style={[styles.noteItem, { color: colors.mutedForeground }]}
                >
                  • Running: Increase volume by max 10%
                </Text>
                <Text
                  style={[styles.noteItem, { color: colors.mutedForeground }]}
                >
                  • Deload: Every 4th week (40-50% volume)
                </Text>
              </View>
            </View>
            <View style={styles.notesSection}>
              <Text style={[styles.notesHeader, { color: colors.foreground }]}>
                Recovery Keys
              </Text>
              <View style={styles.notesList}>
                <Text
                  style={[styles.noteItem, { color: colors.mutedForeground }]}
                >
                  • Sleep: 7-9 hours
                </Text>
                <Text
                  style={[styles.noteItem, { color: colors.mutedForeground }]}
                >
                  • Protein: 1.8-2.2 g/kg
                </Text>
                <Text
                  style={[styles.noteItem, { color: colors.mutedForeground }]}
                >
                  • Daily mobility work
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
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
  workoutsList: {
    gap: 12,
    marginBottom: 24,
  },
  workoutCard: {
    marginBottom: 0,
  },
  workoutContent: {
    padding: 16,
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  workoutTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  goalText: {
    fontSize: 12,
    marginTop: 2,
  },
  exerciseCount: {
    fontSize: 12,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notesCard: {
    marginTop: 8,
  },
  notesTitle: {
    fontSize: 18,
  },
  notesSection: {
    marginBottom: 16,
  },
  notesHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  notesList: {
    gap: 4,
  },
  noteItem: {
    fontSize: 14,
  },
});
