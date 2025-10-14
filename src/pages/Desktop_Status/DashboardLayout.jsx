import React, { useEffect, useState } from "react";
import Status from "./Status";
import axios from "axios";

function DashboardLayout() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/attendance-rt/admin/all-employees-status", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then(({ data }) => {
        // Map API response to UI fields if necessary
        const formatted = data.map(emp => ({
          id: emp.employee_id,
          name: emp.employee_name,
          username: emp.username,
          empCode: emp.emp_code,
          currentStatus: emp.current_status,
          clockInTime: emp.clock_in_time,
          elapsedWorkSeconds: emp.elapsed_work_seconds,
          elapsedBreakSeconds: emp.elapsed_break_seconds,
        }));
        setEmployees(formatted);
        setLoading(false);
      })
      .catch(() => {
        setEmployees([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading employee status...</div>;

  return (
    <div style={{ padding: "28px" }}>
     <h2
  style={{
    fontWeight: "600",
    fontSize: "1.75rem",
    marginBottom: "24px",
    color: "#222222",
   fontFamily: "'Lato', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",

    letterSpacing: "0.03em",
  }}
>
  {/* Employee Status Dashboard */ }
</h2>
      <Status employees={employees} />
    </div>
  );
}

export default DashboardLayout;
