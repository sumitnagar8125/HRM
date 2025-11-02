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

function AdminDashboard({ token, currentUsername, role }) {
  const [viewMode, setViewMode] = useState("admin");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeLogs, setEmployeeLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [maxPastDays, setMaxPastDays] = useState(14);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/attendance-rt/admin/all-employees-status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmployees(res.data))
      .catch(() => setError("Failed to load employees"));
  }, [token]);

  // Admin own timesheet
  useEffect(() => {
    if (!token || (viewMode !== "admin" && !selectedEmployeeId)) return;
    setLoadingLogs(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/attendance-rt/recent?days=${maxPastDays}`, {
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
    setSelectedEmployeeId("");
  }, [token, maxPastDays, viewMode]);

  // Admin view employee timesheet
  useEffect(() => {
    if (!token || viewMode !== "employee" || !selectedEmployeeId) return;
    setLoadingLogs(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/attendance-rt/admin/employee/${selectedEmployeeId}/recent?days=${maxPastDays}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEmployeeLogs(Array.isArray(res.data) ? res.data.map((log, idx) => ({ ...log, id: log.id || idx })) : []);
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
  const logs = employeeLogs.filter((log) => log.date && log.date.startsWith(formattedKey));

  // --- THE CRITICAL PART: Calculate timecards only from today's logs ---
  let trackedSeconds = logs.reduce((sum, log) => sum + (log.total_work_seconds ? log.total_work_seconds : 0), 0);
  let breakSeconds = logs.reduce((sum, log) => sum + (log.total_break_seconds ? log.total_break_seconds : 0), 0);
  let trackedHours = trackedSeconds / 3600;
  let breakTime = breakSeconds / 3600;
  let overtime = trackedHours > 8 ? trackedHours - 8 : 0;

  const cardsData = [
    { title: "Tracked Hours", value: `${trackedHours.toFixed(1)}h`, icon: <Clock size={18} />, color: "text-blue-600" },
    { title: "Break Time", value: `${breakTime.toFixed(1)}h`, icon: <Coffee size={18} />, color: "text-green-600" },
    { title: "Overtime", value: `${overtime.toFixed(1)}h`, icon: <BarChart3 size={18} />, color: "text-yellow-600" },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-6">
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
          <label>Select Employee: </label>
          <select
            value={selectedEmployeeId}
            onChange={handleEmployeeChange}
            className="ml-0 sm:ml-2 p-2 rounded border w-full sm:w-auto"
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
            className="p-2 rounded border w-full sm:w-auto"
          >
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
        <section className="bg-white shadow rounded-xl p-2 sm:p-4">
          <Calenderui selectedDate={selectedDate} setSelectedDate={setSelectedDate} role="admin" maxPastDays={maxPastDays} />
        </section>
        <section className="bg-white shadow rounded-xl p-2 sm:p-4">
          {loadingLogs ? <div>Loading timesheet...</div> : <Timesheet logs={logs} isRecentAPI />}
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/attendance-rt/recent?days=14`, {
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
  const logs = allLogs.filter((log) => log.date && log.date.startsWith(formattedKey));
  let trackedSeconds = logs.reduce((sum, log) => sum + (log.total_work_seconds ? log.total_work_seconds : 0), 0);
  let breakSeconds = logs.reduce((sum, log) => sum + (log.total_break_seconds ? log.total_break_seconds : 0), 0);
  let trackedHours = trackedSeconds / 3600;
  let breakTime = breakSeconds / 3600;
  let overtime = trackedHours > 8 ? trackedHours - 8 : 0;

  const cardsData = [
    { title: "Tracked Hours", value: `${trackedHours.toFixed(1)}h`, icon: <Clock size={18} />, color: "text-blue-600" },
    { title: "Break Time", value: `${breakTime.toFixed(1)}h`, icon: <Coffee size={18} />, color: "text-green-600" },
    { title: "Overtime", value: `${overtime.toFixed(1)}h`, icon: <BarChart3 size={18} />, color: "text-yellow-600" },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-6">
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        <section className="bg-white shadow rounded-xl p-2 sm:p-4">
          <Calenderui selectedDate={selectedDate} setSelectedDate={setSelectedDate} role="employee" maxPastDays={14} />
        </section>
        <section className="bg-white shadow rounded-xl p-2 sm:p-4">
          <Timesheet logs={logs} isRecentAPI />
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
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
