"use client";

import { useState } from "react";
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
} from "@remixicon/react";

export default function SettingsPage() {
  const { appState, toggleDeloadWeek, incrementWeek, resetAppState } =
    useAppState();
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
    link.download = `fitness-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl lg:max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
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
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current Week</span>
            <Badge variant="outline">
              {appState.weeklyProgression.weekNumber}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Total Workouts
            </span>
            <Badge variant="outline">
              {appState.workoutCompletions.length}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Total Exercises
            </span>
            <Badge variant="outline">{appState.exerciseLogs.length}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Sync</span>
            <span className="text-sm">
              {new Date(appState.lastSync).toLocaleDateString()}
            </span>
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
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-3">
              <RiArrowDownLine className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Deload Week</p>
                <p className="text-sm text-muted-foreground">
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
              <RiRefreshLine className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Start Next Week</p>
                <p className="text-sm text-muted-foreground">
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
            <p className="text-xs text-destructive">
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
            <h4 className="font-semibold mb-2">Advanced Hybrid Training</h4>
            <p className="text-sm text-muted-foreground">
              This program combines maximal strength training with aerobic
              development. Designed for intermediate to advanced athletes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Weekly Structure</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 3 strength sessions (Lower, Pull, Push)</li>
              <li>• 3 running sessions (Easy, Zone 2, Speed)</li>
              <li>• 1 flexible recovery/arm day</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Progression Rules</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Strength: +2.5kg every 1-2 weeks</li>
              <li>• Running: +10% volume max per week</li>
              <li>• Deload every 4th week</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* PWA Info */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50 text-center">
        <p className="text-sm text-muted-foreground">
          This app works offline. Add it to your home screen for the best
          experience.
        </p>
      </div>
    </div>
  );
}
