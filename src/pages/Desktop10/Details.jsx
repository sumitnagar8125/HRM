"use client";

import React from "react";
import Image from "next/image";

export default function Details() {
  return (
    <div className="border rounded-lg bg-white p-6 md:p-8 shadow-sm w-full">
      {/* Top row: logo + name spans full width */}
      <div className="flex items-center gap-4 mb-6">
        <Image
          src="/logo.png" // replace with your actual logo path
          alt="Company Logo"
          width={70}
          height={70}
          className="object-contain"
        />
        <h2 className="text-xl font-semibold text-blue-700">
          Zytexa Technology
        </h2>
      </div>

      {/* Grid for info (2 columns: left + right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm text-gray-700">
        {/* Row 1 */}   
        <p>
          <span className="font-semibold">Industry:</span> IT Services & Consulting
        </p>
        <p className="md:text-right">
          <span className="font-semibold">Founded:</span> January 2025
        </p>

        {/* Row 2 */}
        <p>
          <span className="font-semibold">Address:</span> Dhawas, Ward Number 18, Jaipur, Rajasthan 302021
        </p>
        <p className="md:text-right">
          <span className="font-semibold">Employees:</span> 50+ Professionals
        </p>
      </div>
    </div>
  );
}
