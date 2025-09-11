"use client";
import React from "react";
import Sidebar from "../../components/ui/Sidebar";
import Header from "./Header";
import Newleave from "./Newleave";

export default function IndexPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content on the right */}
      <div className="flex flex-col flex-1">
        {/* Header at the top */}
        <Header />

        {/* Page Content (New Leave Section) */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Newleave />
        </main>
      </div>
    </div>
  );
}
