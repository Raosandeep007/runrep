"use client";

import { getTodaysWorkout, getAllDaysInOrder } from "@/data/workouts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/hooks/use-app-state";
import {
  RiCalendarLine,
  RiTrophyLine,
  RiArrowRightLine,
} from "@remixicon/react";
import Link from "next/link";
import Logo from "@/components/logo";

export default function DashboardPage() {
  const todaysWorkout = getTodaysWorkout();
  const { appState, getTodayCompletion } = useAppState();
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

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 md:py-8 lg:max-w-5xl">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Dashboard</h1>
        <p className="text-muted-foreground">
          Week {appState.weeklyProgression.weekNumber}
          {isDeloadWeek && (
            <Badge variant="secondary" className="ml-2">
              Deload Week
            </Badge>
          )}
        </p>
      </div>

      {/* Today's Workout Card */}
      {todaysWorkout ? (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Logo className="size-9" />
                  {todaysWorkout.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  {todaysWorkout.primaryGoal}
                </CardDescription>
              </div>
              <Badge variant={completion?.completed ? "default" : "outline"}>
                {completion?.completed ? "Completed" : "Pending"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {completedExercises}/{totalExercises} exercises
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Sections</p>
                <p className="text-2xl font-bold">
                  {todaysWorkout.sections.length}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Exercises</p>
                <p className="text-2xl font-bold">{totalExercises}</p>
              </div>
            </div>

            {/* Action Button */}
            <Link href={`/workout/${todaysWorkout.day}`} className="block">
              <Button className="h-12 w-full text-base" size="lg">
                {completion?.completed ? "View Workout" : "Start Workout"}
                <RiArrowRightLine className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="py-12 text-center">
            <RiCalendarLine className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground text-lg">
              No workout scheduled for today
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold md:text-2xl">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Link href="/week">
            <Card className="hover:bg-accent cursor-pointer transition-colors">
              <CardContent className="flex flex-col items-center p-4 text-center">
                <RiCalendarLine className="text-primary mb-2 h-8 w-8" />
                <p className="font-medium">Weekly Plan</p>
                <p className="text-muted-foreground text-xs">View full week</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/progress">
            <Card className="hover:bg-accent cursor-pointer transition-colors">
              <CardContent className="flex flex-col items-center p-4 text-center">
                <RiTrophyLine className="text-primary mb-2 h-8 w-8" />
                <p className="font-medium">Progress</p>
                <p className="text-muted-foreground text-xs">View charts</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {appState.workoutCompletions.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Completions</h2>
          <div className="space-y-2">
            {appState.workoutCompletions
              .slice(-5)
              .reverse()
              .map((comp, idx) => (
                <Card key={idx}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium capitalize">{comp.day}</p>
                      <p className="text-muted-foreground text-sm">
                        {new Date(comp.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {comp.exercisesCompleted.length} exercises
                    </Badge>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
