// src/pages/Desktop_Post/DashboardLayout.js

import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostDetailModal from "./PostDetailModal";
import CreatePostModal from "./CreatePostModal";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function DashboardLayout({ user }) {
  const [role, setRole] = useState(user.role);
  const [posts, setPosts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const isAdminOrSuperAdmin = role === "admin" || role === "super_admin";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  async function fetchData() {
    setLoading(true);
    try {
      let userRes = await fetch(`${BACKEND_URL}/users/me`, { headers: getAuthHeaders() });
      let user = await userRes.json();
      setRole(user.role);

      const isManager = user.role === "admin" || user.role === "super_admin";
      const postsUrl = isManager ? `${BACKEND_URL}/admin/posts` : `${BACKEND_URL}/posts`;
      const unreadUrl = `${BACKEND_URL}/posts/unread/count`;

      let [postsRes, unreadRes] = await Promise.all([
        fetch(postsUrl, { headers: getAuthHeaders() }),
        !isManager ? fetch(unreadUrl, { headers: getAuthHeaders() }) : Promise.resolve({ json: async () => ({ unread_count: 0 }) }),
      ]);

      let postsData = await postsRes.json();
      let unreadData = await unreadRes.json();
      const newUnreadCount = unreadData.unread_count ?? 0;

      setPosts(postsData);
      setUnreadCount(newUnreadCount);
    } catch (error) {
      setPosts([]);
      setUnreadCount(0);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function createPost(title, content, is_pinned) {
    setActionLoading((prev) => ({ ...prev, create: true }));
    await fetch(`${BACKEND_URL}/admin/posts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ title, content, is_pinned }),
    });
    setActionLoading((prev) => ({ ...prev, create: false }));
    await fetchData();
    setSelectedPostId(null);
  }

  async function deletePost(postId) {
    setActionLoading((prev) => ({ ...prev, [postId]: true }));
    await fetch(`${BACKEND_URL}/admin/posts/${postId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    setActionLoading((prev) => ({ ...prev, [postId]: false }));
    await fetchData();
  }

  async function togglePin(postId) {
    setActionLoading((prev) => ({ ...prev, [postId]: true }));
    await fetch(`${BACKEND_URL}/admin/posts/${postId}/toggle-pin`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    setActionLoading((prev) => ({ ...prev, [postId]: false }));
    await fetchData();
  }

  async function toggleReaction(postId, emoji) {
    setActionLoading((prev) => ({ ...prev, [postId]: true }));
    await fetch(`${BACKEND_URL}/posts/${postId}/react`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ emoji }),
    });
    setActionLoading((prev) => ({ ...prev, [postId]: false }));
    await fetchData();
  }

  async function markViewed(postId) {
    if (!isAdminOrSuperAdmin) {
      // 1. Hit API to mark as viewed
      await fetch(`${BACKEND_URL}/posts/${postId}/view`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      // 2. Optimistically update local state to reflect the change instantly
      // Decrement unread count for the local header badge
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Mark the specific post as viewed in the local `posts` array
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, is_viewed: true } // Mark as viewed
            : post
        )
      );

      // Removed: await fetchData()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-8 mb-8">
      <header className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        {!isAdminOrSuperAdmin && (
          <div className="inline-flex items-center space-x-2">
            <span className="text-gray-700 font-semibold">Unread</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">{unreadCount}</span>
          </div>
        )}
        {isAdminOrSuperAdmin && (
          <button
            disabled={actionLoading.create || loading}
            onClick={() => setSelectedPostId("create")}
            className="bg-gradient-to-br from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-2 rounded shadow font-semibold transition duration-200"
          >
            {actionLoading.create ? "Creating..." : "+ Create Post"}
          </button>
        )}
      </header>

      {selectedPostId === "create" && isAdminOrSuperAdmin && (
        <CreatePostModal onClose={() => setSelectedPostId(null)} onCreate={createPost} loading={actionLoading.create} />
      )}

      <main>
        {loading ? (
          <p className="text-center text-blue-500 my-20 text-lg">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500 my-20 text-lg">No posts available</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isAdmin={isAdminOrSuperAdmin}
                allowReact={true}
                onDelete={isAdminOrSuperAdmin ? deletePost : undefined}
                onPin={isAdminOrSuperAdmin ? togglePin : undefined}
                onToggleReaction={toggleReaction}
                actionLoading={actionLoading[post.id]}
                onClick={() => setSelectedPostId(post.id)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedPostId && selectedPostId !== "create" && (
        <PostDetailModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
          onToggleReaction={toggleReaction}
          onMarkViewed={markViewed}
          role={role}
        />
      )}
    </div>
  );
}