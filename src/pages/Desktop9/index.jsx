"use client";
import React from "react";
import Sidebar from "../../components/ui/Sidebar";
import DashboardLayout from "./DashboardLayout";


export default function IndexPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <div className="flex flex-col flex-1">
      
        <DashboardLayout />
      </div>
    </div>
  );
}
