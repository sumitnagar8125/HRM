"use client";

import React, { useState } from "react";
import { CalendarDays, Umbrella, User, Activity } from "lucide-react"; // icons

export default function History() {
  const [leaves] = useState([
    { id: 1, type: "Vacation", title: "Summer Vacation", startDate: "2024-07-15", endDate: "2024-07-22", days: 8, status: "Approved" },
    { id: 2, type: "Vacation", title: "Summer Vacation", startDate: "2024-07-15", endDate: "2024-07-22", days: 8, status: "Pending" },
    { id: 3, type: "Medical", title: "Medical Leave", startDate: "2024-07-15", endDate: "2024-07-22", days: 8, status: "Approved" },
    { id: 4, type: "Personal", title: "Personal Leave", startDate: "2024-07-15", endDate: "2024-07-22", days: 8, status: "Approved" },
    { id: 5, type: "Vacation", title: "Summer Vacation", startDate: "2024-07-15", endDate: "2024-07-22", days: 8, status: "Approved" },
    { id: 6, type: "Vacation", title: "Summer Vacation", startDate: "2024-07-15", endDate: "2024-07-22", days: 8, status: "Rejected" },
    { id: 7, type: "Vacation", title: "Summer Vacation", startDate: "2024-07-15", endDate: "2024-07-22", days: 8, status: "Approved" },
  ]);

  // Pick icon based on leave type
  const getIcon = (type) => {
    switch (type) {
      case "Vacation": return <Umbrella className="text-sky-600" size={20} />;
      case "Medical": return <Activity className="text-green-600" size={20} />;
      case "Personal": return <User className="text-indigo-600" size={20} />;
      default: return <CalendarDays className="text-gray-600" size={20} />;
    }
  };

  // Badge colors based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-600";
      case "Pending": return "bg-yellow-100 text-yellow-600";
      case "Rejected": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <section className="mt-4 bg-white border rounded-md shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Leave History</h2>

      {/* ✅ Only this list scrolls, shows 5 items before scrolling */}
      <div className="h-123 overflow-y-scroll pr-2 space-y-3">
        {leaves.map((leave) => (
          <div
            key={leave.id}
            className="flex items-center justify-between border-b last:border-b-0 pb-2"
          >
            {/* left side: icon + details */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-50 rounded-md">{getIcon(leave.type)}</div>
              <div>
                <p className="font-medium capitalize">{leave.title}</p>
                <p className="text-sm text-gray-500">
                  {leave.startDate} - {leave.endDate} • {leave.days} days
                </p>
                <p className="text-xs text-gray-400">{leave.type} Leave</p>
              </div>
            </div>

            {/* right side: status */}
            <span
              className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusBadge(
                leave.status
              )}`}
            >
              {leave.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
