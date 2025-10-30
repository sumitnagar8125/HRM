"use client";
import Sidebar from "../../components/ui/Sidebar";
import DashboardLayout from "./DashboardLayout";

export default function IndexPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-x-auto">
        <DashboardLayout />
      </div>
    </div>
  );
}
