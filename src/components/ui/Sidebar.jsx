"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Home, Inbox, Clock, User, Building2, Calendar, HelpCircle, LogOut, 
  HeadphonesIcon,
  PlaneIcon,PenSquare, CheckCircle

} from "lucide-react";

const menuItems = [
  { name: "Home", icon: Home, path: "/home" },
  { name: "Staus", icon: CheckCircle, path: "/status" },
  { name: "Timesheet",icon:Calendar, path: "/timesheet" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Leave", icon: PlaneIcon, path: "/leave" },
  { name: "Inbox", icon: Inbox, path: "/inbox" },
  { name: "Post", icon: PenSquare, path: "/post"},
  { name: "Company", icon: Building2, path: "/company" },
  { name: "Support", icon: HeadphonesIcon, path: "/support" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Home");

  return (
    <div 
      className="h-screen w-64 flex flex-col justify-between p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {/* --------- Logo + Heading --------- */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <Image 
            src="/logo.png" 
            alt="Zytexa Logo" 
            width={65} 
            height={80} 
            className="rounded-full"
          />
          <div>
            <h2 className="text-lg font-bold text-blue-600 leading-tight">
              Time Tracker
            </h2>
            <p className="text-sm text-gray-500">HRMS Management</p>
          </div>
        </div>

        {/* --------- Menu Items --------- */}
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-colors
                  ${active === item.name 
                    ? "bg-blue-600 text-black" 
                    : "hover:bg-blue-600 text-black"
                  }`}
                onClick={() => setActive(item.name)}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* --------- Logout (Bottom Fixed) --------- */}
      <div 
        onClick={() => alert("Logging out...")} 
        className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-blue-600 transition-colors text-black"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </div>
    </div>
  );
}
