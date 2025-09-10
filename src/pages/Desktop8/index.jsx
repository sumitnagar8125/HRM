"use client";

import Sidebar from "../../components/ui/Sidebar";
import DashboardLayout from "./DashboardLayout";

export default function IndexPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (left side) */}
      <Sidebar />

      {/* DashboardLayout handles Header + Calendar + Other content */}
      <DashboardLayout />
    </div>
  );
}
