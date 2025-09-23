"use client";
import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";

function TimerCard({ onClockAction }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [totalBreakSeconds, setTotalBreakSeconds] = useState(0);

  const employeeId = localStorage.getItem("employee_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const savedClockIn = localStorage.getItem("clockInTime");
    const savedBreakSeconds = parseInt(localStorage.getItem("totalBreakSeconds") || "0", 10);
    if (savedClockIn) {
      setClockInTime(savedClockIn);
      setIsRunning(true);
      setTotalBreakSeconds(savedBreakSeconds);
      const elapsed = Math.floor((new Date() - new Date(savedClockIn)) / 1000) - savedBreakSeconds;
      setTime(elapsed > 0 ? elapsed : 0);
    }
  }, []);

  useEffect(() => {
    if (isRunning && clockInTime) {
      localStorage.setItem("clockInTime", clockInTime);
      localStorage.setItem("totalBreakSeconds", totalBreakSeconds);
    } else {
      localStorage.removeItem("clockInTime");
      localStorage.removeItem("totalBreakSeconds");
    }
  }, [isRunning, clockInTime, totalBreakSeconds]);

  useEffect(() => {
    localStorage.setItem("isOnBreak", isOnBreak ? "true" : "false");
    if (breakStartTime) {
      localStorage.setItem("breakStartTime", breakStartTime);
    } else {
      localStorage.removeItem("breakStartTime");
    }
  }, [isOnBreak, breakStartTime]);

  useEffect(() => {
    let interval;
    if (isRunning && clockInTime && !isOnBreak) {
      interval = setInterval(() => {
        const elapsed = Math.floor((new Date() - new Date(clockInTime)) / 1000) - totalBreakSeconds;
        setTime(elapsed > 0 ? elapsed : 0);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, clockInTime, isOnBreak, totalBreakSeconds]);

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

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
        return false;
      }

      console.log("Attendance logged:", await res.json());
      return true;
    } catch (err) {
      console.error("API error:", err);
      alert("Error reaching server");
      return false;
    }
  };

  const updateAttendance = async (attendanceId, payload) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/attendance/${attendanceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Error updating attendance:", err);
        alert("Failed to update attendance");
        return false;
      }

      console.log("Attendance updated:", await res.json());
      return true;
    } catch (err) {
      console.error("API error:", err);
      alert("Error reaching server");
      return false;
    }
  };

  const handleClockIn = async (event) => {
    event.preventDefault();
    const nowIso = new Date().toISOString();
    setClockInTime(nowIso);
    setIsRunning(true);
    setIsOnBreak(false);
    setTime(0);
    setTotalBreakSeconds(0);
    setClockOutTime(null);

    const success = await logAttendance({
      employee_id: Number(employeeId),
      login_time: nowIso,
      logout_time: null,
      on_leave: false,
      work_hours: 0,
    });

    if (success && onClockAction) onClockAction();

    // Save attendance id from response for clock out (optional, if needed)
    const response = await fetch("http://127.0.0.1:8000/attendance/attendance/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        employee_id: Number(employeeId),
        login_time: nowIso,
        logout_time: null,
        on_leave: false,
        work_hours: 0,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("openAttendanceId", data.id);
    }
  };

  const handleClockOut = async (event) => {
  event.preventDefault();

  if (isOnBreak) {
    alert("Please end your break before clocking out.");
    return;
  }

  const confirm = window.confirm("Are you sure you want to clock out?");
  if (!confirm) return;

  // UTC timezone-aware ISO string for logout time
  const nowIso = new Date().toISOString();

  // Clock out time for UI display (local time readable)
  setClockOutTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  setIsRunning(false);

  // Calculate worked hours in fractional hours
  const workedHours = time / 3600;

  // Retrieve the attendance ID created on clock in
  const openAttendanceId = localStorage.getItem("openAttendanceId");
  if (!openAttendanceId) {
    alert("No active clock-in record found.");
    return;
  }

  // Send PUT request to update attendance record with logout_time and work_hours
  const res = await fetch(`http://127.0.0.1:8000/attendance/${openAttendanceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      logout_time: nowIso,
      work_hours: workedHours,
      on_leave: false
    })
  });

  if (!res.ok) {
    alert("Failed to update attendance on clock out.");
    return;
  }

  if (res.ok && onClockAction) onClockAction();

  // Clear all relevant states and localStorage keys
  setClockInTime(null);
  setClockOutTime(null);
  setTime(0);
  setTotalBreakSeconds(0);
  setBreakStartTime(null);
  setIsOnBreak(false);

  localStorage.removeItem("clockInTime");
  localStorage.removeItem("totalBreakSeconds");
  localStorage.removeItem("isOnBreak");
  localStorage.removeItem("breakStartTime");
  localStorage.removeItem("openAttendanceId");
};



  const handleBreakToggle = (event) => {
  event.preventDefault();

  if (!isOnBreak) {
    // Start break: pause timer, save break start timestamp
    setIsOnBreak(true);
    setIsRunning(false);
    setBreakStartTime(new Date().toISOString());
  } else {
    // End break: calculate break duration, add to totalBreakSeconds, resume timer
    const breakEnd = new Date();
    const breakStart = new Date(breakStartTime);
    const breakDurationSecs = Math.floor((breakEnd - breakStart) / 1000);

    setTotalBreakSeconds(prev => prev + breakDurationSecs);
    setIsOnBreak(false);
    setIsRunning(true);
    setBreakStartTime(null);
  }
};



  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col items-center">
        <div className="w-40 h-40 flex items-center justify-center rounded-full border-8 border-gray-200">
          <span className={`text-2xl font-bold ${isOnBreak ? "text-yellow-600" : "text-red-600"}`}>
            {formatTime(time)}
          </span>
        </div>
        <p className="mt-2 text-gray-600">
          Clocked in at {clockInTime ? new Date(clockInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--"}
        </p>
        {isOnBreak && <p className="text-yellow-600 mt-1">On Break...</p>}
      </div>
      <div className="grid grid-cols-2 gap-4 ml-4 mr-23 mt-4">
        <Button
          className="bg-green-500 hover:bg-green-600 text-white px-2 py-6 rounded-lg"
          onClick={handleClockIn}
          disabled={isRunning}
        >
          Clock In {clockInTime ? new Date(clockInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
        </Button>
        <Button
          className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-6 rounded-lg"
          onClick={handleClockOut}
          disabled={!isRunning}
        >
          Clock Out {clockOutTime || ""}
        </Button>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-6 rounded-lg"
          onClick={() => setTime((t) => t + 3600)}
          disabled={!isRunning || isOnBreak}
        >
          + Add Hours
        </Button>
        <Button
  className={`px-2 py-6 rounded-lg ${
    isOnBreak ? "bg-yellow-600 hover:bg-yellow-700" : "bg-yellow-400 hover:bg-yellow-500"
  } text-white`}
  onClick={handleBreakToggle}
  disabled={!isRunning && !isOnBreak}
>
  {isOnBreak ? "End Break" : "Start Break"}
</Button>

      </div>
    </div>
  );
}

export default TimerCard;
