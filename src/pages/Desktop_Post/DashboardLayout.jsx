import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostDetailModal from "./PostDetailModal";

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const userRes = await fetch(`${BACKEND_URL}/users/me`, { headers: getAuthHeaders() });
      const user = await userRes.json();
      setRole(user.role);

      const postsUrl = user.role === "admin" ? `${BACKEND_URL}/admin/posts` : `${BACKEND_URL}/posts`;
      const [postsRes, unreadRes] = await Promise.all([
        fetch(postsUrl, { headers: getAuthHeaders() }),
        user.role === "admin"
          ? Promise.resolve({ json: () => ({ unread_count: 0 }) })
          : fetch(`${BACKEND_URL}/posts/unread/count`, { headers: getAuthHeaders() })
      ]);
      setPosts(await postsRes.json());
      if (user.role === "employee") {
        const unreadData = await unreadRes.json();
        setUnreadCount(unreadData.unread_count);
      } else {
        setUnreadCount(0);
      }
    } catch {
      setPosts([]);
      setUnreadCount(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // admin: create/pin/delete, employee: reactions/marked viewed (roles checked below)
  const createPost = async (title, content, is_pinned) => {
    setActionLoading((p) => ({ ...p, create: true }));
    await fetch(`${BACKEND_URL}/admin/posts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ title, content, is_pinned }),
    });
    await fetchData();
    setActionLoading((p) => ({ ...p, create: false }));
    setSelectedPostId(null);
  };
  const deletePost = async postId => {
    setActionLoading((p) => ({ ...p, [postId]: true }));
    await fetch(`${BACKEND_URL}/admin/posts/${postId}`, { method: "DELETE", headers: getAuthHeaders() });
    await fetchData();
    setActionLoading((p) => ({ ...p, [postId]: false }));
  };
  const togglePin = async postId => {
    setActionLoading((p) => ({ ...p, [postId]: true }));
    await fetch(`${BACKEND_URL}/admin/posts/${postId}/toggle-pin`, { method: "POST", headers: getAuthHeaders() });
    await fetchData();
    setActionLoading((p) => ({ ...p, [postId]: false }));
  };
  const toggleReaction = async (postId, emoji) => {
    setActionLoading((p) => ({ ...p, [postId]: true }));
    await fetch(`${BACKEND_URL}/posts/${postId}/react`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ emoji }),
    });
    await fetchData();
    setActionLoading((p) => ({ ...p, [postId]: false }));
  };
  const markViewed = async postId => {
    if (role === "employee") {
      await fetch(`${BACKEND_URL}/posts/${postId}/view`, { method: "POST", headers: getAuthHeaders() });
      await fetchData();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        {role === "employee" && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Unread</span>
            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">{unreadCount}</span>
          </div>
        )}
        {role === "admin" && (
          <button
            className="px-5 py-2 rounded bg-gradient-to-tr from-blue-600 to-blue-400 text-white font-bold shadow-lg hover:from-blue-700 hover:to-blue-500"
            onClick={() => setSelectedPostId("create")}
            disabled={actionLoading.create || loading}
          >
            {actionLoading.create ? "Creating..." : "+ Create Post"}
          </button>
        )}
      </div>
      {selectedPostId === "create" && role === "admin" && (
        <CreatePostModal onClose={() => setSelectedPostId(null)} onCreate={createPost} loading={actionLoading.create} />
      )}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-16 text-lg text-blue-400">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-lg">No posts available.</div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              isAdmin={role === "admin"}
              allowReact={role === "employee" || role === "admin"}
              onToggleReaction={toggleReaction}
              onDelete={role === "admin" ? deletePost : undefined}
              onPin={role === "admin" ? togglePin : undefined}
              actionLoading={actionLoading[post.id]}
              onClick={() => setSelectedPostId(post.id)}
            />
          ))
        )}
      </div>
      {selectedPostId && selectedPostId !== "create" && (
        <PostDetailModal postId={selectedPostId} onClose={() => setSelectedPostId(null)} onToggleReaction={toggleReaction} onMarkViewed={markViewed} role={role} />
      )}
    </div>
  );
}

function CreatePostModal({ onClose, onCreate, loading }) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isPinned, setIsPinned] = React.useState(false);
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl relative">
        <button className="absolute top-3 right-4 text-xl font-semibold text-gray-600 hover:text-red-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Create New Post</h2>
        <input type="text" placeholder="Title" className="w-full mb-3 px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Content" className="w-full mb-3 px-4 py-2 rounded border min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={content} onChange={e => setContent(e.target.value)} />
        <label className="flex items-center space-x-2 mb-4">
          <input type="checkbox" checked={isPinned} onChange={e => setIsPinned(e.target.checked)} className="w-5 h-5" />
          <span className="font-medium text-gray-700">Pin this post</span>
        </label>
        <button className="w-full py-2 px-4 rounded bg-gradient-to-tr from-blue-600 to-blue-400 text-white font-bold shadow-lg disabled:opacity-40" disabled={!title || !content || loading} onClick={() => onCreate(title, content, isPinned)}>
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
