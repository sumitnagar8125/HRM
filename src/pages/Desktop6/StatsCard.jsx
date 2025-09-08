"use client";

import React from "react";

export default function StatsCard({ title, value, icon, iconBg = "bg-blue-100", iconColor = "text-blue-500" }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border w-full">
      {/* Text Section */}
      <div>
        <p className="text-gray-500 text-xs">{title}</p>
        <h2 className="text-lg font-bold text-gray-800">{value}</h2>
      </div>

      {/* Icon Section */}
      <div className={`w-8 h-8 flex items-center justify-center rounded-md ${iconBg}`}>
        <span className={`text-base ${iconColor}`}>{icon}</span>
      </div>
    </div>
  );
}
