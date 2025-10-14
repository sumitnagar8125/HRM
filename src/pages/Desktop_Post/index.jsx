// src/pages/Desktop_Post/index.jsx
"use client";
import React from "react";
import Sidebar from "../../components/ui/Sidebar";
import Header from "./Header";
import DashboardLayout from "./DashboardLayout";

export default function IndexPage() {
  // Removed all state and effect hooks related to role and unread count.

  const user = { role: "employee" }; // Dummy user needed for DashboardLayout

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar /> {/* Sidebar is now self-sufficient */}
      <div className="flex-1 flex flex-col h-full">
        <Header />
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <DashboardLayout
            user={user}
          // setUnreadPostsCount is removed here
          />
        </div>
      </div>
    </div>
  );
}