"use client";
import React from "react";
import Sidebar from "../../components/ui/Sidebar";
import Header from "./Header";
import DashboardLayout from "./DashboardLayout";

export default function IndexPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Dashboard */}
        <DashboardLayout />
      </div>
    </div>
  );
}
