// TimerCard.jsx
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
  // Renamed ref to hold the time the fetch completed
  const fetchTimeRef = useRef(null); 
  // This ref will hold the server's time and will be updated on every interval tick
  const serverBaseTimeRef = useRef(0); 
  const token = localStorage.getItem("token");

  // FIX: Simplified Timer - Calculates time based on time passed since the last fetch
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Set interval to update time based on elapsed time since the fetch
    timerRef.current = setInterval(() => {
      if (fetchTimeRef.current) {
        // Time elapsed since we received the server's data
        const elapsedMsSinceFetch = Date.now() - fetchTimeRef.current;
        const elapsedSecondsSinceFetch = Math.floor(elapsedMsSinceFetch / 1000);
        
        // Final time = (Server's base elapsed time) + (Time passed since we got the data)
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

  // Fetch active session and initialize state
  useEffect(() => {
    async function fetchActiveSession() {
      if (!token) return;
      stopTimer();

      try {
        const res = await fetch("http://127.0.0.1:8000/attendance-rt/active", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 🎯 CRUCIAL STEP: Record the EXACT moment the client received the data
        const fetchCompletedTime = Date.now(); 
        
        if (!res.ok) return;
        const data = await res.json();

        if (data.session_id && data.status) {
          setClockInTime(data.clock_in_time); 
          setClockOutTime(data.clock_out_time);
          setTotalBreakSeconds(data.elapsed_break_seconds || 0);
          setIsOnBreak(data.status === "break");
          
          // Store the server's absolute time duration (e.g., 480 seconds)
          serverBaseTimeRef.current = data.elapsed_work_seconds || 0;
          
          if (data.status === "active") {
            setIsRunning(true);
            
            // Anchor the timer to the moment the fetch finished
            fetchTimeRef.current = fetchCompletedTime;
            
            // Set initial time (which is just the server's time for the first render)
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
    return () => {
      stopTimer();
    };
  }, [token]);

  // POST helper (unchanged)
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
      alert("Error: could could not reach server");
      return null;
    }
  };

  // Time formatters (unchanged)
  const formatTime = (secs) => {
    const absSecs = Math.abs(secs);
    const sign = secs < 0 ? '-' : '';
    const h = String(Math.floor(absSecs / 3600)).padStart(2, "0");
    const m = String(Math.floor((absSecs % 3600) / 60)).padStart(2, "0");
    const s = String(absSecs % 60).padStart(2, "0");
    return `${sign}${h}:${m}:${s}`;
  };

  const formatTimeIST = (isoString) => {
    if (!isoString) return "--";
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const handleClockIn = async (e) => {
    e.preventDefault();
    const fetchStartedTime = Date.now(); // Record time right before fetch
    const data = await postAttendanceRT("clock-in");
    
    if (data) {
      setClockInTime(data.clock_in_time);
      setIsRunning(true);
      setIsOnBreak(false);
      setTotalBreakSeconds(0);
      setClockOutTime(null);
      
      // Reset base time and anchor the running timer to NOW
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
      
      // Set the time to the server's final, accurate duration
      setTime(data.total_work_seconds || 0); 
      
      // Clear all running refs
      fetchTimeRef.current = null;
      serverBaseTimeRef.current = 0;
      
      setTotalBreakSeconds(0);
      setBreakStartTime(null);
      setIsOnBreak(false);
      
      if (onClockAction) {
        setTimeout(() => onClockAction(), 1500);
      }
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
      // NOTE: For absolute accuracy on resuming break, you should ideally call fetchActiveSession() 
      // here to get the new total elapsed_work_seconds, but we stick to minimal changes:
      const data = await postAttendanceRT("stop-break");
      if (data) {
        setIsOnBreak(false);
        setIsRunning(true);
        setBreakStartTime(null);
        
        // When resuming work, anchor the timer to NOW, and the base time is the CURRENT time.
        serverBaseTimeRef.current = time; // Set the current visual time as the new base
        fetchTimeRef.current = Date.now(); // Reset anchor point
        
        startTimer();
      }
    }
  };
  
  const workSeconds = time;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col items-center">
        <div className="w-40 h-40 flex items-center justify-center rounded-full border-8 border-gray-200">
          <span className={`text-2xl font-bold ${isOnBreak ? "text-yellow-600" : "text-red-600"}`}>
            {formatTime(workSeconds)}
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
          Clock Out {clockOutTime ? formatTimeIST(clockOutTime) : ""}
        </Button>
        <Button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-6 rounded-lg"
          onClick={() => {
            if (isRunning) {
                // Update the total time base and reset the segment timer calculation.
                serverBaseTimeRef.current = time + 3600; 
                fetchTimeRef.current = Date.now(); // Reset anchor point
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