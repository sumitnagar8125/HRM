"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format, parse } from "date-fns";
import Header from "./Header";
import Calenderui from "./Calenderui";
import Timesheet from "./Timesheet";
import TimeCards from "./TimeCards";
import { Clock, Coffee, BarChart3 } from "lucide-react";

export default function DashboardLayout() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allLogs, setAllLogs] = useState([]); // all 14 days fetched logs

  useEffect(() => {
    const accessToken = localStorage.getItem("token");

    axios
      .get("http://127.0.0.1:8000/attendance-rt/timesheet", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setAllLogs(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch timesheet data:", err);
        setAllLogs([]);
      });
  }, []);

  // Filter logs for the selected date
  const formattedKey = format(selectedDate, "yyyy-MM-dd");
  const logs = allLogs.filter((log) => log.full_date === formattedKey);

  // Helper to convert duration strings like "1h 38m" to decimal hours
  const parseDuration = (durationStr) => {
    if (!durationStr) return 0;
    const hourMatch = durationStr.match(/(\d+)h/);
    const minMatch = durationStr.match(/(\d+)m/);
    const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
    const mins = minMatch ? parseInt(minMatch[1], 10) : 0;
    return hours + mins / 60;
  };

  // Aggregate total work and break durations for the day
  let trackedHours = logs.reduce(
    (sum, log) => sum + parseDuration(log.work_duration),
    0
  );

  let breakTime = logs.reduce(
    (sum, log) => sum + parseDuration(log.break_duration),
    0
  );

  const overtime = trackedHours > 8 ? trackedHours - 8 : 0;

  const cardsData = [
    {
      title: "Tracked Hours",
      value: `${trackedHours.toFixed(1)}h`,
      icon: <Clock size={18} />,
      color: "text-blue-600",
    },
    {
      title: "Break Time",
      value: `${breakTime.toFixed(1)}h`,
      icon: <Coffee size={18} />,
      color: "text-green-600",
    },
    {
      title: "Overtime",
      value: `${overtime.toFixed(1)}h`,
      icon: <BarChart3 size={18} />,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <section className="bg-white shadow rounded-xl p-4">
          <Calenderui selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </section>
        <section className="bg-white shadow rounded-xl p-4">
          <Timesheet logs={logs} />
        </section>
        <TimeCards data={cardsData} />
      </main>
    </div>
  );
}
