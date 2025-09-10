"use client";

import { useState } from "react";
import { format, parse } from "date-fns";
import Header from "./Header";
import Calenderui from "./Calenderui";
import Timesheet from "./Timesheet";
import TimeCards from "./TimeCards"; // ✅ reusable component
import { Clock, Coffee, BarChart3 } from "lucide-react";

export default function DashboardLayout() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Example timesheet data
  const timesheetData = {
    "2025-09-09": [
      {
        label: "Clock In",
        labelSub: "Work Started",
        time: "9:10 AM",
        timeSub: "WFH",
        type: "in",
      },
      {
        label: "Break Start",
        labelSub: "Tea Break",
        time: "11:30 AM",
        timeSub: "Duration: 15m",
        type: "breakStart",
      },
      {
        label: "Break End",
        labelSub: "Resumed Work",
        time: "11:45 AM",
        timeSub: "WFH",
        type: "breakEnd",
      },
      {
        label: "Clock Out",
        labelSub: "Work Ended",
        time: "6:45 PM",
        timeSub: "WFH",
        type: "out",
      },
    ],
    "2025-09-10": [
      {
        label: "Clock In",
        labelSub: "Work Started",
        time: "9:00 AM",
        timeSub: "Office",
        type: "in",
      },
      {
        label: "Break Start",
        labelSub: "Lunch Break",
        time: "1:00 PM",
        timeSub: "Duration: 30m",
        type: "breakStart",
      },
      {
        label: "Break End",
        labelSub: "Resumed Work",
        time: "1:30 PM",
        timeSub: "Office",
        type: "breakEnd",
      },
      {
        label: "Clock Out",
        labelSub: "Work Ended",
        time: "7:00 PM",
        timeSub: "Office",
        type: "out",
      },
    ],
  };

  // ✅ get logs for selected date
  const formattedKey = format(selectedDate, "yyyy-MM-dd");
  const logs = timesheetData[formattedKey] || [];

  // ✅ helper to parse time string
  const parseTime = (timeStr) => parse(timeStr, "h:mm a", selectedDate);

  // ✅ calculate tracked hours & break time
  let trackedHours = 0;
  let breakTime = 0;

  const inLog = logs.find((l) => l.type === "in");
  const outLog = logs.find((l) => l.type === "out");
  if (inLog && outLog) {
    const diff =
      (parseTime(outLog.time) - parseTime(inLog.time)) / (1000 * 60 * 60);
    trackedHours = diff;
  }

  const breakStart = logs.find((l) => l.type === "breakStart");
  const breakEnd = logs.find((l) => l.type === "breakEnd");
  if (breakStart && breakEnd) {
    const diff =
      (parseTime(breakEnd.time) - parseTime(breakStart.time)) /
      (1000 * 60 * 60);
    breakTime = diff;
  }

  // ✅ overtime (anything above 8h)
  const overtime = trackedHours - 8 > 0 ? trackedHours - 8 : 0;

  // ✅ cards data
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

    {/* main area scrolls independently */}
    <main className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* Calendar */}
      <section className="bg-white shadow rounded-xl p-4">
        <Calenderui
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </section>

      {/* Daily Timesheet */}
      <section className="bg-white shadow rounded-xl p-4">
        <Timesheet logs={logs} />
      </section>

      {/* Summary Cards */}
      <TimeCards data={cardsData} />
    </main>
  </div>
);
}
