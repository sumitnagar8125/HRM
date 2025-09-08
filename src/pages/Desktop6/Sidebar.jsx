import { useState } from "react";
import { Home, Inbox, Clock, User, Building2, Calendar, HelpCircle, LogOut } from "lucide-react";

const menuItems = [
  { id: 1, label: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
  { id: 2, label: "Inbox", icon: <Inbox size={20} />, path: "/inbox" },
  { id: 3, label: "Timesheet", icon: <Clock size={20} />, path: "/timesheet" },
  { id: 4, label: "Profile", icon: <User size={20} />, path: "/profile" },
  { id: 5, label: "Company", icon: <Building2 size={20} />, path: "/company" },
  { id: 6, label: "Leave", icon: <Calendar size={20} />, path: "/leave" },
  { id: 7, label: "Support", icon: <HelpCircle size={20} />, path: "/support" },
  { id: 8, label: "Logout", icon: <LogOut size={20} />, path: "/" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">MyApp</h1>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.label)}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition 
              ${active === item.label ? "bg-purple-600" : "hover:bg-gray-700"}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
