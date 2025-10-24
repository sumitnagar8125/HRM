// src/pages/Desktop_Post/PostDetailModal.js

import React, { useState, useEffect } from "react";
// import ReactionHoverBar from "./ReactionHoverBar"; // Removed unused import

const BACKEND_URL = "http://127.0.0.1:8000";

export default function PostDetailModal({ postId, onClose, onToggleReaction, onMarkViewed, role }) {
  const [post, setPost] = useState(null);
  // const [showReactions, setShowReactions] = useState(false); // Removed unused state

  const getAuthHeaders = () => ({
    Authorization: "Bearer " + (localStorage.getItem("token") || "")
  });

  useEffect(() => {
    const fetchPost = async () => {
      const url = role === "admin" || role === "super_admin" ? `${BACKEND_URL}/admin/posts` : `${BACKEND_URL}/posts`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();
      const found = data.find(p => p.id === postId);

      setPost(found);

      if (found && !found.is_viewed) {
        onMarkViewed(postId);
      }
    };
    fetchPost();
  }, [postId]);

  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl px-10 py-7 w-full max-w-2xl relative max-h-[90vh]">
        <button className="absolute top-4 right-6 text-3xl font-bold hover:text-red-500" onClick={onClose}>&times;</button>

        {/* Modal Header */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
          <div className="text-xl font-bold text-gray-800">{post.title}</div>
          {post.is_pinned && <span className="text-2xl text-yellow-400" title="Pinned">📌</span>}
        </div>

        {/* Content Area */}
        <div
          className="text-gray-700 mb-6 py-2 pr-2 overflow-y-auto max-h-96"
        >
          <pre className="whitespace-pre-wrap font-sans">{post.content}</pre>
        </div>

        {/* Reactions Wrapper - All content commented out */}
        <div
          className="relative"
          onMouseEnter={null}
          onMouseLeave={null}
        >
          {/* COMMENTED OUT: Reaction Hover Bar */}
          {/*
          {showReactions && (
            <div className="absolute -top-14 left-0 z-10">
              <ReactionHoverBar onReact={emoji => onToggleReaction(post.id, emoji)} />
            </div>
          )}
          */}

          {/* COMMENTED OUT: Reaction Chips Display */}
          {/*
          <div className="flex gap-2 mb-1 pt-2 border-t border-gray-100">
            {Object.entries(post.reaction_counts || {}).map(([emoji, count]) => (
              <button
                key={emoji}
                className={`...`}
                onClick={e => { e.stopPropagation(); onToggleReaction(post.id, emoji); }}
              >
                <span>{emoji}</span>
                <span>{count}</span>
              </button>
            ))}
          </div>
          */}
          <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">By {post.author_name} | {post.created_at}</div>
        </div>
      </div>
    </div>
  );
}