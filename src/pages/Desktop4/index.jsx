"use client";
import { useState } from "react";
import LeftPanel from "./left";
import RightPanel from "./right";

export default function Desktop4() {
  const [selectedRole, setSelectedRole] = useState("employee"); // Default role

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left Panel */}
      <div className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.jpg')" }}
        />
        <div className="relative z-10 h-full flex flex-col justify-center">
          <LeftPanel selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.jpg')" }}
        />
        <div className="relative z-10 h-full flex flex-col justify-center">
          <RightPanel selectedRole={selectedRole} />
        </div>
      </div>
    </div>
  );
}
