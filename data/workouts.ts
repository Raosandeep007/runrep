export type ExerciseType = 'strength' | 'cardio' | 'warmup' | 'core' | 'accessory';

export type WorkoutDay = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  sets?: number;
  reps?: string; // Can be "3", "8-10", "15/leg", etc.
  weight?: string; // "85-90% 1RM", "heavy", etc.
  rest?: string;
  duration?: string; // For cardio
  intensity?: string; // For cardio
  notes?: string;
}

export interface WorkoutSection {
  title: string;
  description?: string;
  exercises: Exercise[];
}

export interface Workout {
  day: WorkoutDay;
  title: string;
  primaryGoal: string;
  sections: WorkoutSection[];
  postWorkoutNotes?: string[];
}

export const TRAINING_PLAN: Workout[] = [
  {
    day: 'sunday',
    title: 'Heavy Lower Body',
    primaryGoal: 'Max strength + posterior chain power',
    sections: [
      {
        title: 'Warm-up',
        description: '12-15 min',
        exercises: [
          {
            id: 'sun-wu-1',
            name: 'Easy row or jog',
            type: 'warmup',
            duration: '5 min',
          },
          {
            id: 'sun-wu-2',
            name: 'Hip mobility (90/90, hip flexor stretch)',
            type: 'warmup',
          },
          {
            id: 'sun-wu-3',
            name: 'Glute bridges',
            type: 'warmup',
            sets: 2,
            reps: '15',
          },
          {
            id: 'sun-wu-4',
            name: 'Bodyweight squats',
            type: 'warmup',
            sets: 2,
            reps: '15',
          },
        ],
      },
      {
        title: 'Main Lifts',
        exercises: [
          {
            id: 'sun-main-1',
            name: 'Back Squat',
            type: 'strength',
            sets: 5,
            reps: '3',
            weight: '85-90% 1RM',
            rest: '3-4 min',
          },
          {
            id: 'sun-main-2',
            name: 'Paused Squat',
            type: 'strength',
            sets: 3,
            reps: '4',
            weight: '70%',
            notes: '2s pause',
          },
          {
            id: 'sun-main-3',
            name: 'Romanian Deadlift',
            type: 'strength',
            sets: 4,
            reps: '6',
            weight: 'heavy',
          },
        ],
      },
      {
        title: 'Accessories',
        exercises: [
          {
            id: 'sun-acc-1',
            name: 'Bulgarian Split Squat',
            type: 'accessory',
            sets: 3,
            reps: '8/leg',
          },
          {
            id: 'sun-acc-2',
            name: 'Hamstring Curl (machine/Nordic)',
            type: 'accessory',
            sets: 3,
            reps: '8-10',
          },
          {
            id: 'sun-acc-3',
            name: 'Standing Calf Raises',
            type: 'accessory',
            sets: 4,
            reps: '12-15',
          },
        ],
      },
      {
        title: 'Core',
        exercises: [
          {
            id: 'sun-core-1',
            name: 'Hanging Leg Raises',
            type: 'core',
            sets: 3,
            reps: '12',
          },
          {
            id: 'sun-core-2',
            name: 'Pallof Press',
            type: 'core',
            sets: 3,
            reps: '12/side',
          },
        ],
      },
    ],
  },
  {
    day: 'monday',
    title: 'Easy Run',
    primaryGoal: 'Recovery + Blood Flow',
    sections: [
      {
        title: 'Main Run',
        exercises: [
          {
            id: 'mon-run-1',
            name: 'Easy Conversational Run',
            type: 'cardio',
            duration: '30-45 min',
            intensity: 'Zone 1-low Zone 2',
            notes: 'Keep HR < 70% max. Focus on relaxed cadence & breathing',
          },
          {
            id: 'mon-run-2',
            name: 'Relaxed Strides',
            type: 'cardio',
            sets: 4,
            duration: '20s',
            notes: 'Optional',
          },
        ],
      },
      {
        title: 'Post-Run Mobility',
        description: '10 min',
        exercises: [
          {
            id: 'mon-mob-1',
            name: 'Ankles, calves, hips, hamstrings mobility',
            type: 'warmup',
          },
        ],
      },
    ],
  },
  {
    day: 'tuesday',
    title: 'Pull Workout',
    primaryGoal: 'Back thickness + pulling power',
    sections: [
      {
        title: 'Warm-up',
        exercises: [
          {
            id: 'tue-wu-1',
            name: 'Band pull-aparts',
            type: 'warmup',
            sets: 2,
            reps: '20',
          },
          {
            id: 'tue-wu-2',
            name: 'Scapular pull-ups',
            type: 'warmup',
            sets: 2,
            reps: '10',
          },
        ],
      },
      {
        title: 'Main Lifts',
        exercises: [
          {
            id: 'tue-main-1',
            name: 'Weighted Pull-ups',
            type: 'strength',
            sets: 5,
            reps: '5',
          },
          {
            id: 'tue-main-2',
            name: 'Barbell Row',
            type: 'strength',
            sets: 4,
            reps: '6-8',
          },
          {
            id: 'tue-main-3',
            name: 'Chest-Supported Dumbbell Row',
            type: 'strength',
            sets: 3,
            reps: '10',
          },
        ],
      },
      {
        title: 'Accessories',
        exercises: [
          {
            id: 'tue-acc-1',
            name: 'Lat Pulldown (slow eccentric)',
            type: 'accessory',
            sets: 3,
            reps: '10',
          },
          {
            id: 'tue-acc-2',
            name: 'Face Pulls',
            type: 'accessory',
            sets: 3,
            reps: '15',
          },
          {
            id: 'tue-acc-3',
            name: 'Rear Delt Fly',
            type: 'accessory',
            sets: 3,
            reps: '15',
          },
        ],
      },
      {
        title: 'Arms',
        exercises: [
          {
            id: 'tue-arm-1',
            name: 'Barbell Curl',
            type: 'accessory',
            sets: 3,
            reps: '8',
          },
          {
            id: 'tue-arm-2',
            name: 'Hammer Curl',
            type: 'accessory',
            sets: 3,
            reps: '12',
          },
        ],
      },
    ],
  },
  {
    day: 'wednesday',
    title: 'Zone 2 Run',
    primaryGoal: 'Aerobic Base',
    sections: [
      {
        title: 'Main Run',
        exercises: [
          {
            id: 'wed-run-1',
            name: 'Zone 2 Run',
            type: 'cardio',
            duration: '45-60 min',
            intensity: 'Zone 2 (comfortable but steady)',
            notes: 'Nose breathing preferred. HR ~ 70-75% max. Flat terrain',
          },
        ],
      },
      {
        title: 'Optional Add-on',
        exercises: [
          {
            id: 'wed-sprint-1',
            name: 'Hill Sprints',
            type: 'cardio',
            sets: 6,
            duration: '10s',
            notes: 'Full recovery between sprints',
          },
        ],
      },
    ],
  },
  {
    day: 'thursday',
    title: 'Push Workout',
    primaryGoal: 'Upper-body hypertrophy & pressing strength',
    sections: [
      {
        title: 'Warm-up',
        exercises: [
          {
            id: 'thu-wu-1',
            name: 'Shoulder CARs',
            type: 'warmup',
          },
          {
            id: 'thu-wu-2',
            name: 'Band external rotations',
            type: 'warmup',
            sets: 2,
            reps: '15',
          },
        ],
      },
      {
        title: 'Main Lifts',
        exercises: [
          {
            id: 'thu-main-1',
            name: 'Barbell Bench Press',
            type: 'strength',
            sets: 5,
            reps: '5',
            weight: '80-85%',
          },
          {
            id: 'thu-main-2',
            name: 'Overhead Press',
            type: 'strength',
            sets: 4,
            reps: '6',
          },
          {
            id: 'thu-main-3',
            name: 'Incline Dumbbell Press',
            type: 'strength',
            sets: 3,
            reps: '8-10',
          },
        ],
      },
      {
        title: 'Accessories',
        exercises: [
          {
            id: 'thu-acc-1',
            name: 'Lateral Raises',
            type: 'accessory',
            sets: 4,
            reps: '12-15',
          },
          {
            id: 'thu-acc-2',
            name: 'Cable Fly (slow stretch)',
            type: 'accessory',
            sets: 3,
            reps: '12',
          },
          {
            id: 'thu-acc-3',
            name: 'Dips (weighted if possible)',
            type: 'accessory',
            sets: 3,
            reps: '8-10',
          },
        ],
      },
      {
        title: 'Triceps',
        exercises: [
          {
            id: 'thu-tri-1',
            name: 'Skull Crushers',
            type: 'accessory',
            sets: 3,
            reps: '10',
          },
          {
            id: 'thu-tri-2',
            name: 'Rope Pushdowns',
            type: 'accessory',
            sets: 3,
            reps: '12-15',
          },
        ],
      },
    ],
  },
  {
    day: 'friday',
    title: 'Speed Session',
    primaryGoal: 'Speed + lactate threshold',
    sections: [
      {
        title: 'Option A - Threshold Run',
        description: 'Rotate with Option B weekly',
        exercises: [
          {
            id: 'fri-optA-wu',
            name: 'Warm-up',
            type: 'warmup',
            duration: '10 min',
          },
          {
            id: 'fri-optA-main',
            name: 'Threshold Run',
            type: 'cardio',
            sets: 3,
            duration: '10 min',
            intensity: 'comfortably hard pace',
            rest: '3 min easy jog between',
          },
          {
            id: 'fri-optA-cd',
            name: 'Cooldown',
            type: 'warmup',
            duration: '10 min',
          },
        ],
      },
      {
        title: 'Option B - Intervals',
        description: 'Rotate with Option A weekly',
        exercises: [
          {
            id: 'fri-optB-wu',
            name: 'Warm-up',
            type: 'warmup',
            duration: '10 min',
          },
          {
            id: 'fri-optB-main',
            name: '800m Intervals',
            type: 'cardio',
            sets: 6,
            intensity: '5K pace',
            rest: '2-3 min jog recovery',
          },
          {
            id: 'fri-optB-cd',
            name: 'Cooldown',
            type: 'warmup',
            duration: '10 min',
          },
        ],
      },
    ],
  },
  {
    day: 'saturday',
    title: 'Flex / Recovery',
    primaryGoal: 'Active recovery or additional volume',
    sections: [
      {
        title: 'Choose ONE',
        description: 'Based on recovery status',
        exercises: [
          {
            id: 'sat-opt-1',
            name: 'Easy Recovery Jog',
            type: 'cardio',
            duration: '20-30 min',
            intensity: 'Very easy',
          },
          {
            id: 'sat-opt-2',
            name: 'Complete Rest + Mobility',
            type: 'warmup',
          },
        ],
      },
      {
        title: 'Optional Arm Pump Session',
        exercises: [
          {
            id: 'sat-arm-1',
            name: 'EZ Curl',
            type: 'accessory',
            sets: 4,
            reps: '12',
          },
          {
            id: 'sat-arm-2',
            name: 'Cable Curl',
            type: 'accessory',
            sets: 3,
            reps: '15',
          },
          {
            id: 'sat-arm-3',
            name: 'Tricep Pushdown',
            type: 'accessory',
            sets: 4,
            reps: '12',
          },
          {
            id: 'sat-arm-4',
            name: 'Overhead Tricep Extension',
            type: 'accessory',
            sets: 3,
            reps: '15',
          },
        ],
      },
    ],
  },
];

export const PROGRAM_NOTES = {
  weeklyProgression: {
    strength: 'Add 2.5 kg every 1-2 weeks if all sets feel solid',
    running: 'Increase weekly volume by max 10%',
    deload: 'Every 4th week → reduce volume by 40-50%',
  },
  recovery: {
    sleep: '7-9 hours',
    protein: '1.8-2.2 g/kg',
    carbTiming: 'Higher on Sunday & Friday',
    mobility: 'Daily mobility = non-negotiable',
  },
  targetAudience: [
    'Intermediate–Advanced lifters',
    'Runners lifting seriously',
    'Hybrid / tactical / endurance athletes',
  ],
};

// Helper function to get today's workout
export function getTodaysWorkout(): Workout | null {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayMap: WorkoutDay[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const todayKey = dayMap[today];
  return TRAINING_PLAN.find((w) => w.day === todayKey) || null;
}

// Helper function to get workout by day
export function getWorkoutByDay(day: WorkoutDay): Workout | null {
  return TRAINING_PLAN.find((w) => w.day === day) || null;
}

// Helper to get all days in order
export function getAllDaysInOrder(): WorkoutDay[] {
  return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
}
