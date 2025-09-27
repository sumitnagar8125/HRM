"use client";
import React, { useState, useEffect, useRef } from "react";
import Button from "../../components/ui/Button";

function TimerCard({ onClockAction }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [totalBreakSeconds, setTotalBreakSeconds] = useState(0);

  const timerRef = useRef(null);
  const lastUpdateTimeRef = useRef(null);
  const accumulatedSecondsRef = useRef(0);
  const token = localStorage.getItem("token");

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    lastUpdateTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const delta = Math.floor((now - lastUpdateTimeRef.current) / 1000);
      if (delta > 0) {
        accumulatedSecondsRef.current += delta;
        setTime(accumulatedSecondsRef.current);
        lastUpdateTimeRef.current = now;
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    async function fetchActiveSession() {
      if (!token) return;
      try {
        const res = await fetch("http://127.0.0.1:8000/attendance-rt/active", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();

        if (data.session_id && data.status) {
          setClockInTime(data.clock_in_time);
          setClockOutTime(data.clock_out_time);
          setTotalBreakSeconds(data.elapsed_break_seconds || 0);
          accumulatedSecondsRef.current = data.elapsed_work_seconds || 0;
          setTime(accumulatedSecondsRef.current);
          setIsOnBreak(data.status === "break");
          setIsRunning(data.status === "active");

          if (data.status === "active") {
            startTimer();
          } else {
            stopTimer();
          }
        } else {
          // No active session
          setClockInTime(null);
          setClockOutTime(null);
          setIsRunning(false);
          setIsOnBreak(false);
          setTotalBreakSeconds(0);
          accumulatedSecondsRef.current = 0;
          setTime(0);
          stopTimer();
        }
      } catch (err) {
        console.error("Error fetching active session", err);
      }
    }
    fetchActiveSession();
    return () => {
      stopTimer();
    };
  }, [token]);

  // POST helper
  const postAttendanceRT = async (endpoint) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/attendance-rt/${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Action failed: " + err.detail);
        return null;
      }
      return await res.json();
    } catch {
      alert("Error: could not reach server");
      return null;
    }
  };

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatTimeIST = (isoString) => {
    if (!isoString) return "--";
    const date = new Date(isoString);
    const istDate = new Date(date.getTime() + 330 * 60000);
    return istDate.toTimeString().slice(0, 5);
  };

  const handleClockIn = async (e) => {
    e.preventDefault();
    const data = await postAttendanceRT("clock-in");
    if (data) {
      setClockInTime(new Date().toISOString());
      setIsRunning(true);
      setIsOnBreak(false);
      setTotalBreakSeconds(0);
      setClockOutTime(null);
      accumulatedSecondsRef.current = 0;
      setTime(0);
      startTimer();
      if (onClockAction) onClockAction();
    }
  };

  const handleClockOut = async (e) => {
    e.preventDefault();
    if (isOnBreak) {
      alert("Please end your break before clocking out.");
      return;
    }
    if (!window.confirm("Confirm clock out?")) return;
    const data = await postAttendanceRT("clock-out");
    if (data) {
      setClockOutTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setIsRunning(false);
      setClockInTime(null);
      setTime(0);
      setTotalBreakSeconds(0);
      setBreakStartTime(null);
      setIsOnBreak(false);
      stopTimer();
      if (onClockAction) {
        setTimeout(() => onClockAction(), 1500);
      }
    }
  };

  const handleBreakToggle = async (e) => {
    e.preventDefault();
    if (!isOnBreak) {
      const data = await postAttendanceRT("start-break");
      if (data) {
        setIsOnBreak(true);
        setIsRunning(false);
        setBreakStartTime(new Date().toISOString());
        stopTimer();
      }
    } else {
      const data = await postAttendanceRT("stop-break");
      if (data) {
        const breakEnd = new Date();
        const breakStart = new Date(breakStartTime);
        const breakDurationSecs = Math.floor((breakEnd - breakStart) / 1000);
        setTotalBreakSeconds((prev) => prev + breakDurationSecs);
        setIsOnBreak(false);
        setIsRunning(true);
        setBreakStartTime(null);
        startTimer();
      }
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
        <p className="mt-2 text-gray-600">Clocked in at {formatTimeIST(clockInTime)}</p>
        {isOnBreak && <p className="text-yellow-600 mt-1">On Break...</p>}
      </div>
      <div className="grid grid-cols-2 gap-4 ml-4 mr-23 mt-4">
        <Button
          type="button"
          className="bg-green-500 hover:bg-green-600 text-white px-2 py-6 rounded-lg"
          onClick={handleClockIn}
          disabled={isRunning}
        >
          Clock In {formatTimeIST(clockInTime)}
        </Button>
        <Button
          type="button"
          className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-6 rounded-lg"
          onClick={handleClockOut}
          disabled={!isRunning}
        >
          Clock Out {clockOutTime || ""}
        </Button>
        <Button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-6 rounded-lg"
          onClick={() => setTime((t) => t + 3600)}
          disabled={!isRunning || isOnBreak}
        >
          + Add Hours
        </Button>
        <Button
          type="button"
          className={`px-2 py-6 rounded-lg ${isOnBreak ? "bg-yellow-600 hover:bg-yellow-700" : "bg-yellow-400 hover:bg-yellow-500"} text-white`}
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
