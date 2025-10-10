import React, { useState, useEffect } from "react";
import ReactionHoverBar from "./ReactionHoverBar";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function PostDetailModal({ postId, onClose, onToggleReaction, onMarkViewed, role }) {
  const [post, setPost] = useState(null);
  const [showReactions, setShowReactions] = useState(false);

  const getAuthHeaders = () => ({
    Authorization: "Bearer " + (localStorage.getItem("token") || "")
  });

  useEffect(() => {
    const fetchPost = async () => {
      const url = role === "admin" ? `${BACKEND_URL}/admin/posts` : `${BACKEND_URL}/posts`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();
      const found = data.find(p => p.id === postId);
      setPost(found);
      if (found && !found.is_viewed) {
        onMarkViewed(postId);
      }
    };
    fetchPost();
  }, [postId, role]);

  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl px-10 py-7 w-full max-w-2xl relative">
        <button className="absolute top-4 right-6 text-3xl font-bold hover:text-red-500" onClick={onClose}>&times;</button>
        <div className="flex justify-between items-center mb-3">
          <div className="text-lg font-bold">{post.title}</div>
          {post.is_pinned && <span className="text-2xl text-yellow-400" title="Pinned">📌</span>}
        </div>
        <div 
          className="text-gray-700 mb-6"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >{post.content}</div>
        <div className="flex gap-2 mb-1">
          {Object.entries(post.reaction_counts || {}).map(([emoji, count]) => (
            <button
              key={emoji}
              className={`
                px-2 py-1 rounded-full font-medium bg-yellow-200 border border-yellow-400 text-yellow-900 flex items-center gap-1 text-base
                ${post.user_reactions?.includes(emoji) ? "ring-2 ring-blue-400" : ""}
              `}
              onClick={e => { e.stopPropagation(); onToggleReaction(post.id, emoji); }}
            >
              <span>{emoji}</span>
              <span>{count}</span>
            </button>
          ))}
        </div>
        {showReactions && (
          <ReactionHoverBar onReact={emoji => onToggleReaction(post.id, emoji)} />
        )}
        <div className="text-xs text-gray-500 mt-6">By {post.author_name} | {post.created_at}</div>
      </div>
    </div>
  );
}
