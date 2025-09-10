import React, { useState } from "react";
import {
  startOfWeek,
  addDays,
  format,
  addWeeks,
  subWeeks,
  isSameDay,
} from "date-fns";

export default function Calenderui() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

  // Generate current week days
  const days = [...Array(7)].map((_, i) => addDays(weekStart, i));

  // Go to previous week
  const prevWeek = () => setWeekStart(subWeeks(weekStart, 1));

  // Go to next week
  const nextWeek = () => setWeekStart(addWeeks(weekStart, 1));

  return (
    <div className="bg-white shadow rounded-xl p-6">
      {/* Top Section with arrows and date */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={prevWeek}
          className="text-gray-600 hover:text-blue-600 text-xl font-bold"
        >
          &lt;
        </button>
        <div className="text-center">
          <h2 className="font-semibold text-lg">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h2>
          <p className="text-gray-500 text-sm">
            Week {format(weekStart, "I")} of {format(weekStart, "yyyy")}
          </p>
        </div>
        <button
          onClick={nextWeek}
          className="text-gray-600 hover:text-blue-600 text-xl font-bold"
        >
          &gt;
        </button>
      </div>

      {/* Days Row */}
      <div className="flex justify-center gap-15">
        {days.map((day, idx) => {
          const isActive = isSameDay(day, selectedDate);
          return (
            <div
              key={idx}
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center px-3 py-2 rounded-lg cursor-pointer transition ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{format(day, "EEE")}</span>
              <span>{format(day, "d")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
