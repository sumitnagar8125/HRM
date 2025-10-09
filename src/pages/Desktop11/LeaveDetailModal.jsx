import React, { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";

const prettyDate = iso =>
  iso ? new Date(iso).toISOString().substring(0, 10) : "";

export default function LeaveDetailModal({ leaveId, role, onClose, refresh }) {
  const [leave, setLeave] = useState(null);
  const isAdmin = role === "admin" || role === "super_admin";

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://127.0.0.1:8000/leaves/${leaveId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(data => setLeave(data))
      .catch(() => setLeave(null));
  }, [leaveId]);

  const apiCall = (path) => {
    const token = localStorage.getItem("token");
    return fetch(`http://127.0.0.1:8000/leaves/${leaveId}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.detail || "Unknown error");
        }
        return res.text();
      });
  };

  const approve = () => apiCall("/approve").then(() => { refresh(); onClose(); });
  const deny = () => apiCall("/deny").then(() => { refresh(); onClose(); });

  if (!leave) return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded p-8 min-w-[300px]">Loading leave details...</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative animate-fadeIn">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500" onClick={onClose}>
          <MdCancel size={28} />
        </button>
        <div className="flex flex-col items-center gap-3">
          <div className="text-2xl font-bold capitalize">{leave.leave_type}</div>
          <div>{prettyDate(leave.start_date)} &rarr; {prettyDate(leave.end_date)}</div>
          <div className="text-xs font-semibold">Employee #{leave.employee_id}</div>
          <div className="italic text-gray-700 text-sm">{leave.reason || "No reason provided"}</div>
          <div className="mt-2 font-semibold uppercase text-xs tracking-wider rounded-full px-4 py-1 bg-gray-200 text-gray-700">
            {leave.status}
          </div>
          {isAdmin && leave.status === "pending" && (
            <div className="flex gap-3 mt-2">
              <button onClick={approve} className="bg-green-600 px-5 py-1 rounded text-white hover:bg-green-700">Approve</button>
              <button onClick={deny} className="bg-red-600 px-5 py-1 rounded text-white hover:bg-red-700">Deny</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
