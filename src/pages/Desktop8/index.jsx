"use client";

import Sidebar from "../../components/ui/Sidebar";
import DashboardLayout from "./DashboardLayout";

export default function IndexPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (fixed height, scrollable if needed) */}
      <div className="h-full">
        <Sidebar />
      </div>

      {/* DashboardLayout (fills remaining space, scrolls internally) */}
      <div className="flex-1 h-full overflow-y-auto">
        <DashboardLayout />
      </div>
    </div>
  );
}
