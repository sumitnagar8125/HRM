"use client";
import React from "react";
import TimerCard from "./TimerCard";
import BarChart from "./BarChart";
import ActivityCard from "./ActivityCard";
import StatsCard from "./StatsCard";
import { Clock, Coffee, BarChart3 } from "lucide-react";

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
    <div className="p-6 grid grid-cols-12 gap-6">
      {/* ---------------- TOP ROW ---------------- */}
      {/* Timer Card (big, left side) */}
      <div className="col-span-12 lg:col-span-16">
        <TimerCard />
      </div>

      {/* Stats Row (3 cards, right side) */}
      <div className="col-span-12 lg:row-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
            title="Tracked Hours"
            value="23.5h"
            icon={<Clock size={18} />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Break Time"
            value="2.5h"
            icon={<Coffee size={18} />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <StatsCard
            title="Overtime"
            value="3.5h"
            icon={<BarChart3 size={18} />}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
          />

      </div>

      {/* ---------------- BOTTOM ROW ---------------- */}
      {/* Weekly Hours (BarChart, left side) */}
      <div className="col-span-12 lg:col-span-8">
        <BarChart data={weeklyData} />
      </div>

      {/* Activity Card (right side) */}
      <div className="col-span-12 lg:col-span-4">
        <ActivityCard data={weeklyData} />
      </div>
    </div>
  );
}
