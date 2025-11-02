"use client";
import React from "react";

export default function Header() {
  return (
    <header
      className="flex justify-between items-center px-2 sm:px-4 py-3 border border-blue-400 rounded-md shadow-sm w-full relative"
      style={{
        backgroundImage: "url('/Hbg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        maxHeight: "60px",
        minHeight: "60px",
      }}
    >
      <h1 className="text-base sm:text-lg md:text-xl text-blue-700 font-semibold relative z-10">
        Company Details
      </h1>
    </header>
  );
}
