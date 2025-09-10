"use client";
import React from "react";
import Leaves from "./Leaves"; 
import History from "./History";
import { Umbrella, Stethoscope, UserRound } from "lucide-react";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      <main className="p-6">
        {/* Leave Cards Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
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
        <div  >
            <History />
        </div>

        {/* Render Children (like History etc.) */}
        {children}
      </main>
    </div>
  );
}
