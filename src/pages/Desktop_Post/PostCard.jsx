

import React, { useState } from "react";
// import ReactionHoverBar from "./ReactionHoverBar"; // Removed unused import

export default function PostCard({
  post,
  isAdmin,
  allowReact,
  onToggleReaction,
  onDelete,
  onPin,
  actionLoading,
  onClick,
}) {
  // const [showReactions, setShowReactions] = useState(false); // Removed unused state

  // Function to format time difference (e.g., "10h ago")
  const getTimeAgo = (datetimeString) => {
    try {
      const date = new Date(datetimeString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);

      if (seconds < 60) return `${seconds}s ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days}d ago`;

      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <div
      className={`relative rounded-xl p-5 shadow-sm bg-blue-50 border border-blue-100 transition duration-300 hover:shadow-md cursor-pointer ${post.is_pinned ? "border-2 border-yellow-400 bg-yellow-50" : ""
        } ${!post.is_viewed && !isAdmin ? "ring-2 ring-blue-500/50" : ""}`}
      onMouseEnter={null}
      onMouseLeave={null}
      onClick={onClick}
      style={{ opacity: actionLoading ? 0.7 : 1 }}
    >
      <header className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-extrabold text-xl text-blue-800 flex items-center gap-2">
            {post.title}
            {post.is_pinned && <span title="Pinned" className="text-yellow-600 text-sm">📌 PINNED</span>}
          </h3>
          <div className="text-xs text-gray-500 mt-0.5">
            Posted by **{post.author_name}** | {getTimeAgo(post.created_at)}
          </div>
        </div>
      </header>

      <article className="my-3 text-gray-700 max-h-12 overflow-hidden text-ellipsis whitespace-nowrap">
        {post.content}
      </article>

      {/* COMMENTED OUT: Reaction Chips Section */}
      {/*
      <section className="flex gap-2 flex-wrap pt-2 border-t border-gray-100">
        {Object.entries(post.reaction_counts || {}).map(([emoji, count]) => (
          <button
            key={emoji}
            type="button"
            className={`...`}
            onClick={(e) => {
              e.stopPropagation();
              // onToggleReaction(post.id, emoji); 
            }}
            title={`React with ${emoji}`}
          >
            <span>{emoji}</span>
            <span>{count}</span>
          </button>
        ))}
      </section>
      */}

      {isAdmin && (
        <footer className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100 select-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPin(post.id);
            }}
            disabled={actionLoading}
            className={`px-4 py-1.5 rounded-lg font-semibold transition duration-200 shadow-sm text-sm ${post.is_pinned
              ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
          >
            {post.is_pinned ? "Unpin" : "Pin"}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Are you sure you want to delete this post?")) {
                onDelete(post.id);
              }
            }}
            disabled={actionLoading}
            className="px-4 py-1.5 rounded-lg bg-red-100 hover:bg-red-300 text-red-700 font-semibold shadow-sm transition duration-200 text-sm"
          >
            Delete
          </button>
        </footer>
      )}

      {/* COMMENTED OUT: Reaction Hover Bar */}
      {/*
      {showReactions && allowReact && (
        <div
          className="absolute -top-12 left-6 z-30 transition duration-300 ease-in-out"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
          onClick={(e) => e.stopPropagation()}
        >
          <ReactionHoverBar onReact={(emoji) => onToggleReaction(post.id, emoji)} />
        </div>
      )}
      */}
    </div>
  );
}