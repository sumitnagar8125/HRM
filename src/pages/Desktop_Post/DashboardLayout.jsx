import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostDetailModal from "./PostDetailModal";
import CreatePostModal from "./CreatePostModal";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function Dashboard() {
  const [role, setRole] = useState("");
  const [posts, setPosts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  async function fetchData() {
    setLoading(true);
    try {
      let userRes = await fetch(`${BACKEND_URL}/users/me`, { headers: getAuthHeaders() });
      let user = await userRes.json();
      setRole(user.role);

      const postsUrl = user.role === "admin" ? `${BACKEND_URL}/admin/posts` : `${BACKEND_URL}/posts`;
      const unreadUrl = `${BACKEND_URL}/posts/unread/count`;

      let [postsRes, unreadRes] = await Promise.all([
        fetch(postsUrl, { headers: getAuthHeaders() }),
        user.role === "employee" ? fetch(unreadUrl, { headers: getAuthHeaders() }) : Promise.resolve({ json: async () => ({ unread_count: 0 }) }),
      ]);

      let postsData = await postsRes.json();
      let unreadData = await unreadRes.json();

      setPosts(postsData);
      setUnreadCount(unreadData.unread_count ?? 0);
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
    if (role === "employee") {
      await fetch(`${BACKEND_URL}/posts/${postId}/view`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      await fetchData();
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {role === "employee" && (
          <div className="inline-flex items-center space-x-2">
            <span className="text-gray-700 font-semibold">Unread</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">{unreadCount}</span>
          </div>
        )}
        {role === "admin" && (
          <button
            disabled={actionLoading.create || loading}
            onClick={() => setSelectedPostId("create")}
            className="bg-gradient-to-br from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-2 rounded shadow font-semibold"
          >
            {actionLoading.create ? "Creating..." : "+ Create Post"}
          </button>
        )}
      </header>

      {selectedPostId === "create" && role === "admin" && (
        <CreatePostModal onClose={() => setSelectedPostId(null)} onCreate={createPost} loading={actionLoading.create} />
      )}

      <main>
        {loading ? (
          <p className="text-center text-blue-500 my-20 text-lg">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500 my-20 text-lg">No posts available</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isAdmin={role === "admin"}
                allowReact={role !== ""}
                onDelete={role === "admin" ? deletePost : undefined}
                onPin={role === "admin" ? togglePin : undefined}
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
