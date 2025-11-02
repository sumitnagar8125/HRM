"use client";
import React from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const legendItems = [
  { color: "#1E90FF", label: "Worked Hours" },
  { color: "#FFD700", label: "Breaks" },
  { color: "#FF4500", label: "Overtime" },
];

const BarChart = ({ data }) => (
  <div className="bg-white p-4 rounded-2xl shadow-md w-full h-64 sm:h-80 relative">
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-semibold">Weekly Hours</h2>
      <div className="flex gap-4 pr-2 sm:pr-6">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span
              className="inline-block rounded"
              style={{ backgroundColor: item.color, width: 16, height: 6, minWidth: 16, minHeight: 6 }}
            ></span>
            <span className="text-xs text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
    <ResponsiveContainer width="100%" height="90%">
      <ReBarChart data={data} barSize={18}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          interval={0}           // **Show every tick label**
          tick={{ fontSize: 13 }} // Optionally smaller for mobile
          minTickGap={0}          // No gap, always show all ticks
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="workedHours" fill="#1E90FF" name="Worked Hours" />
        <Bar dataKey="breaks" fill="#FFD700" name="Breaks" />
        <Bar dataKey="overtime" fill="#FF4500" name="Overtime" />
      </ReBarChart>
    </ResponsiveContainer>
  </div>
);

export default BarChart;
