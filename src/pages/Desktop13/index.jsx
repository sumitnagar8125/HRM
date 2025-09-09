"use client";
import React from "react";
import New_leave from "./Newleave"
import Sidebar from "../../components/ui/Sidebar";
import Header from "./Header";


export default function IndexPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      
       <New_leave />
      
    </div>
  );
}
