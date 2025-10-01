import React, { useEffect, useState } from "react";
import PostFeed from "./PostFeed";
import AdminPostPanel from "./AdminPostPanel";

export default function DashboardLayout() {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [todayQuote, setTodayQuote] = useState(null);
  const [historyQuotes, setHistoryQuotes] = useState([]);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      // User Role
      const userRes = await fetch("http://127.0.0.1:8000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!userRes.ok) throw new Error("Failed to fetch user info");
      const userData = await userRes.json();
      setUserRole(userData.role || "user");

      // Today's quote
      const todayRes = await fetch("http://127.0.0.1:8000/inspiration/today", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!todayRes.ok) throw new Error("Failed to fetch today's quote");
      const todayData = await todayRes.json();
      setTodayQuote(todayData);

      // History quotes
      const historyRes = await fetch("http://127.0.0.1:8000/inspiration/history?days=7", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!historyRes.ok) throw new Error("Failed to fetch quote history");
      const historyData = await historyRes.json();
      setHistoryQuotes(historyData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-600">Error: {error}</div>;

  return (
    <div className="flex flex-col items-center py-10 bg-gray-50 min-h-screen">
      {userRole === "admin" && <AdminPostPanel onPostCreated={fetchPosts} />}
      <PostFeed todayQuote={todayQuote} historyQuotes={historyQuotes} />
    </div>
  );
}
