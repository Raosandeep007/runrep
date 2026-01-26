"use client";

import { useLocalStorage } from "./use-local-storage";
import {
  AppState,
  DEFAULT_APP_STATE,
  ExerciseLog,
  WorkoutCompletion,
} from "../types";
import { WorkoutDay } from "@/data/workouts";
import { useCallback } from "react";

const APP_STATE_KEY = "fitness-app-state";

export function useAppState() {
  const [appState, setAppState, isLoading] = useLocalStorage<AppState>(
    APP_STATE_KEY,
    DEFAULT_APP_STATE,
  );

  // Add exercise log
  const addExerciseLog = useCallback(
    (log: Omit<ExerciseLog, "date">) => {
      const newLog: ExerciseLog = {
        ...log,
        date: new Date().toISOString(),
      };
      setAppState((prev) => ({
        ...prev,
        exerciseLogs: [...prev.exerciseLogs, newLog],
        lastSync: new Date().toISOString(),
      }));
    },
    [setAppState],
  );

  // Mark workout as complete
  const markWorkoutComplete = useCallback(
    (day: WorkoutDay, exercisesCompleted: string[]) => {
      const completion: WorkoutCompletion = {
        day,
        date: new Date().toISOString(),
        completed: true,
        exercisesCompleted,
      };
      setAppState((prev) => ({
        ...prev,
        workoutCompletions: [...prev.workoutCompletions, completion],
        lastSync: new Date().toISOString(),
      }));
    },
    [setAppState],
  );

  // Get workout completion for today
  const getTodayCompletion = useCallback(
    (day: WorkoutDay): WorkoutCompletion | null => {
      const today = new Date().toISOString().split("T")[0];
      return (
        appState.workoutCompletions.find(
          (c) => c.day === day && c.date.startsWith(today),
        ) || null
      );
    },
    [appState.workoutCompletions],
  );

  // Get logs for specific exercise
  const getExerciseLogs = useCallback(
    (exerciseId: string): ExerciseLog[] => {
      return appState.exerciseLogs
        .filter((log) => log.exerciseId === exerciseId)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    },
    [appState.exerciseLogs],
  );

  // Get all strength logs (for charts)
  const getAllStrengthLogs = useCallback((): ExerciseLog[] => {
    return appState.exerciseLogs
      .filter((log) => log.weight !== undefined)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appState.exerciseLogs]);

  // Get all running logs (for charts)
  const getAllRunningLogs = useCallback((): ExerciseLog[] => {
    return appState.exerciseLogs
      .filter((log) => log.distance !== undefined || log.pace !== undefined)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appState.exerciseLogs]);

  // Toggle deload week
  const toggleDeloadWeek = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      weeklyProgression: {
        ...prev.weeklyProgression,
        isDeloadWeek: !prev.weeklyProgression.isDeloadWeek,
      },
      lastSync: new Date().toISOString(),
    }));
  }, [setAppState]);

  // Increment week number
  const incrementWeek = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      weeklyProgression: {
        weekNumber: prev.weeklyProgression.weekNumber + 1,
        startDate: new Date().toISOString(),
        isDeloadWeek: (prev.weeklyProgression.weekNumber + 1) % 4 === 0,
      },
      lastSync: new Date().toISOString(),
    }));
  }, [setAppState]);

  // Reset all data
  const resetAppState = useCallback(() => {
    setAppState(DEFAULT_APP_STATE);
  }, [setAppState]);

  return {
    appState,
    isLoading,
    addExerciseLog,
    markWorkoutComplete,
    getTodayCompletion,
    getExerciseLogs,
    getAllStrengthLogs,
    getAllRunningLogs,
    toggleDeloadWeek,
    incrementWeek,
    resetAppState,
  };
}
