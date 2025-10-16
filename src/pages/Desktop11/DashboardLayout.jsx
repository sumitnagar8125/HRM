import React, { useEffect, useState } from "react";
import Notification from "./Notification";
import Header from "./Header";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";
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
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((user) => {
        setRole(user.role || "employee");
        setUserId(user.employee_id || null);
        return fetch(`${BACKEND_URL}/leaves/`, { headers: { Authorization: `Bearer ${token}` } });
      })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setLeaves(data))
      .catch(() => setLeaves([]))
      .finally(() => setLoading(false));
  }, []);

  let notifications = [];
  let leaveStatus = [];
  let allApplications = [];

  if (role === "admin" || role === "super_admin") {
    notifications = leaves.filter((lv) => lv.status === "pending").map((lv) => ({
      id: lv.id,
      leaveId: lv.id,
      employee_id: lv.employee_id,
      type: lv.leave_type,
      start_date: lv.start_date,
      end_date: lv.end_date,
      reason: lv.reason,
      status: lv.status,
    }));

    leaveStatus = [];
    allApplications = leaves.map((lv) => ({ ...lv, type: lv.leave_type }));
  } else {
    // Leave Status: show only with end date >= today
    const today = new Date().setHours(0, 0, 0, 0);
    leaveStatus = leaves.filter(lv => {
      const leaveEndDate = new Date(lv.end_date).setHours(0, 0, 0, 0);
      return leaveEndDate >= today;
    }).map(lv => ({ ...lv, type: lv.leave_type }));

    // History: show all leaves
    allApplications = leaves.map(lv => ({ ...lv, type: lv.leave_type }));
  }

  return (
    <div className="flex-1">
      <Header role={role} />
      <main className="p-6">
        {loading ? (
           <LoadingSpinner />
        ) : (
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
