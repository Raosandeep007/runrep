import { WorkoutDay } from '@/data/workouts';

// Exercise log entry
export interface ExerciseLog {
  exerciseId: string;
  date: string; // ISO string
  weight?: number; // in kg
  sets?: number;
  reps?: number;
  distance?: number; // in km for running
  duration?: number; // in minutes
  pace?: number; // in min/km
  notes?: string;
}

// Workout completion tracking
export interface WorkoutCompletion {
  day: WorkoutDay;
  date: string; // ISO string
  completed: boolean;
  exercisesCompleted: string[]; // array of exercise IDs
}

// Weekly progression state
export interface WeeklyProgression {
  weekNumber: number;
  startDate: string; // ISO string
  isDeloadWeek: boolean;
}

// App state structure for localStorage
export interface AppState {
  exerciseLogs: ExerciseLog[];
  workoutCompletions: WorkoutCompletion[];
  weeklyProgression: WeeklyProgression;
  lastSync: string; // ISO string
}

// Default app state
export const DEFAULT_APP_STATE: AppState = {
  exerciseLogs: [],
  workoutCompletions: [],
  weeklyProgression: {
    weekNumber: 1,
    startDate: new Date().toISOString(),
    isDeloadWeek: false,
  },
  lastSync: new Date().toISOString(),
};

// Chart data types
export interface StrengthProgressData {
  date: string;
  weight: number;
  exerciseName: string;
}

export interface RunningVolumeData {
  week: string;
  distance: number;
}

export interface PaceTrendData {
  date: string;
  pace: number; // min/km
}
