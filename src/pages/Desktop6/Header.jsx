"use client";

import React from "react";

export default function Header() {
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

  return (
    <header className="flex justify-between items-center px-4 py-3 border border-blue-400 rounded-md shadow-sm bg-white w-full">
      <h1 className="text-blue-700 font-semibold">Dashboard</h1>
      <span className="text-sm text-gray-700">{formattedDate}</span>
    </header>
 );
}