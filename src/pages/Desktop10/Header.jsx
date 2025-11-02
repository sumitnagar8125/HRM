// Header.jsx
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
    <header
      className="flex flex-col items-center justify-center px-4 py-3 border border-blue-400 rounded-md shadow-sm w-full relative"
      style={{
        backgroundImage: "url('/Hbg.jpg')", 
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "60px", 
      }}
    >
      <h1 className="text-blue-700 font-semibold text-base sm:text-lg md:text-xl text-center mb-1 relative z-10">
        Company Details
      </h1>
      <span className="text-sm text-gray-700 relative z-10 text-center">{formattedDate}</span>
    </header>
  );
}
