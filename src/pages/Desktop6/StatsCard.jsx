"use client";
import React from "react";

export default function StatsCard({
  title,
  value,
  icon,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-500",
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-white rounded-2xl shadow-md border w-full">
      {/* Text Section */}
      <div className="flex flex-col">
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-xl font-bold text-gray-800">{value}</h2>
      </div>

      {/* Icon Section */}
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-lg ${iconBg}`}
      >
        <span className={`text-lg ${iconColor}`}>{icon}</span>
      </div>
    </div>
  );
}
