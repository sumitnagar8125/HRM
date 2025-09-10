"use client";

import { LogIn, Coffee, Play, LogOut } from "lucide-react";

export default function Timesheet({ logs }) {
  const iconMap = {
    in: {
      icon: <LogIn className="w-4 h-4 text-green-600" />,
      bg: "bg-green-100",
    },
    breakStart: {
      icon: <Coffee className="w-4 h-4 text-yellow-600" />,
      bg: "bg-yellow-100",
    },
    breakEnd: {
      icon: <Play className="w-4 h-4 text-blue-600" />,
      bg: "bg-blue-100",
    },
    out: {
      icon: <LogOut className="w-4 h-4 text-red-600" />,
      bg: "bg-red-100",
    },
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">Daily Timesheet</h2>
        {logs.length > 0 ? (
          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-xs">
            On Time
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
            No Logs
          </span>
        )}
      </div>

      {/* Logs */}
      {logs.length > 0 ? (
        <ul className="divide-y">
          {logs.map((log, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between py-3"
            >
              {/* Left: icon + label */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    iconMap[log.type]?.bg
                  }`}
                >
                  {iconMap[log.type]?.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{log.label}</p>
                  <p className="text-xs text-gray-500">{log.labelSub}</p>
                </div>
              </div>

              {/* Right: time + sub */}
              <div className="text-right">
                <p className="font-semibold text-sm">{log.time}</p>
                <p className="text-xs text-gray-500">{log.timeSub}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No activity for this date.</p>
      )}
    </div>
  );
}
