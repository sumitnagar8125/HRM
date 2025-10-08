import React, { useEffect, useState } from "react";
import Notification from "./Notification";
import Header from "./Header";

const BACKEND_URL = "http://127.0.0.1:8000";

const DashboardLayout = () => {
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${BACKEND_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(user => {
        setRole(user.role || "employee");
        setUserId(user.employee_id || null);
        return fetch(`${BACKEND_URL}/leaves/`, { headers: { Authorization: `Bearer ${token}` } });
      })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setLeaves(data))
      .catch(() => setLeaves([]))
      .finally(() => setLoading(false));
  }, []);

  let notifications = [];
  let leaveStatus = [];
  let allApplications = [];

  if (role === "admin" || role === "super_admin") {
    notifications = leaves.filter(lv => lv.status === "pending").map(lv => ({
      id: lv.id,
      leaveId: lv.id,
      employee_id: lv.employee_id,
      type: lv.leave_type,
      start_date: lv.start_date,
      end_date: lv.end_date,
      reason: lv.reason,
      status: lv.status,
    }));

    leaveStatus = userId ? leaves.filter(lv => lv.employee_id === userId).map(lv => ({ ...lv, type: lv.leave_type })) : [];
    allApplications = leaves.map(lv => ({ ...lv, type: lv.leave_type }));
  } else {
    leaveStatus = leaves.map(lv => ({ ...lv, type: lv.leave_type }));
  }

  return (
    <div className="flex-1">
      <Header />
      <main className="p-6">
        {loading ? <p>Loading leave data...</p> : (
          <Notification
            notifications={notifications}
            leaveStatus={leaveStatus}
            allApplications={allApplications}
            role={role}
            userId={userId}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;
