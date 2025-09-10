"use client";

import React, { useState } from "react";
import { FileUp } from "lucide-react"; // export icon

export default function Header() {
  const [view, setView] = useState("daily");

  return (
    <header className="flex justify-between items-center px-4 py-3 border border-blue-400 rounded-md shadow-sm bg-white w-full">
      {/* Title (left) */}
      <h1 className="text-blue-700 font-semibold">Timesheet</h1>

      {/* Right side (toggle + export) */}
      <div className="flex items-center gap-3">
        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-md overflow-hidden border border-gray-300">
          <button
            onClick={() => setView("daily")}
            className={`px-3 py-1 text-sm transition-colors ${
              view === "daily"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setView("monthly")}
            className={`px-3 py-1 text-sm transition-colors ${
              view === "monthly"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Export button */}
        <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors">
          <FileUp size={18} />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}
