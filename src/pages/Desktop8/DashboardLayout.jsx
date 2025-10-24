"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import Header from "./Header";
import Calenderui from "./Calenderui";
import Timesheet from "./Timesheet";
import TimeCards from "./TimeCards";
import { Clock, Coffee, BarChart3 } from "lucide-react";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";
function secondsToHMS(seconds) {
  if (typeof seconds !== "number") return "-";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

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

function AdminDashboard({ token, currentUsername, role }) {
  // viewMode controls which timesheet data to load and show
  const [viewMode, setViewMode] = useState("admin"); // "admin" or "employee"
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeLogs, setEmployeeLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [maxPastDays, setMaxPastDays] = useState(14);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [error, setError] = useState(null);

  // Load employees list once
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://127.0.0.1:8000/attendance-rt/admin/all-employees-status", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmployees(res.data))
      .catch(() => setError("Failed to load employees"));
  }, [token]);

  // Load admin timesheet only when viewMode is "admin"
  useEffect(() => {
    if (!token || viewMode !== "admin") return;
    setLoadingLogs(true);
    axios
      .get(`http://127.0.0.1:8000/attendance-rt/timesheet?days=${maxPastDays}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEmployeeLogs(Array.isArray(res.data) ? res.data.map((log, idx) => ({ ...log, id: log.id || idx })) : []);
        setError(null);
        setLoadingLogs(false);
      })
      .catch(() => {
        setError("Failed to fetch your timesheet");
        setLoadingLogs(false);
      });
    // Reset dropdown selection when admin view
    setSelectedEmployeeId("");
  }, [token, maxPastDays, viewMode]);

  // Load selected employee timesheet only when viewMode is "employee"
  useEffect(() => {
    if (!token || viewMode !== "employee" || !selectedEmployeeId) return;
    setLoadingLogs(true);
    axios
      .get(`http://127.0.0.1:8000/attendance-rt/admin/employee/${selectedEmployeeId}/recent?days=${maxPastDays}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const mappedLogs = Array.isArray(res.data)
          ? res.data.map((log, idx) => ({
              id: log.id || idx,
              full_date: log.date,
              clock_in_time: log.first_clock_in?.split(" ")[1] || "-",
              clock_out_time: log.last_clock_out?.split(" ")[1] || "-",
              work_duration: secondsToHMS(log.total_work_seconds),
              break_duration: secondsToHMS(log.total_break_seconds),
              status: log.ot_sec > 0 ? "OT" : log.total_work_seconds >= 8 * 3600 ? "ON TIME" : "PARTIAL",
              shift_info: `Shift - ${log.first_clock_in?.split(" ")[1] || '-'} - ${log.last_clock_out?.split(" ")[1] || '-'}`,
            }))
          : [];
        setEmployeeLogs(mappedLogs);
        setError(null);
        setLoadingLogs(false);
      })
      .catch(() => {
        setError("Failed to fetch timesheet for employee");
        setLoadingLogs(false);
      });
  }, [selectedEmployeeId, token, maxPastDays, viewMode]);

  const handleEmployeeChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setViewMode("admin");
      setSelectedEmployeeId("");
    } else {
      setViewMode("employee");
      setSelectedEmployeeId(val);
    }
  };

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
    { title: "Tracked Hours", value: `${trackedHours.toFixed(1)}h`, icon: <Clock size={18} />, color: "text-blue-600" },
    { title: "Break Time", value: `${breakTime.toFixed(1)}h`, icon: <Coffee size={18} />, color: "text-green-600" },
    { title: "Overtime", value: `${overtime.toFixed(1)}h`, icon: <BarChart3 size={18} />, color: "text-yellow-600" },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        <div className="mb-4 flex flex-row gap-4 items-center">
          <label>Select Employee: </label>
          <select
            value={selectedEmployeeId}
            onChange={handleEmployeeChange}
            className="ml-2 p-2 rounded border"
          >
            <option value="">-- Show My Timesheet --</option>
            {employees
              .filter((emp) => !((role === "admin" || role === "super_admin") && emp.username === currentUsername))
              .map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_name} ({emp.username})
                </option>
              ))}
          </select>
          <span>History:</span>
          <select
            value={maxPastDays}
            onChange={(e) => setMaxPastDays(Number(e.target.value))}
            className="p-2 rounded border"
          >
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
        <section className="bg-white shadow rounded-xl p-4">
          <Calenderui selectedDate={selectedDate} setSelectedDate={setSelectedDate} role="admin" maxPastDays={maxPastDays} />
        </section>
        <section className="bg-white shadow rounded-xl p-4">
          {loadingLogs ? <div>Loading timesheet...</div> : <Timesheet logs={logs} />}
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
    { title: "Tracked Hours", value: `${trackedHours.toFixed(1)}h`, icon: <Clock size={18} />, color: "text-blue-600" },
    { title: "Break Time", value: `${breakTime.toFixed(1)}h`, icon: <Coffee size={18} />, color: "text-green-600" },
    { title: "Overtime", value: `${overtime.toFixed(1)}h`, icon: <BarChart3 size={18} />, color: "text-yellow-600" },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        <section className="bg-white shadow rounded-xl p-4">
          <Calenderui selectedDate={selectedDate} setSelectedDate={setSelectedDate} role="employee" maxPastDays={14} />
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
  const [currentUsername, setCurrentUsername] = useState("");
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
        setCurrentUsername(res.data.username);
        setLoading(false);
      })
      .catch(() => {
        setRole(null);
        setCurrentUsername("");
        setLoading(false);
      });
  }, []);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
 if (loading) return <LoadingSpinner />;

  if (role === "admin" || role === "super_admin") return <AdminDashboard token={token} currentUsername={currentUsername} role={role} />;
  if (role === "employee") return <EmployeeDashboard token={token} />;
  return <div>User role missing or not recognized</div>;
}
