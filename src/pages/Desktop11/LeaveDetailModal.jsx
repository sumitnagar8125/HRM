import React, { useEffect, useState } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { MdCancel, MdSave, MdClear } from "react-icons/md";

const prettyDate = iso =>
  iso ? new Date(iso).toISOString().substring(0, 10) : "";

export default function LeaveDetailModal({ leaveId, role, onClose, refresh }) {
  const [leave, setLeave] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: ""
  });
  const isAdmin = role === "admin" || role === "super_admin";

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://127.0.0.1:8000/leaves/${leaveId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setLeave(data);
        setFormData({
          leave_type: data.leave_type,
          start_date: prettyDate(data.start_date),
          end_date: prettyDate(data.end_date),
          reason: data.reason || ""
        });
      })
      .catch(() => setLeave(null));
  }, [leaveId]);

  const apiCall = (path, method = "POST", body = null) => {
    const token = localStorage.getItem("token");
    const options = {
      method,
      headers: { Authorization: `Bearer ${token}` }
    };
    if (body) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
    return fetch(`http://127.0.0.1:8000/leaves/${leaveId}${path}`, options)
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
  const del = () => {
    if (window.confirm("Are you sure you want to delete this leave?")) {
      apiCall("", "DELETE").then(() => { refresh(); onClose(); });
    }
  };

  const saveEdit = () => {
    if (formData.start_date > formData.end_date) {
      alert("Start date must be before or same as end date");
      return;
    }
    apiCall("", "PUT", formData)
      .then(() => {
        refresh();
        onClose();
      })
      .catch((err) => alert("Update failed: " + err.message));
  };

  if (!leave) return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded p-8 min-w-[300px]">
        Loading leave details...
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative animate-fadeIn">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500" onClick={onClose}>
          <MdCancel size={28} />
        </button>
        {!editing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="text-2xl font-bold capitalize">{leave.leave_type}</div>
            <div>{prettyDate(leave.start_date)} &rarr; {prettyDate(leave.end_date)}</div>
            <div className="text-xs font-semibold">Employee #{leave.employee_id}</div>
            <div className="italic text-gray-700 text-sm">{leave.reason || "No reason provided"}</div>
            <div className="mt-2 font-semibold uppercase text-xs tracking-wider rounded-full px-4 py-1 bg-gray-200 text-gray-700">
              {leave.status}
            </div>
            <div className="flex gap-3 mt-2">
              {isAdmin && leave.status === "pending" && (
                <>
                  <button onClick={approve} className="bg-green-600 px-5 py-1 rounded text-white hover:bg-green-700">Approve</button>
                  <button onClick={deny} className="bg-red-600 px-5 py-1 rounded text-white hover:bg-red-700">Deny</button>
                </>
              )}
              {isAdmin && (
                <>
                  <button onClick={() => setEditing(true)} className="px-5 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={del} className="flex items-center gap-2 bg-gray-300 px-5 py-1 rounded hover:bg-gray-400 text-black">
                    <FaRegTrashAlt size={20} /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <form className="flex flex-col gap-3">
            <label>
              Leave Type:
              <input
                type="text"
                value={formData.leave_type}
                onChange={e => setFormData({...formData, leave_type: e.target.value})}
                className="border p-1 w-full"
              />
            </label>
            <label>
              Start Date:
              <input
                type="date"
                value={formData.start_date}
                onChange={e => setFormData({...formData, start_date: e.target.value})}
                className="border p-1 w-full"
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={formData.end_date}
                onChange={e => setFormData({...formData, end_date: e.target.value})}
                className="border p-1 w-full"
              />
            </label>
            <label>
              Reason:
              <textarea
                value={formData.reason}
                onChange={e => setFormData({...formData, reason: e.target.value})}
                className="border p-1 w-full"
              />
            </label>
            <div className="flex gap-3 mt-2 justify-end">
              <button type="button" onClick={() => setEditing(false)} className="px-4 py-1 border rounded hover:bg-gray-100 flex items-center gap-1">
                <MdClear /> Cancel
              </button>
              <button type="button" onClick={saveEdit} className="bg-blue-600 px-5 py-1 rounded text-white hover:bg-blue-700 flex items-center gap-1">
                <MdSave /> Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
