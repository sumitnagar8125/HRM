"use client";
import React from "react";
import Sidebar from "../../components/ui/Sidebar";
import Header from "./Header";
import BarChart from "./BarChart";

const IndexPage = () => {
  const weeklyData = [
    { day: "M", workedHours: 10, breaks: 1, overtime: 2 },
    { day: "T", workedHours: 14, breaks: 2, overtime: 1 },
    { day: "W", workedHours: 9, breaks: 1.5, overtime: 0 },
    { day: "T", workedHours: 11, breaks: 1, overtime: 0.5 },
    { day: "F", workedHours: 7, breaks: 0.5, overtime: 0 },
    { day: "S", workedHours: 7, breaks: 0.5, overtime: 0 },
    { day: "S", workedHours: 0, breaks: 0, overtime: 0 },
  ];

  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <BarChart data={weeklyData} />

          {/* You can add StatsCard, ActivityCard, TimerCard here later */}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
