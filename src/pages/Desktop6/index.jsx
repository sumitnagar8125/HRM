"use client";
import React from "react";
import Sidebar from "../../components/ui/Sidebar";
import Header from "./Header";
import DashboardLayout from "./DashboardLayout";

export default function IndexPage() {
  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <DashboardLayout />
      </div>
    </div>
  );
}
