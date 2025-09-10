"use client";

import Header from "./Header";
import Calenderui from "./Calenderui";
// later you can import Timesheet, TimeCards here too

export default function DashboardLayout() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Page Content */}
      <main className="p-6 space-y-6">
        {/* Calendar */}
        <Calenderui />

        {/* Timesheet + TimeCards can go here */}
      </main>
    </div>
  );
}
