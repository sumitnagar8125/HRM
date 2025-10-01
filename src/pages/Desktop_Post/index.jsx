"use client";
import React from "react";
import Sidebar from "../../components/ui/Sidebar";
import Header from "./Header";
import DashboardLayout from "./DashboardLayout";

export default function IndexPage() {
  const user = { role: "admin" }; // or "user"

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full">
        <Header />
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <DashboardLayout user={user} />
        </div>
      </div>
    </div>
  );
}
