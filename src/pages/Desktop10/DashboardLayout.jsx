"use client";
import React from "react";
import Header from "./Header";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col flex-1 bg-gray-50 h-screen">
      {/* Header */}
      <Header />
    </div>
  );
}
