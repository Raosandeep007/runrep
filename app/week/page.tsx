'use client';

import { TRAINING_PLAN, getAllDaysInOrder } from '@/data/workouts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppState } from '@/lib/hooks/use-app-state';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WeekPage() {
  const { appState } = useAppState();
  const today = new Date().getDay();
  const allDays = getAllDaysInOrder();

  const getTypeIcon = (day: string): string => {
    const workout = TRAINING_PLAN.find((w) => w.day === day);
    if (!workout) return '📅';

    const firstSection = workout.sections[0];
    if (!firstSection || !firstSection.exercises.length) return '📅';

    const firstType = firstSection.exercises[0].type;
    if (firstType === 'cardio') return '🏃';
    if (firstType === 'strength') return '💪';
    return '🏋️';
  };

  const getDayCompletion = (day: string) => {
    const todayDate = new Date().toISOString().split('T')[0];
    return appState.workoutCompletions.find(
      (c) => c.day === day && c.date.startsWith(todayDate)
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Weekly Plan</h1>
        <p className="text-muted-foreground">
          Week {appState.weeklyProgression.weekNumber}
          {appState.weeklyProgression.isDeloadWeek && (
            <Badge variant="secondary" className="ml-2">
              Deload Week
            </Badge>
          )}
        </p>
      </div>

      {/* Weekly Overview */}
      <div className="space-y-3">
        {TRAINING_PLAN.map((workout, idx) => {
          const isToday = idx === today;
          const completion = getDayCompletion(workout.day);
          const totalExercises = workout.sections.reduce(
            (acc, section) => acc + section.exercises.length,
            0
          );

          return (
            <Link key={workout.day} href={`/workout/${workout.day}`}>
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isToday ? 'border-primary border-2' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Day Icon */}
                      <div className="text-2xl">{getTypeIcon(workout.day)}</div>

                      {/* Workout Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold capitalize">{workout.day}</h3>
                          {isToday && (
                            <Badge variant="default" className="text-xs">
                              Today
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium">{workout.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {workout.primaryGoal}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {totalExercises} exercises
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {completion?.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Program Notes */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Program Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Weekly Progression</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Strength: Add 2.5 kg every 1-2 weeks</li>
              <li>• Running: Increase volume by max 10%</li>
              <li>• Deload: Every 4th week (40-50% volume)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Recovery Keys</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Sleep: 7-9 hours</li>
              <li>• Protein: 1.8-2.2 g/kg</li>
              <li>• Daily mobility work</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
