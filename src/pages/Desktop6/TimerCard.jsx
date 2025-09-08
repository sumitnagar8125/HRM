"use client";
import React, { useState, useEffect } from "react";
import  Button  from "../../components/ui/Button"; // adjust import if needed

function TimerCard() {
  const [time, setTime] = useState(0); // seconds counter
  const [isRunning, setIsRunning] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);

  // Start/Stop timer effect
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Format time into hh:mm:ss
  const formatTime = (secs) => {
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

  const handleClockIn = () => {
    setClockInTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setIsRunning(true);
  };

  const handleClockOut = () => {
    setClockOutTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setIsRunning(false);
  };

  const handleBreak = () => {
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md w-full">
      {/* Timer Circle */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-40 h-40 flex items-center justify-center rounded-full border-8 border-gray-200">
          <span className="text-2xl font-bold text-red-600">{formatTime(time)}</span>
        </div>
        <p className="mt-2 text-gray-600">Clocked at {clockInTime || "--"}</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <Button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
          onClick={handleClockIn}
        >
          Clock In {clockInTime || ""}
        </Button>

        <Button
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg"
          onClick={handleClockOut}
        >
          Clock Out {clockOutTime || ""}
        </Button>

        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          onClick={() => setTime((t) => t + 3600)} // Example: add 1 hour
        >
          + Add Hours
        </Button>

        <Button
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg"
          onClick={handleBreak}
        >
          ☕ Start Break
        </Button>
      </div>
    </div>
  );
}

export default TimerCard;