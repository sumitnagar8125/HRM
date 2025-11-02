"use client";
import React from "react";

function ActivityCard({ workedHours = 2.83 }) {
  const hours = Math.floor(workedHours);
  const minutes = Math.round((workedHours - hours) * 60);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col w-full h-full justify-center items-center min-h-[340px]">
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <h2 className="text-lg font-semibold text-gray-700 text-center">Activity</h2>
        <div className="relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40">
          {/* The viewBox is the key to perfect centering. */}
          <svg className="block" width="100%" height="100%" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#3b82f6"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 56}
              strokeDashoffset={2 * Math.PI * 56 * (1 - workedHours / 8)} 
              strokeLinecap="round"
            />
          </svg>
          {/* Absolutely centered text */}
          <div className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center" style={{ transform: "translate(-50%, -50%)" }}>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {hours}h {minutes}m
            </p>
            <p className="text-sm text-gray-500">clocked</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;
