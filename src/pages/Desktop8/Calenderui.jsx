import React, { useState } from "react";
import {
  startOfWeek,
  addDays,
  format,
  addWeeks,
  subWeeks,
  isSameDay,
  differenceInCalendarDays,
  isBefore,
  isAfter,
  startOfDay,
} from "date-fns";

export default function Calenderui({
  selectedDate,
  setSelectedDate,
  role,
  maxPastDays = 14,
}) {
  // 🧠 Use today's date if selectedDate is invalid
  const safeDate = selectedDate instanceof Date && !isNaN(selectedDate)
    ? selectedDate
    : new Date();

  const today = startOfDay(new Date());
  const maxWeeks = Math.ceil(maxPastDays / 7);

  const [weekStart, setWeekStart] = useState(
    startOfWeek(today, { weekStartsOn: 0 })
  );

  const canGoBack =
    differenceInCalendarDays(weekStart, subWeeks(today, maxWeeks)) > 0;
  const canGoForward =
    differenceInCalendarDays(startOfWeek(addWeeks(weekStart, 1)), today) <= 0;

  const days = [...Array(7)].map((_, i) => addDays(weekStart, i));
  const isDisabled = (day) =>
    isBefore(day, subWeeks(today, maxWeeks)) || isAfter(day, today);

  const onDateClick = (day) => {
    if (!isDisabled(day) && typeof setSelectedDate === "function") {
      setSelectedDate(day);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => canGoBack && setWeekStart(subWeeks(weekStart, 1))}
          className={`text-xl font-bold ${
            canGoBack
              ? "text-gray-600 hover:text-blue-600"
              : "text-gray-300 cursor-not-allowed"
          }`}
          disabled={!canGoBack}
        >
          &lt;
        </button>

        <div className="text-center">
          {/* 🛡️ Safe fallback for invalid or missing date */}
          <h2 className="font-semibold text-lg">
            {safeDate
              ? format(safeDate, "EEEE, MMMM d, yyyy")
              : "Select a Date"}
          </h2>
          <p className="text-gray-500 text-sm">
            Week {format(weekStart, "I")} of {format(weekStart, "yyyy")}
          </p>
        </div>

        <button
          onClick={() => canGoForward && setWeekStart(addWeeks(weekStart, 1))}
          className={`text-xl font-bold ${
            canGoForward
              ? "text-gray-600 hover:text-blue-600"
              : "text-gray-300 cursor-not-allowed"
          }`}
          disabled={!canGoForward}
        >
          &gt;
        </button>
      </div>

      <div className="flex justify-center gap-6">
        {days.map((day, idx) => {
          const isActive = isSameDay(day, safeDate);
          const disabled = isDisabled(day);
          return (
            <div
              key={idx}
              onClick={() => onDateClick(day)}
              className={`flex flex-col items-center px-3 py-2 rounded-lg cursor-pointer transition ${
                disabled
                  ? "text-gray-300 cursor-not-allowed"
                  : isActive
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
