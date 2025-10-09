"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { 
  Home, Inbox, Clock, User, Building2, Calendar, HelpCircle, LogOut, 
  HeadphonesIcon,
  PlaneIcon, PenSquare, CheckCircle
} from "lucide-react";

// Base menu items without Status
const menuItems = [
  { name: "Home", icon: Home, path: "/home" },
  { name: "Timesheet", icon: Calendar, path: "/timesheet" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Inbox", icon: PlaneIcon, path: "/inbox" },
  { name: "Post", icon: PenSquare, path: "/post" },
  { name: "Company", icon: Building2, path: "/company" },
  { name: "Support", icon: HeadphonesIcon, path: "/support" },
];

// "Status" menu item, conditionally added if user is admin/super_admin
const statusMenuItem = { name: "Status", icon: CheckCircle, path: "/status" };

export default function Sidebar() {
  const [active, setActive] = useState("Home");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // or get your token from context/store

    if (!token) {
      setRole(null);
      setLoading(false);
      return;
    }

    axios
      .get("http://127.0.0.1:8000/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setRole(res.data.role);
        setLoading(false);
      })
      .catch(() => {
        setRole(null);
        setLoading(false);
      });
  }, []);

  // While loading, you can render nothing or a simple loader
  if (loading) {
    return <div>Loading...</div>;
  }

  // Construct the menu items conditionally
  let itemsToShow = [...menuItems];
  if (role === "admin" || role === "super_admin") {
    itemsToShow = [
      itemsToShow[0], // Home
      statusMenuItem, // Status
      ...itemsToShow.slice(1), // rest of the items
    ];
  }

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
          {itemsToShow.map((item) => (
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
