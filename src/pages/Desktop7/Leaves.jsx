"use client";
import React from "react";

export default function Leaves({ title, available, taken, color, icon }) {
  const total = available + taken;
  const progress = (available / total) * 100;

  return (
    <div className="p-4 bg-white shadow rounded-xl flex flex-col space-y-6 ">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">{title}</h2>
        <div>{icon}</div>
      </div>

      {/* Days Info */}
      <div className="flex space-x-4">
        <p className="text-lg font-bold" style={{ color: color }}>
          {available} <span className="text-gray-600 text-sm">days available</span>
        </p>
        <p className="text-lg font-bold text-red-600">
          {taken} <span className="text-gray-600 text-sm">days taken</span>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className="h-2 rounded-full"
          style={{ width: `${progress}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
}
