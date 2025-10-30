import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, User, Building2, Calendar, LogOut,
  PlaneIcon, PenSquare, CheckCircle, Bell
} from "lucide-react";

const menuItems = [
  { name: "Home", icon: Home, path: "/home" },
  { name: "Timesheet", icon: Calendar, path: "/timesheet" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Leave", icon: PlaneIcon, path: "/inbox" },
  { name: "Post", icon: PenSquare, path: "/post" },
  { name: "Company", icon: Building2, path: "/company" },
];
const statusMenuItem = { name: "Status", icon: CheckCircle, path: "/status" };

export default function Sidebar() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [unreadPostsCount, setUnreadPostsCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Sync logout across tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "token" && !event.newValue) {
        router.push("/");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRole(null);
      setLoading(false);
      return;
    }
    async function fetchSidebarData() {
      try {
        const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { headers: getAuthHeaders() });
        const userRole = userRes.data.role;
        setRole(userRole);
        const isManager = userRole === "admin" || userRole === "super_admin";
        if (!isManager) {
          const unreadRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/unread/count`, { headers: getAuthHeaders() });
          setUnreadPostsCount(unreadRes.data.unread_count || 0);
        } else {
          setUnreadPostsCount(0);
        }
      } catch (error) {
        setRole(null);
        setUnreadPostsCount(0);
      } finally {
        setLoading(false);
      }
    }
    fetchSidebarData();
    const intervalId = setInterval(fetchSidebarData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  let itemsToShow = [...menuItems];
  if (role === "admin" || role === "super_admin") {
    itemsToShow = [itemsToShow[0], statusMenuItem, ...itemsToShow.slice(1)];
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/");
  }

  return (
    <>
      {/* Hamburger menu for mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-40 bg-white p-2 rounded shadow-sm"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="#1d4ed8" strokeWidth="2" /></svg>
      </button>
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col justify-between
          w-64 p-4 bg-cover bg-center bg-white shadow-lg
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:flex
        `}
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <Image src="/logo.png" alt="Zytexa Logo" width={65} height={80} className="rounded-full" />
            <div>
              <h2 className="text-lg font-bold text-blue-600 leading-tight">Time Tracker</h2>
              <p className="text-sm text-gray-500">HRMS Management</p>
            </div>
          </div>
          <ul className="space-y-3">
            {itemsToShow.map((item) => {
              const showNotification = item.name === "Post" && unreadPostsCount > 0;
              const currentActive = pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                      currentActive ? "bg-blue-600 text-white" : "hover:bg-blue-600 text-black"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon size={18} />
                      <span>{item.name}</span>
                    </div>
                    {showNotification && (
                      <div className="relative z-20">
                        <Bell size={16} className={`${currentActive ? 'text-white' : 'text-red-500'}`} />
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 ring-1 ring-white transform translate-x-1/4 -translate-y-1/4"></span>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div
          onClick={handleLogout}
          className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-blue-600 transition-colors text-black"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </div>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
