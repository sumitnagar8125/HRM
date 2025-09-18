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

  // Fetch weekly data only when token & employeeId are ready
  useEffect(() => {
    if (!token || !employeeId) return;

    const fetchAttendance = async () => {
      try {
        // ✅ Fetch attendance from backend
        const res = await fetch(
          `http://127.0.0.1:8000/attendance/?employee_id=${employeeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch attendance");
        const data = await res.json();

        // ✅ Filter only current employee records
        const employeeRecords = data.filter(
          (record) => record.employee_id === employeeId
        );

        // ✅ Transform into weeklyData
        const daysLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weekly = Array.from({ length: 7 }, (_, i) => ({
          day: daysLabel[i],
          workedHours: 0,
          breaks: 0,
          overtime: 0,
        }));

        employeeRecords.forEach((record) => {
          if (!record.login_time || !record.logout_time) return;
          const login = new Date(record.login_time);
          const logout = new Date(record.logout_time);
          const worked = (logout - login) / 3600000; // hours
          const idx = login.getDay(); // 0..6
          weekly[idx].workedHours += worked;
          if (record.on_leave) weekly[idx].breaks += worked;
          if (worked > 8) weekly[idx].overtime += worked - 8;
        });

        setWeeklyData(weekly);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [token, employeeId]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-16">
        <TimerCard />
      </div>

      <div className="col-span-12 lg:row-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          title="Tracked Hours"
          value={`${weeklyData
            .reduce((sum, d) => sum + d.workedHours, 0)
            .toFixed(1)}h`}
          icon={<Clock size={18} />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Break Time"
          value={`${weeklyData
            .reduce((sum, d) => sum + d.breaks, 0)
            .toFixed(1)}h`}
          icon={<Coffee size={18} />}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsCard
          title="Overtime"
          value={`${weeklyData
            .reduce((sum, d) => sum + d.overtime, 0)
            .toFixed(1)}h`}
          icon={<BarChart3 size={18} />}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      <div className="col-span-12 lg:col-span-8">
        <BarChart data={weeklyData} />
      </div>

      <div className="col-span-12 lg:col-span-4">
        <ActivityCard
          workedHours={weeklyData.reduce((sum, d) => sum + d.workedHours, 0)}
        />
      </div>
    </div>
  );
}
