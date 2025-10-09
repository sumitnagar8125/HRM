import React, { useState, useEffect } from "react";
import ReactionBar from "./ReactionBar";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function PostDetailModal({ postId, onClose, onToggleReaction, onMarkViewed, role }) {
  const [post, setPost] = useState(null);

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
        <div className="text-gray-700 mb-6">{post.content}</div>
        <ReactionBar
  emojis={Object.keys(post.reaction_counts)}
  reactionCounts={post.reaction_counts}
  userReactions={post.user_reactions}
  postId={post.id}
  onToggleReaction={onToggleReaction || (() => {})}
  allowCustomReaction={true}
/>

        <div className="text-xs text-gray-500 mt-6">By {post.author_name} | {post.created_at}</div>
      </div>
    </div>
  );
}
