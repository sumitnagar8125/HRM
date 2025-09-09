"use client";

import React from "react";
import { Plus } from "lucide-react";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-4 py-3 border border-blue-400 rounded-md shadow-sm bg-white w-full">
      <h1 className="text-blue-700 font-semibold">Leave Management</h1>

      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors">
        <Plus size={18} />
        <span>Leave Request</span>
      </button>
    </header>
  );
}
