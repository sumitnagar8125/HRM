"use client";
import React from "react";
import Sidebar from "../../components/ui/Sidebar";
import Header from "./Header";
import DashboardLayout from "./DashboardLayout";

export default function IndexPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="h-full w-64 flex-shrink-0">
        <Sidebar />
      </aside>
      <main className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="w-full">
          <Header />
        </div>
        {/* Dashboard */}
        <div className="flex-1 overflow-auto min-h-0">
          <DashboardLayout />
        </div>
      </main>
    </div>
  );
}
