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
  const [token, setToken] = useState(null); // ✅ token stored in state safely

  const timerRef = useRef(null);
  const fetchTimeRef = useRef(null);
  const serverBaseTimeRef = useRef(0);

  // ✅ Safely access localStorage only in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) setToken(storedToken);
    }
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (fetchTimeRef.current) {
        const elapsedMsSinceFetch = Date.now() - fetchTimeRef.current;
        const elapsedSecondsSinceFetch = Math.floor(elapsedMsSinceFetch / 1000);
        const liveSeconds = serverBaseTimeRef.current + elapsedSecondsSinceFetch;
        setTime(liveSeconds);
      }
    }, 100);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // ✅ Fetch active session once token is ready
  useEffect(() => {
    if (!token) return;

    async function fetchActiveSession() {
      stopTimer();
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/attendance-rt/active`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetchCompletedTime = Date.now();
        if (!res.ok) return;
        const data = await res.json();

        if (data.session_id && data.status) {
          setClockInTime(data.clock_in_time);
          setClockOutTime(data.clock_out_time);
          setTotalBreakSeconds(data.elapsed_break_seconds || 0);
          setIsOnBreak(data.status === "break");
          serverBaseTimeRef.current = data.elapsed_work_seconds || 0;

          if (data.status === "active") {
            setIsRunning(true);
            fetchTimeRef.current = fetchCompletedTime;
            setTime(serverBaseTimeRef.current);
            startTimer();
          } else {
            setIsRunning(false);
            setTime(data.elapsed_work_seconds || 0);
            fetchTimeRef.current = null;
          }
        } else {
          setClockInTime(null);
          setClockOutTime(null);
          setIsRunning(false);
          setIsOnBreak(false);
          setTotalBreakSeconds(0);
          serverBaseTimeRef.current = 0;
          fetchTimeRef.current = null;
          setTime(0);
        }
      } catch (err) {
        console.error("Error fetching active session", err);
      }
    }

    fetchActiveSession();
    return stopTimer;
  }, [token]);

  const postAttendanceRT = async (endpoint) => {
    if (!token) return null;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/attendance-rt/${endpoint}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
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
    const absSecs = Math.abs(secs);
    const sign = secs < 0 ? "-" : "";
    const h = String(Math.floor(absSecs / 3600)).padStart(2, "0");
    const m = String(Math.floor((absSecs % 3600) / 60)).padStart(2, "0");
    const s = String(absSecs % 60).padStart(2, "0");
    return `${sign}${h}:${m}:${s}`;
  };

  const formatTimeIST = (isoString) => {
    if (!isoString) return "--";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "--"; // ✅ avoids "Invalid time value"
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleClockIn = async (e) => {
    e.preventDefault();
    const data = await postAttendanceRT("clock-in");
    if (data) {
      setClockInTime(data.clock_in_time);
      setIsRunning(true);
      setIsOnBreak(false);
      setTotalBreakSeconds(0);
      setClockOutTime(null);
      serverBaseTimeRef.current = 0;
      fetchTimeRef.current = Date.now();
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
    stopTimer();
    const data = await postAttendanceRT("clock-out");
    if (data) {
      setClockOutTime(data.clock_out_time);
      setIsRunning(false);
      setClockInTime(null);
      setTime(data.total_work_seconds || 0);
      fetchTimeRef.current = null;
      serverBaseTimeRef.current = 0;
      setTotalBreakSeconds(0);
      setBreakStartTime(null);
      setIsOnBreak(false);
      if (onClockAction) setTimeout(onClockAction, 1500);
    } else {
      startTimer();
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
        setIsOnBreak(false);
        setIsRunning(true);
        setBreakStartTime(null);
        serverBaseTimeRef.current = time;
        fetchTimeRef.current = Date.now();
        startTimer();
      }
    }
  };

  const workSeconds = time;

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="flex flex-col items-center w-full md:w-1/2">
        <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center rounded-full border-8 border-gray-200">
  <span
    className={`
      font-bold
      text-lg    // Small screens: less bold, smaller
      sm:text-3xl sm:font-extrabold // Desktop: bigger and bolder
      ${isOnBreak ? "text-yellow-600" : "text-red-600"}
      select-none
    `}
  >
    {formatTime(workSeconds)}
  </span>
</div>

        <p className="mt-2 text-gray-600">
          Clocked in at {formatTimeIST(clockInTime)}
        </p>
        {isOnBreak && <p className="text-yellow-600 mt-1">On Break...</p>}
      </div>
      <div className="grid grid-cols-2 gap-3 w-full md:w-1/2 mt-2">
        <Button
          type="button"
          className="bg-green-500 hover:bg-green-600 text-white px-2 py-4 rounded-lg"
          onClick={handleClockIn}
          disabled={isRunning}
        >
          Clock In {formatTimeIST(clockInTime)}
        </Button>
        <Button
          type="button"
          className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-4 rounded-lg"
          onClick={handleClockOut}
          disabled={!isRunning}
        >
          Clock Out {clockOutTime ? formatTimeIST(clockOutTime) : ""}
        </Button>
        <Button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-4 rounded-lg"
          onClick={() => {
            if (isRunning) {
              serverBaseTimeRef.current = time + 3600;
              fetchTimeRef.current = Date.now();
            } else {
              setTime((t) => t + 3600);
            }
          }}
          disabled={!isRunning || isOnBreak}
        >
          + Add Hours
        </Button>
        <Button
          type="button"
          className={`px-2 py-4 rounded-lg ${
            isOnBreak
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-yellow-400 hover:bg-yellow-500"
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
