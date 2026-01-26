"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getWorkoutByDay, WorkoutDay } from "@/data/workouts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/lib/hooks/use-app-state";
import {
  RiArrowLeftLine,
  RiCheckboxCircleLine,
  RiCircleLine,
} from "@remixicon/react";
import Link from "next/link";

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const day = params.day as WorkoutDay;
  const workout = getWorkoutByDay(day);
  const { addExerciseLog, markWorkoutComplete, getTodayCompletion } =
    useAppState();
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set(),
  );
  const [exerciseLogs, setExerciseLogs] = useState<
    Record<string, { weight?: number; reps?: number; duration?: number }>
  >({});

  const completion = workout ? getTodayCompletion(workout.day) : null;

  useEffect(() => {
    if (completion) {
      setCompletedExercises(new Set(completion.exercisesCompleted));
    }
  }, [completion]);

  if (!workout) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <p>Workout not found</p>
        <Link href="/week">
          <Button variant="outline">Back to Week</Button>
        </Link>
      </div>
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
        ...log,
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
    router.push("/");
  };

  const totalExercises = workout.sections.reduce(
    (acc, section) => acc + section.exercises.length,
    0,
  );
  const progressPercent = (completedExercises.size / totalExercises) * 100;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl lg:max-w-4xl pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/week">
          <Button variant="ghost" size="sm" className="mb-4">
            <RiArrowLeftLine className="mr-2 h-4 w-4" />
            Back to Week
          </Button>
        </Link>
        <h1 className="text-3xl font-bold capitalize">{workout.day}</h1>
        <p className="text-xl font-semibold mt-1">{workout.title}</p>
        <p className="text-muted-foreground">{workout.primaryGoal}</p>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedExercises.size}/{totalExercises}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-6">
        {workout.sections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
            {section.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {section.description}
              </p>
            )}
            <div className="space-y-3">
              {section.exercises.map((exercise) => {
                const isCompleted = completedExercises.has(exercise.id);
                const isStrength =
                  exercise.type === "strength" || exercise.type === "accessory";
                const isCardio = exercise.type === "cardio";

                return (
                  <Card
                    key={exercise.id}
                    className={isCompleted ? "bg-muted/50" : ""}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleExerciseComplete(exercise.id)}
                          className="mt-1"
                        >
                          {isCompleted ? (
                            <RiCheckboxCircleLine className="h-6 w-6 text-primary" />
                          ) : (
                            <RiCircleLine className="h-6 w-6 text-muted-foreground" />
                          )}
                        </button>

                        {/* Exercise Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold">{exercise.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
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
                              <Badge variant="outline">{exercise.weight}</Badge>
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
                          </div>
                          {exercise.notes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {exercise.notes}
                            </p>
                          )}
                          {exercise.rest && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Rest: {exercise.rest}
                            </p>
                          )}

                          {/* Log Inputs */}
                          {!isCompleted && (isStrength || isCardio) && (
                            <div className="mt-3 flex gap-2">
                              {isStrength && (
                                <>
                                  <Input
                                    type="number"
                                    placeholder="Weight (kg)"
                                    className="h-9 text-sm"
                                    value={
                                      exerciseLogs[exercise.id]?.weight || ""
                                    }
                                    onChange={(e) =>
                                      setExerciseLogs((prev) => ({
                                        ...prev,
                                        [exercise.id]: {
                                          ...prev[exercise.id],
                                          weight: parseFloat(e.target.value),
                                        },
                                      }))
                                    }
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Reps"
                                    className="h-9 text-sm"
                                    value={
                                      exerciseLogs[exercise.id]?.reps || ""
                                    }
                                    onChange={(e) =>
                                      setExerciseLogs((prev) => ({
                                        ...prev,
                                        [exercise.id]: {
                                          ...prev[exercise.id],
                                          reps: parseInt(e.target.value),
                                        },
                                      }))
                                    }
                                  />
                                </>
                              )}
                              {isCardio && (
                                <Input
                                  type="number"
                                  placeholder="Duration (min)"
                                  className="h-9 text-sm"
                                  value={
                                    exerciseLogs[exercise.id]?.duration || ""
                                  }
                                  onChange={(e) =>
                                    setExerciseLogs((prev) => ({
                                      ...prev,
                                      [exercise.id]: {
                                        ...prev[exercise.id],
                                        duration: parseInt(e.target.value),
                                      },
                                    }))
                                  }
                                />
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleLogExercise(exercise.id)}
                              >
                                Log
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Complete Button */}
      <div className="fixed bottom-16 md:bottom-0 left-0 md:left-64 right-0 p-4 bg-background/95 backdrop-blur border-t">
        <div className="container mx-auto max-w-2xl lg:max-w-4xl">
          <Button
            className="w-full h-12 text-base"
            size="lg"
            onClick={handleCompleteWorkout}
            disabled={completedExercises.size === 0}
          >
            Complete Workout ({completedExercises.size}/{totalExercises})
          </Button>
        </div>
      </div>
    </div>
  );
}
