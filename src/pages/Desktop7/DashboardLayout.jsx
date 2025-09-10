"use client";
import React from "react";
import Header from "./Header";
import Leaves from "./Leaves";
import History from "./History";
import { Umbrella, Stethoscope, UserRound } from "lucide-react";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col flex-1 bg-gray-50 h-screen">
      {/* Header */}
      <Header />

      {/* Dashboard Content */}
      <main className="flex-1 p-6 flex flex-col space-y-6 overflow-hidden">
        
        {/* Leave Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Leaves
            title="Vacation"
            available={23}
            taken={7}
            color="#3B82F6"
            icon={<Umbrella size={20} className="text-blue-500" />}
          />
          <Leaves
            title="Medical"
            available={8}
            taken={2}
            color="#16A34A"
            icon={<Stethoscope size={20} className="text-green-500" />}
          />
          <Leaves
            title="Personal"
            available={3}
            taken={2}
            color="#6366F1"
            icon={<UserRound size={20} className="text-purple-500" />}
          />
        </div>

        {/* Leave History grows + scrolls */}
        <div className="flex-1 overflow-hidden">
          <History />
        </div>
      </main>
    </div>
  );
}
