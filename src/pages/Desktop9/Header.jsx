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
      <h1 className="text-blue-700 font-semibold relative z-10">Profile</h1>
      {isAdmin && (
        <button
          onClick={onManageEmployees}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 relative z-10"
        >
          Manage Employees
        </button>
      )}
    </header>
  );
}
