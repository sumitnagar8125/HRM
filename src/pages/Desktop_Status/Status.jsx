"use client";
import React, { useState } from "react";

const statusTextStyles = {
  available: "text-green-600 font-semibold",
  active: "text-sky-500 font-semibold",
  break: "text-yellow-600 font-semibold",
  onbreak: "text-yellow-600 font-semibold",
  ended: "text-red-500 font-semibold",
  offline: "text-red-700 font-semibold",
  onleave: "text-purple-600 font-semibold",
};

function Status({ employees = [] }) {
  const [search, setSearch] = useState("");
  const safeEmployees = Array.isArray(employees) ? employees : [];
  const filtered = safeEmployees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.username?.toLowerCase().includes(search.toLowerCase())
  );

  const out = filtered.filter(
    (emp) => emp.currentStatus === "ended" || emp.clockInTime === null
  );
  const active = filtered.filter((emp) => emp.currentStatus === "active");
  const onBreak = filtered.filter(
    (emp) => emp.currentStatus === "break" || emp.currentStatus === "onbreak"
  );

  return (
    <div>
      <div className="mb-7 flex justify-center">
        <input
          type="text"
          placeholder="Search employee by name or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg p-3 text-base border border-blue-200 rounded-lg shadow-sm outline-none font-semibold text-gray-800"
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Active Section */}
        <div className="flex-1 min-w-[220px] bg-blue-50 border border-blue-200 rounded-2xl p-6 h-[410px] flex flex-col">
          <div className="text-xl font-bold text-blue-900 border-b-2 border-blue-400 pb-2 mb-5">Active</div>
          {active.length === 0 ? (
            <div className="italic text-slate-500">No active employees found.</div>
          ) : (
            active.map((emp) => (
              <div
                key={emp.id}
                className="bg-white shadow-sm rounded-lg px-4 py-2 mb-2 flex justify-between items-center hover:scale-[1.02] transition-transform"
              >
                <span className="font-bold text-base">{emp.name}</span>
                <span className={statusTextStyles[emp.currentStatus] || ""}>
                  ({emp.currentStatus})
                </span>
              </div>
            ))
          )}
        </div>
        {/* On Break Section */}
        <div className="flex-1 min-w-[220px] bg-blue-50 border border-blue-200 rounded-2xl p-6 h-[410px] flex flex-col">
          <div className="text-xl font-bold text-blue-900 border-b-2 border-blue-400 pb-2 mb-5">On Break</div>
          {onBreak.length === 0 ? (
            <div className="italic text-slate-500">No employees on break.</div>
          ) : (
            onBreak.map((emp) => (
              <div
                key={emp.id}
                className="bg-white shadow-sm rounded-lg px-4 py-2 mb-2 flex justify-between items-center hover:scale-[1.02] transition-transform"
              >
                <span className="font-bold text-base">{emp.name}</span>
                <span className={statusTextStyles[emp.currentStatus] || ""}>
                  ({emp.currentStatus})
                </span>
              </div>
            ))
          )}
        </div>
        {/* Out Section */}
        <div className="flex-1 min-w-[220px] bg-blue-50 border border-blue-200 rounded-2xl p-6 h-[410px] flex flex-col">
          <div className="text-xl font-bold text-blue-900 border-b-2 border-blue-400 pb-2 mb-5">Out</div>
          {out.length === 0 ? (
            <div className="italic text-slate-500">No employees out.</div>
          ) : (
            out.map((emp) => (
              <div
                key={emp.id}
                className="bg-white shadow-sm rounded-lg px-4 py-2 mb-2 flex justify-between items-center hover:scale-[1.02] transition-transform"
              >
                <span className="font-bold text-base">{emp.name}</span>
                <span className={statusTextStyles[emp.currentStatus] || ""}>
                  ({emp.currentStatus})
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Status;
