"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function Header() {
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
      <h1 className="text-blue-700 font-semibold relative z-10">Leave Management</h1>

      <Link
        href="/newleave"
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors relative z-10"
      >
        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors">
          <Plus size={18} />
          <span>Request</span>
        </button>
      </Link>
    </header>
  );
}
