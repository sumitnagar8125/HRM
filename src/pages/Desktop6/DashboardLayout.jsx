// DashboardLayout.jsx
"use client";
import React, { useState, useEffect } from "react";
import TimerCard from "./TimerCard";
import BarChart from "./BarChart";
import ActivityCard from "./ActivityCard";
import StatsCard from "./StatsCard";
import { Clock, Coffee, BarChart3 } from "lucide-react";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";
export default function DashboardLayout() {
  const [token, setToken] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const fetchAttendance = async () => {
    if (!token) return;

    setLoading(true);

    try {
      // Fetch data for a longer period (e.g., 30 days) to reliably capture the current week.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance-rt/recent?days=30`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch attendance");

      const data = await res.json();
      
      // --- FIX: Logic to filter for the current calendar week (Sun-Sat) ---
      const now = new Date();
      // Calculate start of the current week (Sunday)
      const currentDayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - currentDayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0); // Set to midnight Sunday morning

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7); // Set to midnight next Sunday morning

      const currentWeekData = data.filter(record => {
          const recordDate = new Date(record.date);
          // Check if recordDate is on or after startOfWeek AND strictly before endOfWeek
          return recordDate >= startOfWeek && recordDate < endOfWeek;
      });
      // --- End FIX ---
      
      const daysLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      // Aggregate by day label
      const dayWise = {};
      currentWeekData.forEach(record => { // Use currentWeekData here
        const dateObj = new Date(record.date);
        const day = daysLabel[dateObj.getDay()];
        if (!dayWise[day]) {
          dayWise[day] = { day, workedHours: 0, breaks: 0, overtime: 0 };
        }
        dayWise[day].workedHours += record.total_work_seconds / 3600;
        dayWise[day].breaks += record.total_break_seconds / 3600;
        dayWise[day].overtime += record.ot_sec / 3600;
      });

      // Always create 7 bars in calendar order, filling missing days with 0
      const weekly = daysLabel.map(day => dayWise[day] || { day, workedHours: 0, breaks: 0, overtime: 0 });

      setWeeklyData(weekly);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAttendance();
  }, [token]);

  if (loading) return <LoadingSpinner />;


  const hasData = weeklyData.some(
    (day) => day.workedHours > 0 || day.breaks > 0 || day.overtime > 0
  );

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      {/* TimerCard takes full width always */}
      <div>
        <TimerCard onClockAction={fetchAttendance} />
      </div>
      {/* Stats summary cards: row on desktop, stack on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Tracked Hours"
          value={`${weeklyData.reduce((sum, d) => sum + d.workedHours, 0).toFixed(1)}h`}
          icon={<Clock size={18} />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Break Time"
          value={`${weeklyData.reduce((sum, d) => sum + d.breaks, 0).toFixed(1)}h`}
          icon={<Coffee size={18} />}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsCard
          title="Overtime"
          value={`${weeklyData.reduce((sum, d) => sum + d.overtime, 0).toFixed(1)}h`}
          icon={<BarChart3 size={18} />}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>
      {/* BarChart and Activity Card: side-by-side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          {hasData ? (
            <BarChart data={weeklyData} />
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No attendance data available for this week.
            </div>
          )}
        </div>
        <div>
          <ActivityCard
            workedHours={weeklyData.reduce((sum, d) => sum + d.workedHours, 0)}
          />
        </div>
      </div>
    </div>
  );
}