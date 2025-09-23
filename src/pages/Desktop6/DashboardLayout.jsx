"use client";
import React, { useState, useEffect } from "react";
import TimerCard from "./TimerCard";
import BarChart from "./BarChart";
import ActivityCard from "./ActivityCard";
import StatsCard from "./StatsCard";
import { Clock, Coffee, BarChart3 } from "lucide-react";

export default function DashboardLayout() {
  const [token, setToken] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load token & employeeId after mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
      setEmployeeId(Number(localStorage.getItem("employee_id")));
    }
  }, []);

  const fetchAttendance = async () => {
  if (!token || !employeeId) return;

  setLoading(true);

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/attendance/?employee_id=${employeeId}&limit=31`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch attendance");

    const data = await res.json();

    console.log("Raw attendance data:", data);

    const employeeRecords = data.filter(
      (record) => record.employee_id === employeeId
    );

    // Calculate start and end of current week (Sunday to Saturday)
    const today = new Date();
    const firstDay = new Date(today);
    firstDay.setHours(0, 0, 0, 0);
    firstDay.setDate(today.getDate() - today.getDay());
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    lastDay.setHours(23, 59, 59, 999);

    // Filter records for current week only
    const currentWeekRecords = employeeRecords.filter((record) => {
      const loginDate = new Date(record.login_time);
      return loginDate >= firstDay && loginDate <= lastDay;
    });

    const daysLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekly = Array.from({ length: 7 }, (_, i) => ({
      day: daysLabel[i],
      workedHours: 0,
      breaks: 0,
      overtime: 0,
    }));

    currentWeekRecords.forEach((record) => {
      if (!record.login_time || !record.logout_time) return;

      // Convert login/logout time to IST (+5.5 hours)
      const loginDateUTC = new Date(record.login_time);
      const logoutDateUTC = new Date(record.logout_time);

      const loginDateIST = new Date(loginDateUTC.getTime() + 19800000);
      const logoutDateIST = new Date(logoutDateUTC.getTime() + 19800000);

      if (isNaN(loginDateIST) || isNaN(logoutDateIST)) return;

      const worked = (logoutDateIST - loginDateIST) / 3600000;
      if (worked <= 0 || worked > 24) return;

      const idx = loginDateIST.getDay();

      weekly[idx].workedHours += worked;
      if (record.on_leave) weekly[idx].breaks += worked;
      console.log(worked);
      console.log(record.on_leave);
      if (worked > 8) weekly[idx].overtime += worked - 8;
    });

    console.log("Processed weekly data (current week):", weekly);

    setWeeklyData(weekly);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    setLoading(false);
  }
};


  useEffect(() => {
    fetchAttendance();
  }, [token, employeeId]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  const hasData = weeklyData.some(
    (day) => day.workedHours > 0 || day.breaks > 0 || day.overtime > 0
  );

  return (
    <div className="p-6 grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-16">
        <TimerCard onClockAction={fetchAttendance} />
      </div>
      <div className="col-span-12 lg:row-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
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
      <div className="col-span-12 lg:col-span-8">
        {hasData ? (
          <BarChart data={weeklyData} />
        ) : (
          <div className="text-center text-gray-500 mt-10">No attendance data available for this week.</div>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4">
        <ActivityCard
          workedHours={weeklyData.reduce((sum, d) => sum + d.workedHours, 0)}
        />
      </div>
    </div>
  );
}
