"use client";
import React, { useEffect, useState } from "react";

export default function Newleave() {
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    leave_type: "",
    reason: "",
  });
  const [availableCoins, setAvailableCoins] = useState(0);
  const [requestedDays, setRequestedDays] = useState(0);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  // Read JWT from localStorage on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") || "");
    }
  }, []);

  // Fetch leave coin balance using backend API (NOT frontend proxy)
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch("http://127.0.0.1:8000/leave-balance/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setAvailableCoins(data.available_coins || 0))
      .catch(() => setAvailableCoins(0))
      .finally(() => setLoading(false));
  }, [token]);

  // Calculate days and validity on date/form change
  useEffect(() => {
    const { start_date, end_date } = formData;
    if (start_date && end_date) {
      const sd = new Date(start_date);
      const ed = new Date(end_date);
      const diff = Math.floor((ed - sd) / (1000 * 60 * 60 * 24)) + 1;
      setRequestedDays(diff > 0 ? diff : 0);
      if (diff > availableCoins) setError("Insufficient leave coins for this request.");
      else if (diff < 1) setError("Invalid dates selected.");
      else setError("");
    } else {
      setRequestedDays(0);
      setError("");
    }
  }, [formData.start_date, formData.end_date, availableCoins]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setInfo("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.leave_type ||
      !formData.start_date ||
      !formData.end_date ||
      requestedDays > availableCoins ||
      requestedDays < 1 ||
      !token
    )
      return;

    setLoading(true);
    setError("");
    setInfo("");
    try {
      const payload = { ...formData };
      const res = await fetch("http://127.0.0.1:8000/leaves/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setInfo("Leave applied successfully!");
        setFormData({ start_date: "", end_date: "", leave_type: "", reason: "" });
        setRequestedDays(0);
        // Refresh coins after request
        fetch("http://127.0.0.1:8000/leave-balance/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => (r.ok ? r.json() : {}))
          .then((d) => setAvailableCoins(d.available_coins || 0));
      } else {
        const err = await res.json();
        setError(typeof err.detail === "string" ? err.detail : "Leave request failed.");
      }
    } catch {
      setError("Network/server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="bg-white rounded-xl shadow-md p-6 border">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              Select a Policy
            </label>
            <select
              name="leave_type"
              value={formData.leave_type}
              onChange={handleInputChange}
              className="mt-2 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              required
            >
              <option value="">Select a Policy</option>
              <option value="Vacation">Vacation Leave</option>
              <option value="Medical">Medical Leave</option>
              <option value="Personal">Personal Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Emergency">Emergency Leave</option>
              <option value="Maternity">Maternity Leave</option>
              <option value="Paternity">Paternity Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Start date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="mt-2 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">End date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="mt-2 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              Add a reason or note
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Write your reason here..."
              rows={3}
              className="mt-2 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              required
            />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              You have <b>{availableCoins}</b> leave coins.
            </p>
            {requestedDays > 0 && (
              <p className="text-sm text-gray-600">
                Requesting leave for <b>{requestedDays}</b> days.
              </p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {info && <p className="text-sm text-green-600">{info}</p>}
          </div>
          <button
            type="submit"
            disabled={
              loading ||
              !formData.leave_type ||
              !formData.start_date ||
              !formData.end_date ||
              requestedDays > availableCoins ||
              requestedDays < 1
            }
            className={`w-full py-2 rounded-lg transition-colors ${
              loading ||
              !formData.leave_type ||
              !formData.start_date ||
              !formData.end_date ||
              requestedDays > availableCoins ||
              requestedDays < 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-purple-700"
            }`}
          >
            {loading ? "Requesting..." : "Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
