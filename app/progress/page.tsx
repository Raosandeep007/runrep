"use client";

import { useAppState } from "@/lib/hooks/use-app-state";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { RiStockLine, RiPulseLine, RiAwardLine } from "@remixicon/react";
import { useMemo } from "react";

export default function ProgressPage() {
  const { appState, getAllStrengthLogs, getAllRunningLogs } = useAppState();

  // Process strength data for charts
  const strengthData = useMemo(() => {
    const logs = getAllStrengthLogs();
    return logs
      .slice(0, 20)
      .reverse()
      .map((log) => ({
        date: new Date(log.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        weight: log.weight,
        reps: log.reps,
      }));
  }, [getAllStrengthLogs]);

  // Process running volume by week
  const runningVolumeData = useMemo(() => {
    const logs = getAllRunningLogs();
    const weeklyData: Record<string, number> = {};

    logs.forEach((log) => {
      const date = new Date(log.date);
      const weekKey = `Week ${
        Math.floor(
          (date.getTime() -
            new Date(appState.weeklyProgression.startDate).getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        ) + 1
      }`;
      weeklyData[weekKey] = (weeklyData[weekKey] || 0) + (log.distance || 0);
    });

    return Object.entries(weeklyData).map(([week, distance]) => ({
      week,
      distance: Math.round(distance * 10) / 10,
    }));
  }, [getAllRunningLogs, appState.weeklyProgression.startDate]);

  // Process pace trend data
  const paceTrendData = useMemo(() => {
    const logs = getAllRunningLogs().filter((log) => log.pace);
    return logs
      .slice(0, 15)
      .reverse()
      .map((log) => ({
        date: new Date(log.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        pace: log.pace,
      }));
  }, [getAllRunningLogs]);

  const totalWorkouts = appState.workoutCompletions.length;
  const totalExercises = appState.exerciseLogs.length;
  const currentWeek = appState.weeklyProgression.weekNumber;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 md:py-8 lg:max-w-6xl">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Progress</h1>
        <p className="text-muted-foreground">Track your training journey</p>
      </div>

      {/* Stats Overview */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <RiAwardLine className="text-primary mx-auto mb-2 h-6 w-6" />
            <p className="text-2xl font-bold">{totalWorkouts}</p>
            <p className="text-muted-foreground text-xs">Workouts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <RiPulseLine className="text-primary mx-auto mb-2 h-6 w-6" />
            <p className="text-2xl font-bold">{totalExercises}</p>
            <p className="text-muted-foreground text-xs">Exercises</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <RiStockLine className="text-primary mx-auto mb-2 h-6 w-6" />
            <p className="text-2xl font-bold">{currentWeek}</p>
            <p className="text-muted-foreground text-xs">Weeks</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="strength" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="pace">Pace</TabsTrigger>
        </TabsList>

        {/* Strength Progression Chart */}
        <TabsContent value="strength">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RiStockLine className="h-5 w-5" />
                Strength Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              {strengthData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={strengthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      label={{
                        value: "Weight (kg)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-1))" }}
                      name="Weight"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-muted-foreground flex h-[300px] items-center justify-center">
                  <div className="text-center">
                    <RiPulseLine className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p>No strength data logged yet</p>
                    <p className="text-sm">
                      Start logging weights to see your progress
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Running Volume Chart */}
        <TabsContent value="volume">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RiPulseLine className="h-5 w-5" />
                Weekly Running Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              {runningVolumeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={runningVolumeData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="week"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      label={{
                        value: "Distance (km)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="distance"
                      fill="hsl(var(--chart-2))"
                      radius={[4, 4, 0, 0]}
                      name="Distance (km)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-muted-foreground flex h-[300px] items-center justify-center">
                  <div className="text-center">
                    <RiPulseLine className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p>No running data logged yet</p>
                    <p className="text-sm">
                      Complete runs to track your volume
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pace Trend Chart */}
        <TabsContent value="pace">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RiStockLine className="h-5 w-5" />
                Pace Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paceTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={paceTrendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      label={{
                        value: "Pace (min/km)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                      reversed
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pace"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-3))" }}
                      name="Pace"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-muted-foreground flex h-[300px] items-center justify-center">
                  <div className="text-center">
                    <RiPulseLine className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p>No pace data logged yet</p>
                    <p className="text-sm">
                      Log your running pace to see trends
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Logs */}
      {appState.exerciseLogs.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appState.exerciseLogs
                .slice(-10)
                .reverse()
                .map((log, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b py-2 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        Exercise #{log.exerciseId.slice(-4)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(log.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {log.weight && (
                        <Badge variant="outline">{log.weight}kg</Badge>
                      )}
                      {log.reps && (
                        <Badge variant="outline">{log.reps} reps</Badge>
                      )}
                      {log.duration && (
                        <Badge variant="outline">{log.duration}min</Badge>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
