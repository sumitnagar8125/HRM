"use client";
import React from "react";

export default function Header({ isAdmin, onManageEmployees }) {
  return (
    <header
      className="flex justify-between items-center px-4 py-3 border border-blue-400 rounded-md shadow-sm w-full relative"
      style={{
        backgroundImage: "url('/Hbg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        maxHeight: "60px",
        minHeight: "60px", 
      }}
    >
      {/* Left spacer for centering */}
      <div className="w-28" />
      
      {/* Centered Profile heading */}
      <h1 className="text-blue-700 font-semibold relative z-10 text-center flex-1">
        Profile
      </h1>
      
      {isAdmin && (
  <button
    onClick={onManageEmployees}
    className="bg-blue-600 text-white py-1.5 px-3 sm:py-2 sm:px-4 text-sm sm:text-base rounded hover:bg-green-700 relative z-10"
  >
    Manage Employees
  </button>
)}

    </header>
  );
}
