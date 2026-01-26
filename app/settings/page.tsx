"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useAppState } from "@/lib/hooks/use-app-state";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  RiDeleteBin2Line,
  RiArrowDownLine,
  RiRefreshLine,
  RiSettings2Line,
  RiDownloadLine,
  RiInformationLine,
  RiSunLine,
  RiMoonLine,
  RiComputerLine,
} from "@remixicon/react";

export default function SettingsPage() {
  const { appState, toggleDeloadWeek, incrementWeek, resetAppState } =
    useAppState();
  const { theme, setTheme } = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    if (showConfirm) {
      resetAppState();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(appState, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `runrep-backup-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 md:py-8 lg:max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold">
          <RiSettings2Line className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your training preferences
        </p>
      </div>

      {/* App Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RiInformationLine className="h-5 w-5" />
            App Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Current Week</span>
            <Badge variant="outline">
              {appState.weeklyProgression.weekNumber}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Total Workouts
            </span>
            <Badge variant="outline">
              {appState.workoutCompletions.length}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Total Exercises
            </span>
            <Badge variant="outline">{appState.exerciseLogs.length}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Last Sync</span>
            <span className="text-sm">
              {new Date(appState.lastSync).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose your preferred theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className="flex h-auto flex-col items-center gap-2 py-4"
              onClick={() => setTheme("light")}
            >
              <RiSunLine className="h-5 w-5" />
              <span className="text-sm">Light</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              className="flex h-auto flex-col items-center gap-2 py-4"
              onClick={() => setTheme("dark")}
            >
              <RiMoonLine className="h-5 w-5" />
              <span className="text-sm">Dark</span>
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              className="flex h-auto flex-col items-center gap-2 py-4"
              onClick={() => setTheme("system")}
            >
              <RiComputerLine className="h-5 w-5" />
              <span className="text-sm">System</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Training Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Training Settings</CardTitle>
          <CardDescription>Adjust your training program</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Deload Week Toggle */}
          <div className="flex items-center justify-between border-b py-3">
            <div className="flex items-center gap-3">
              <RiArrowDownLine className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="font-medium">Deload Week</p>
                <p className="text-muted-foreground text-sm">
                  Reduce volume by 40-50%
                </p>
              </div>
            </div>
            <Switch
              checked={appState.weeklyProgression.isDeloadWeek}
              onCheckedChange={toggleDeloadWeek}
            />
          </div>

          {/* Increment Week */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <RiRefreshLine className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="font-medium">Start Next Week</p>
                <p className="text-muted-foreground text-sm">
                  Move to week {appState.weeklyProgression.weekNumber + 1}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={incrementWeek}>
              Next Week
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export or reset your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Export Data */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={exportData}
          >
            <RiDownloadLine className="mr-2 h-4 w-4" />
            Export Data (JSON)
          </Button>

          {/* Reset Data */}
          <Button
            variant={showConfirm ? "destructive" : "outline"}
            className="w-full justify-start"
            onClick={handleReset}
          >
            <RiDeleteBin2Line className="mr-2 h-4 w-4" />
            {showConfirm ? "Click again to confirm" : "Reset All Data"}
          </Button>
          {showConfirm && (
            <p className="text-destructive text-xs">
              Warning: This will permanently delete all your workout logs and
              progress!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Program Info */}
      <Card>
        <CardHeader>
          <CardTitle>Program Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">Advanced Hybrid Training</h4>
            <p className="text-muted-foreground text-sm">
              This program combines maximal strength training with aerobic
              development. Designed for intermediate to advanced athletes.
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Weekly Structure</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• 3 strength sessions (Lower, Pull, Push)</li>
              <li>• 3 running sessions (Easy, Zone 2, Speed)</li>
              <li>• 1 flexible recovery/arm day</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Progression Rules</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Strength: +2.5kg every 1-2 weeks</li>
              <li>• Running: +10% volume max per week</li>
              <li>• Deload every 4th week</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* PWA Info */}
      <div className="bg-muted/50 mt-6 rounded-lg p-4 text-center">
        <p className="text-muted-foreground text-sm">
          This app works offline. Add it to your home screen for the best
          experience.
        </p>
      </div>
    </div>
  );
}
