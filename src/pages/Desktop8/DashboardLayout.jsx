"use client";

import { useState } from "react";
import { format } from "date-fns";
import Header from "./Header";
import Calenderui from "./Calenderui";
import Timesheet from "./Timesheet";

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

  // ✅ Use date-fns format instead of toISOString()
  const formattedKey = format(selectedDate, "yyyy-MM-dd");
  const logs = timesheetData[formattedKey] || [];

  return (
    <div className="flex-1 flex flex-col">
      <Header />

      <main className="p-4 space-y-6">
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
      </main>
    </div>
  );
}
