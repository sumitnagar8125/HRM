"use client";
import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button"; // adjust import if needed

function TimerCard() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);

  const employeeId = localStorage.getItem("employee_id");
  const token = localStorage.getItem("token");

  // timer effect
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // format hh:mm:ss
  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // API helper
  const logAttendance = async (payload) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/attendance/attendance/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Error logging attendance:", err);
        alert("Failed to log attendance");
        return;
      }

      console.log("Attendance logged:", await res.json());
    } catch (err) {
      console.error("API error:", err);
      alert("Error reaching server");
    }
  };

  const handleClockIn = () => {
    const now = new Date().toISOString();
    setClockInTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setIsRunning(true);

    logAttendance({
      employee_id: Number(employeeId),
      login_time: new Date().toISOString(),   // always ISO
      logout_time: new Date(0).toISOString(), // dummy value
      on_leave: false,
      work_hours: 0,
    });
  };

  const handleClockOut = () => {
    const now = new Date().toISOString();
    setClockOutTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setIsRunning(false);

    logAttendance({
      employee_id: Number(employeeId),
      login_time: new Date(0).toISOString(),  // dummy value
      logout_time: new Date().toISOString(),
      on_leave: false,
      work_hours: Math.floor(time / 3600),
    });
  };

  const handleBreak = () => {
    setIsRunning(false);

    logAttendance({
      employee_id: Number(employeeId),
      login_time: new Date(0).toISOString(),
      logout_time: new Date(0).toISOString(),
      on_leave: true,
      work_hours: 0,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Timer Circle */}
      <div className="flex flex-col items-center">
        <div className="w-40 h-40 flex items-center justify-center rounded-full border-8 border-gray-200">
          <span className="text-2xl font-bold text-red-600">{formatTime(time)}</span>
        </div>
        <p className="mt-2 text-gray-600">Clocked at {clockInTime || "--"}</p>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-4 ml-4 mr-23 mt-4">
        <Button
          className="bg-green-500 hover:bg-green-600 text-white px-2 py-6 rounded-lg"
          onClick={handleClockIn}
        >
          Clock In {clockInTime || ""}
        </Button>

        <Button
          className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-6 rounded-lg"
          onClick={handleClockOut}
        >
          Clock Out {clockOutTime || ""}
        </Button>

        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-6 rounded-lg"
          onClick={() => setTime((t) => t + 3600)}
        >
          + Add Hours
        </Button>

        <Button
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-6 rounded-lg"
          onClick={handleBreak}
        >
          ☕ Start Break
        </Button>
      </div>
    </div>
  );
}

export default TimerCard;
