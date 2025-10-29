"use client";

import { Clock, Coffee, CheckCircle, Info } from "lucide-react";

export default function Timesheet({ logs = [] }) {
  // Ensure logs is always an array
  const hasLogs = Array.isArray(logs) && logs.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-2xl text-gray-800">Daily Timesheet</h2>
        {hasLogs ? (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-semibold shadow-sm">
            On Time
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm font-medium">
            No Logs
          </span>
        )}
      </div>

      {hasLogs ? (
        <ul className="space-y-4">
          {logs.map(
            ({
              id,
              clock_in_time,
              clock_out_time,
              work_duration,
              break_duration,
              status,
              shift_info,
            }) => (
              <li
                key={id || Math.random()}
                className="bg-white shadow rounded-lg p-5 border border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-500">Clock In</div>
                      <div className="text-lg">{clock_in_time || "—"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="text-red-500" />
                    <div>
                      <div className="text-sm text-gray-500">Clock Out</div>
                      <div className="text-lg">{clock_out_time || "—"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="text-green-500" />
                    <div>
                      <div className="text-sm text-gray-500">Work Duration</div>
                      <div className="text-lg">{work_duration || "—"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Coffee className="text-yellow-600" />
                    <div>
                      <div className="text-sm text-gray-500">Break Duration</div>
                      <div className="text-lg">{break_duration || "—"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-purple-600" />
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="text-lg">{status || "—"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Info className="text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-500">Shift Info</div>
                      <div className="text-lg whitespace-nowrap">
                        {shift_info || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No activity for this date.</p>
      )}
    </div>
  );
}
