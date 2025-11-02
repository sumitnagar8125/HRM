"use client";
import { Clock, Coffee, CheckCircle, Info } from "lucide-react";

function formatTime(ts) {
  if (!ts) return "—";
  const date = new Date(ts);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function Timesheet({ logs = [], isRecentAPI = false }) {
  const hasLogs = Array.isArray(logs) && logs.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="font-semibold text-xl sm:text-2xl text-gray-800">Daily Timesheet</h2>
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
          {logs.map((log, idx) => (
            <li key={log.id || log.date || idx} className="bg-white shadow rounded-lg p-5 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700 font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-500">Clock In</div>
                    <div className="text-lg">
                      {isRecentAPI
                        ? formatTime(log.first_clock_in)
                        : log.clock_in_time || "—"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-red-500" />
                  <div>
                    <div className="text-sm text-gray-500">Clock Out</div>
                    <div className="text-lg">
                      {isRecentAPI
                        ? formatTime(log.last_clock_out)
                        : log.clock_out_time || "—"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-green-500" />
                  <div>
                    <div className="text-sm text-gray-500">Work Duration</div>
                    <div className="text-lg">
                      {isRecentAPI
                        ? log.total_work_seconds
                          ? `${Math.floor(log.total_work_seconds / 3600)}h ${Math.round((log.total_work_seconds % 3600) / 60)}m`
                          : "—"
                        : log.work_duration || "—"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="text-yellow-600" />
                  <div>
                    <div className="text-sm text-gray-500">Break Duration</div>
                    <div className="text-lg">
                      {isRecentAPI
                        ? log.total_break_seconds
                          ? `${Math.floor(log.total_break_seconds / 3600)}h ${Math.round((log.total_break_seconds % 3600) / 60)}m`
                          : "—"
                        : log.break_duration || "—"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="text-lg">
                      {isRecentAPI
                        ? log.ot_sec > 0
                          ? "OT"
                          : log.total_work_seconds >= 8 * 3600
                          ? "ON TIME"
                          : log.total_work_seconds > 0
                          ? "PARTIAL"
                          : "—"
                        : log.status || "—"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-500">Shift Info</div>
                    <div className="text-lg whitespace-nowrap">
                      {isRecentAPI
                        ? `Shift - ${formatTime(log.first_clock_in)} - ${formatTime(log.last_clock_out)}`
                        : log.shift_info || "—"}
                    </div>
                  </div>
                </div>
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
