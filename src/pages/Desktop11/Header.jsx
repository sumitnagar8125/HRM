import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function Header({ role }) {
  const isEmployee = role !== "admin" && role !== "super_admin";

  return (
    <header
      className="flex items-center px-4 py-3 border border-blue-400 rounded-md shadow-sm w-full relative"
      style={{
        backgroundImage: "url('/Hbg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        maxHeight: "60px",
        minHeight: "60px",
      }}
    >
      <div className="w-6 sm:w-32" />
      <div className={`flex-1 flex justify-center ${isEmployee ? "hidden sm:flex" : "flex"}`}>
        <h1 className="text-blue-700 font-semibold relative z-10 text-center">
          Leave Management
        </h1>
      </div>
      {/* Added mr-2 for small screens and mr-6 for larger */}
      <div className="flex items-center mr-2 sm:mr-6">
        {isEmployee && (
          <Link
            href="/newleave"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors relative z-10"
          >
            <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors">
              <Plus size={18} />
              <span>Leave Request</span>
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
