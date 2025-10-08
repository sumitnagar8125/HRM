"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import Header from "./Header";
import Calenderui from "./Calenderui";
import Timesheet from "./Timesheet";
import TimeCards from "./TimeCards";
import { Clock, Coffee, BarChart3 } from "lucide-react";

// Helper: format seconds to "xh ym"
function secondsToHMS(seconds) {
  if (typeof seconds !== "number") return "-";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

// Helper: for time string "YYYY-MM-DD HH:mm:ss" => "H:MM AM/PM"
function formatTime(dtStr) {
  if (!dtStr) return "-";
  const [, time] = dtStr.split(" ");
  if (!time) return "-";
  const [h, m] = time.split(":");
  let hour = Number(h);
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${period}`;
}

// Duration parser for UI cards
function parseDuration(durationStr, secondsField) {
  if (durationStr && typeof durationStr === "string") {
    const hourMatch = durationStr.match(/(\d+)h/);
    const minMatch = durationStr.match(/(\d+)m/);
    const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
    const mins = minMatch ? parseInt(minMatch[1], 10) : 0;
    return hours + mins / 60;
  }
  if (typeof secondsField === "number") {
    return secondsField / 3600;
  }
  return 0;
}

function AdminDashboard({ token }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employeeLogs, setEmployeeLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [maxPastDays, setMaxPastDays] = useState(14);

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://127.0.0.1:8000/attendance-rt/admin/all-employees-status", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmployees(res.data))
      .catch(() => setError("Failed to load employees"));
  }, [token]);

  // Map API fields for admin employee timesheet
  useEffect(() => {
    if (!selectedEmployeeId) {
      setEmployeeLogs([]);
      return;
    }
    setLoadingLogs(true);
    axios
      .get(
        `http://127.0.0.1:8000/attendance-rt/admin/employee/${selectedEmployeeId}/recent?days=${maxPastDays}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const logs = Array.isArray(res.data) ? res.data : [];
        setEmployeeLogs(
          logs.map((log, idx) => ({
            id: idx,
            full_date: log.date,
            clock_in_time: formatTime(log.first_clock_in),
            clock_out_time: formatTime(log.last_clock_out),
            work_duration: secondsToHMS(log.total_work_seconds),
            break_duration: secondsToHMS(log.total_break_seconds),
            status:
              log.ot_sec > 0
                ? "OT"
                : log.total_work_seconds >= 8 * 3600
                ? "ON TIME"
                : "PARTIAL",
            shift_info: `Shift - ${formatTime(log.first_clock_in)} - ${formatTime(
              log.last_clock_out
            )}`,
            total_work_seconds: log.total_work_seconds,
            total_break_seconds: log.total_break_seconds,
          }))
        );
        setError(null);
        setLoadingLogs(false);
      })
      .catch(() => {
        setError("Failed to fetch timesheet for employee");
        setLoadingLogs(false);
      });
  }, [selectedEmployeeId, token, maxPastDays]);

  const formattedKey = format(selectedDate, "yyyy-MM-dd");
  const logs = employeeLogs.filter((log) => log.full_date === formattedKey);

  let trackedHours = logs.reduce(
    (sum, log) => sum + parseDuration(log.work_duration, log.total_work_seconds),
    0
  );
  let breakTime = logs.reduce(
    (sum, log) => sum + parseDuration(log.break_duration, log.total_break_seconds),
    0
  );
  const overtime = trackedHours > 8 ? trackedHours - 8 : 0;

  const cardsData = [
    {
      title: "Tracked Hours",
      value: `${trackedHours.toFixed(1)}h`,
      icon: <Clock size={18} />,
      color: "text-blue-600",
    },
    {
      title: "Break Time",
      value: `${breakTime.toFixed(1)}h`,
      icon: <Coffee size={18} />,
      color: "text-green-600",
    },
    {
      title: "Overtime",
      value: `${overtime.toFixed(1)}h`,
      icon: <BarChart3 size={18} />,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <div className="mb-4 flex flex-row gap-4 items-center">
          <label>Select Employee: </label>
          <select
            value={selectedEmployeeId}
            onChange={e => setSelectedEmployeeId(e.target.value)}
            className="ml-2 p-2 rounded border"
          >
            <option value="">-- Select Employee --</option>
            {employees.map(emp => (
              <option value={emp.employee_id} key={emp.employee_id}>
                {emp.employee_name} ({emp.username})
              </option>
            ))}
          </select>
          <span>History:</span>
          <select
            value={maxPastDays}
            onChange={e => setMaxPastDays(Number(e.target.value))}
            className="p-2 rounded border"
          >
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
        <section className="bg-white shadow rounded-xl p-4">
          <Calenderui
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            role="admin"
            maxPastDays={maxPastDays}
          />
        </section>
        <section className="bg-white shadow rounded-xl p-4">
          {loadingLogs ? (
            <div>Loading timesheet...</div>
          ) : (
            <Timesheet logs={logs} />
          )}
        </section>
        <TimeCards data={cardsData} />
      </main>
    </div>
  );
}

function EmployeeDashboard({ token }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allLogs, setAllLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://127.0.0.1:8000/attendance-rt/timesheet", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAllLogs(Array.isArray(res.data) ? res.data : []);
        setError(null);
      })
      .catch((err) => {
        setAllLogs([]);
        let message = "Unknown error";
        if (err.response?.data?.detail) message = err.response.data.detail;
        else if (err.message) message = err.message;
        setError(`Failed to fetch timesheet data: ${message}`);
      });
  }, [token]);

  const formattedKey = format(selectedDate, "yyyy-MM-dd");
  const logs = allLogs.filter((log) => log.full_date === formattedKey);

  let trackedHours = logs.reduce((sum, log) => sum + parseDuration(log.work_duration), 0);
  let breakTime = logs.reduce((sum, log) => sum + parseDuration(log.break_duration), 0);
  const overtime = trackedHours > 8 ? trackedHours - 8 : 0;

  const cardsData = [
    {
      title: "Tracked Hours",
      value: `${trackedHours.toFixed(1)}h`,
      icon: <Clock size={18} />,
      color: "text-blue-600",
    },
    {
      title: "Break Time",
      value: `${breakTime.toFixed(1)}h`,
      icon: <Coffee size={18} />,
      color: "text-green-600",
    },
    {
      title: "Overtime",
      value: `${overtime.toFixed(1)}h`,
      icon: <BarChart3 size={18} />,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
        )}
        <section className="bg-white shadow rounded-xl p-4">
          <Calenderui
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            role="employee"
            maxPastDays={14}
          />
        </section>
        <section className="bg-white shadow rounded-xl p-4">
          <Timesheet logs={logs} />
        </section>
        <TimeCards data={cardsData} />
      </main>
    </div>
  );
}

export default function DashboardLayout() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRole(null);
      setLoading(false);
      return;
    }
    axios
      .get("http://127.0.0.1:8000/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setRole(res.data.role);
        setLoading(false);
      })
      .catch(() => {
        setRole(null);
        setLoading(false);
      });
  }, []);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (loading) return <div>Loading...</div>;
  if (role === "admin") return <AdminDashboard token={token} />;
  if (role === "employee") return <EmployeeDashboard token={token} />;
  return <div>User role missing or not recognized</div>;
}
