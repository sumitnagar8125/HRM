"use client";
import React from "react";

export default function Header({ isAdmin, onManageEmployees }) {
  return (
    <header className="flex justify-between items-center px-4 py-3 border border-blue-400 rounded-md shadow-sm bg-white w-full">
      <h1 className="text-blue-700 font-semibold">Profile</h1>
      {isAdmin && (
        <button
          onClick={onManageEmployees}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Manage Employees
        </button>
      )}
    </header>
  );
}
