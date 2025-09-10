"use client";
import React from "react";
import Sidebar from "../../components/ui/Sidebar";
import DashboardLayout from "./DashboardLayout";

export default function IndexPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Right side (Header + Dashboard are now inside DashboardLayout) */}
      <DashboardLayout />
    </div>
  );
}
