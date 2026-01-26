import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/theme-context';
import { useAppState } from '../../lib/hooks/use-app-state';
import { getWorkoutByDay, WorkoutDay } from '../../data/workouts';
import {
  Card,
  CardContent,
} from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Progress } from '../../components/ui/Progress';

export default function WorkoutDetailScreen() {
  const { day } = useLocalSearchParams<{ day: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const workout = getWorkoutByDay(day as WorkoutDay);
  const {
    addExerciseLog,
    markWorkoutComplete,
    getTodayCompletion,
    isLoading,
  } = useAppState();
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set()
  );
  const [exerciseLogs, setExerciseLogs] = useState<
    Record<string, { weight?: string; reps?: string; duration?: string }>
  >({});

  const completion = workout ? getTodayCompletion(workout.day) : null;

  useEffect(() => {
    if (completion) {
      setCompletedExercises(new Set(completion.exercisesCompleted));
    }
  }, [completion]);

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

  if (!workout) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.content}>
          <Text style={[styles.errorText, { color: colors.foreground }]}>
            Workout not found
          </Text>
          <Button variant="outline" onPress={() => router.back()}>
            <Text style={{ color: colors.foreground }}>Back to Week</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const toggleExerciseComplete = (exerciseId: string) => {
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const handleLogExercise = (exerciseId: string) => {
    const log = exerciseLogs[exerciseId];
    if (log && Object.keys(log).length > 0) {
      addExerciseLog({
        exerciseId,
        weight: log.weight ? parseFloat(log.weight) : undefined,
        reps: log.reps ? parseInt(log.reps) : undefined,
        duration: log.duration ? parseInt(log.duration) : undefined,
      });
      // Clear the log after saving
      setExerciseLogs((prev) => {
        const newLogs = { ...prev };
        delete newLogs[exerciseId];
        return newLogs;
      });
    }
    toggleExerciseComplete(exerciseId);
  };

  const handleCompleteWorkout = () => {
    markWorkoutComplete(workout.day, Array.from(completedExercises));
    router.push('/');
  };

  const totalExercises = workout.sections.reduce(
    (acc, section) => acc + section.exercises.length,
    0
  );
  const progressPercent = (completedExercises.size / totalExercises) * 100;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={colors.foreground}
              />
              <Text style={[styles.backText, { color: colors.foreground }]}>
                Back to Week
              </Text>
            </TouchableOpacity>
            <Text style={[styles.dayTitle, { color: colors.foreground }]}>
              {day?.charAt(0).toUpperCase() + day?.slice(1)}
            </Text>
            <Text style={[styles.workoutTitle, { color: colors.foreground }]}>
              {workout.title}
            </Text>
            <Text style={[styles.goalText, { color: colors.mutedForeground }]}>
              {workout.primaryGoal}
            </Text>
          </View>

          {/* Progress */}
          <Card style={styles.progressCard}>
            <CardContent style={styles.progressContent}>
              <View style={styles.progressHeader}>
                <Text
                  style={[styles.progressLabel, { color: colors.foreground }]}
                >
                  Progress
                </Text>
                <Text
                  style={[styles.progressCount, { color: colors.mutedForeground }]}
                >
                  {completedExercises.size}/{totalExercises}
                </Text>
              </View>
              <Progress value={progressPercent} height={8} />
            </CardContent>
          </Card>

          {/* Sections */}
          <View style={styles.sections}>
            {workout.sections.map((section, sectionIdx) => (
              <View key={sectionIdx} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  {section.title}
                </Text>
                {section.description && (
                  <Text
                    style={[
                      styles.sectionDescription,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {section.description}
                  </Text>
                )}
                <View style={styles.exercisesList}>
                  {section.exercises.map((exercise) => {
                    const isCompleted = completedExercises.has(exercise.id);
                    const isStrength =
                      exercise.type === 'strength' ||
                      exercise.type === 'accessory';
                    const isCardio = exercise.type === 'cardio';

                    return (
                      <Card
                        key={exercise.id}
                        style={{
                          ...styles.exerciseCard,
                          ...(isCompleted && { backgroundColor: colors.muted }),
                        }}
                      >
                        <CardContent style={styles.exerciseContent}>
                          <View style={styles.exerciseRow}>
                            {/* Checkbox */}
                            <TouchableOpacity
                              onPress={() => toggleExerciseComplete(exercise.id)}
                              style={styles.checkbox}
                              activeOpacity={0.7}
                            >
                              <Ionicons
                                name={
                                  isCompleted
                                    ? 'checkmark-circle'
                                    : 'ellipse-outline'
                                }
                                size={24}
                                color={
                                  isCompleted
                                    ? colors.primary
                                    : colors.mutedForeground
                                }
                              />
                            </TouchableOpacity>

                            {/* Exercise Details */}
                            <View style={styles.exerciseDetails}>
                              <Text
                                style={[
                                  styles.exerciseName,
                                  { color: colors.foreground },
                                ]}
                              >
                                {exercise.name}
                              </Text>
                              <View style={styles.badgesRow}>
                                {exercise.sets && (
                                  <Badge variant="outline">
                                    {exercise.sets} sets
                                  </Badge>
                                )}
                                {exercise.reps && (
                                  <Badge variant="outline">
                                    {exercise.reps} reps
                                  </Badge>
                                )}
                                {exercise.weight && (
                                  <Badge variant="outline">
                                    {exercise.weight}
                                  </Badge>
                                )}
                                {exercise.duration && (
                                  <Badge variant="outline">
                                    {exercise.duration}
                                  </Badge>
                                )}
                                {exercise.intensity && (
                                  <Badge variant="secondary">
                                    {exercise.intensity}
                                  </Badge>
                                )}
                              </View>
                              {exercise.notes && (
                                <Text
                                  style={[
                                    styles.exerciseNotes,
                                    { color: colors.mutedForeground },
                                  ]}
                                >
                                  {exercise.notes}
                                </Text>
                              )}
                              {exercise.rest && (
                                <Text
                                  style={[
                                    styles.exerciseRest,
                                    { color: colors.mutedForeground },
                                  ]}
                                >
                                  Rest: {exercise.rest}
                                </Text>
                              )}

                              {/* Log Inputs */}
                              {!isCompleted && (isStrength || isCardio) && (
                                <View style={styles.logInputs}>
                                  {isStrength && (
                                    <>
                                      <Input
                                        placeholder="Weight (kg)"
                                        keyboardType="numeric"
                                        value={
                                          exerciseLogs[exercise.id]?.weight || ''
                                        }
                                        onChangeText={(text) =>
                                          setExerciseLogs((prev) => ({
                                            ...prev,
                                            [exercise.id]: {
                                              ...prev[exercise.id],
                                              weight: text,
                                            },
                                          }))
                                        }
                                        style={styles.logInput}
                                      />
                                      <Input
                                        placeholder="Reps"
                                        keyboardType="numeric"
                                        value={
                                          exerciseLogs[exercise.id]?.reps || ''
                                        }
                                        onChangeText={(text) =>
                                          setExerciseLogs((prev) => ({
                                            ...prev,
                                            [exercise.id]: {
                                              ...prev[exercise.id],
                                              reps: text,
                                            },
                                          }))
                                        }
                                        style={styles.logInput}
                                      />
                                    </>
                                  )}
                                  {isCardio && (
                                    <Input
                                      placeholder="Duration (min)"
                                      keyboardType="numeric"
                                      value={
                                        exerciseLogs[exercise.id]?.duration || ''
                                      }
                                      onChangeText={(text) =>
                                        setExerciseLogs((prev) => ({
                                          ...prev,
                                          [exercise.id]: {
                                            ...prev[exercise.id],
                                            duration: text,
                                          },
                                        }))
                                      }
                                      style={styles.logInput}
                                    />
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onPress={() => handleLogExercise(exercise.id)}
                                  >
                                    <Text style={{ color: colors.foreground }}>
                                      Log
                                    </Text>
                                  </Button>
                                </View>
                              )}
                            </View>
                          </View>
                        </CardContent>
                      </Card>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Sticky Complete Button */}
        <View
          style={[
            styles.completeButtonContainer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
          <Button
            size="lg"
            onPress={handleCompleteWorkout}
            disabled={completedExercises.size === 0}
            style={{
              ...styles.completeButton,
              ...(completedExercises.size === 0 && { opacity: 0.5 }),
            }}
          >
            <Text style={[styles.completeButtonText, { color: colors.primaryForeground }]}>
              Complete Workout ({completedExercises.size}/{totalExercises})
            </Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 14,
  },
  dayTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
  goalText: {
    fontSize: 14,
    marginTop: 4,
  },
  progressCard: {
    marginBottom: 24,
  },
  progressContent: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressCount: {
    fontSize: 14,
  },
  sections: {
    gap: 24,
  },
  section: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  exercisesList: {
    gap: 12,
  },
  exerciseCard: {
    marginBottom: 0,
  },
  exerciseContent: {
    padding: 16,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginTop: 2,
    marginRight: 12,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseNotes: {
    fontSize: 14,
    marginTop: 8,
  },
  exerciseRest: {
    fontSize: 12,
    marginTop: 4,
  },
  logInputs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  logInput: {
    flex: 1,
    minHeight: 36,
    fontSize: 14,
  },
  completeButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  completeButton: {
    width: '100%',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
