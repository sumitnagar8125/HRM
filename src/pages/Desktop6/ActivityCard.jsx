"use client";
import React from "react";

function ActivityCard({ workedHours = 2.83 }) {
  // workedHours is in hours, convert to h + m
  const hours = Math.floor(workedHours);
  const minutes = Math.round((workedHours - hours) * 60);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center w-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Activity</h2>

      {/* Circular Progress */}
      <div className="relative w-40 h-57 flex items-center justify-center">
        {/* Outer Circle */}
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="#e5e7eb" // gray-200 background
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="#3b82f6" // blue-500 progress
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (1 - workedHours / 8)} 
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute text-center">
          <p className="text-xl font-bold text-gray-800">
            {hours}h {minutes}m
          </p>
          <p className="text-sm text-gray-500">clocked</p>
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;
