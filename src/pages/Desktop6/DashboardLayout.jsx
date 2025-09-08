"use client";
import React from "react";
import TimerCard from "./TimerCard";
import BarChart from "./BarChart";
import ActivityCard from "./ActivityCard";
import StatsCard from "./StatsCard";
const weeklyData = [
  { day: "M", workedHours: 10, breaks: 1, overtime: 2 },
  { day: "T", workedHours: 14, breaks: 2, overtime: 1 },
  { day: "W", workedHours: 9, breaks: 1.5, overtime: 0 },
  { day: "T", workedHours: 11, breaks: 1, overtime: 0.5 },
  { day: "F", workedHours: 7, breaks: 0.5, overtime: 0 },
  { day: "S", workedHours: 7, breaks: 0.5, overtime: 0 },
  { day: "S", workedHours: 0, breaks: 0, overtime: 0 },
];

export default function DashboardLayout() {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Timer Card */}
      <TimerCard />

      {/* Bar Chart */}
      <BarChart data={weeklyData} />

      {/* Activity Card */}
      <ActivityCard data={weeklyData} />

      <StatsCard />
    </div>
  );
}
