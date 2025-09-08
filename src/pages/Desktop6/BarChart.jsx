// src/pages/Desktop6/BarChart.jsx
"use client";
import React from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BarChart = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md w-full h-80">
      <h2 className="text-lg font-semibold mb-4">Weekly Hours</h2>
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="workedHours" fill="#1E90FF" name="Worked Hours" />
          <Bar dataKey="breaks" fill="#FFD700" name="Breaks" />
          <Bar dataKey="overtime" fill="#FF4500" name="Overtime" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
