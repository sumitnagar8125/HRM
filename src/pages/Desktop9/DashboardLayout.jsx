"use client";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Profile from "./Profile";

export default function DashboardLayout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Dummy data (replace with real API fetch later)
    const dummyUser = {
      name: "XYZ Asyaa",
      employeeId: "230122239002",
      email: "xyz123@gmail.com",
      image: "/logo.png", // or any static placeholder image
    };

    // Simulate API call delay
    setTimeout(() => {
      setUser(dummyUser);
    }, 500);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {user ? <Profile user={user} /> : <p>Loading profile...</p>}
        </div>
      </main>
    </div>
  );
}
