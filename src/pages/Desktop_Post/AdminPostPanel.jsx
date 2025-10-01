import React, { useState } from "react";

export default function AdminPostPanel() {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/inspiration/refresh-today", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        alert("Failed to refresh today's quote");
      } else {
        alert("Today's quote refreshed successfully! Please refresh the page to see the update.");
      }
    } catch {
      alert("Network error refreshing quote");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex justify-between items-center px-7 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl mt-8 mb-5 border border-blue-200">
      <span className="text-white font-bold text-lg tracking-wide">Admin Controls</span>
      <button
        disabled={loading}
        onClick={handleRefresh}
        className={`bg-white text-blue-700 font-semibold px-6 py-2 rounded-lg shadow transition ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"
        }`}
      >
        🔄 {loading ? "Refreshing..." : "Refresh Today's Quote"}
      </button>
    </div>
  );
}
