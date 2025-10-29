import React, { useState } from "react";
import ReactionHoverBar from "./ReactionHoverBar";

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
  const [showReactions, setShowReactions] = useState(false);

  // If post is undefined (happens during prerender), return a safe fallback
  if (!post) {
    return (
      <div className="rounded-xl px-6 py-5 shadow bg-gray-50 text-gray-400">
        Loading post...
      </div>
    );
  }

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
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "Unknown time";
    }
  };

  // Safe optional chaining
  const isPinned = post?.is_pinned ?? false;
  const isViewed = post?.is_viewed ?? true;
  const title = post?.title ?? "Untitled Post";
  const content = post?.content ?? "";
  const author = post?.author_name ?? "Unknown";
  const createdAt = post?.created_at ?? new Date().toISOString();
  const reactions = Object.entries(post?.reaction_counts || {});
  const userReactions = post?.user_reactions ?? [];

  // Explicit card style
  const cardStyle = isPinned
    ? {}
    : {
        background: "#f3f7fb",
        border: "1.5px solid #e0eaf6",
      };

  return (
    <div
      className={`
        relative rounded-xl px-6 py-5 shadow transition cursor-pointer
        hover:shadow-md
        ${isPinned ? "border-2 border-yellow-400 bg-yellow-50" : ""}
        ${!isViewed && !isAdmin ? "ring-2 ring-blue-300/40" : ""}
      `}
      style={{
        ...cardStyle,
        opacity: actionLoading ? 0.7 : 1,
      }}
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
      onClick={onClick}
    >
      {isPinned && (
        <span className="absolute right-4 top-4 text-yellow-500 text-xl" title="Pinned">
          📌
        </span>
      )}

      <h3 className="font-extrabold text-base md:text-lg text-blue-800 mb-1 flex items-center gap-2">
        {title}
      </h3>

      <div className="mb-3 text-gray-700 font-normal break-words">
        {content.length > 120 ? (
          <>
            {content.slice(0, 120)}
            <span className="text-blue-400 font-semibold">... Read more</span>
          </>
        ) : (
          content
        )}
      </div>

      <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-50 gap-2">
        <div className="flex gap-2 flex-wrap">
          {reactions.length > 0 ? (
            reactions.map(([emoji, count]) => (
              <button
                key={emoji}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleReaction?.(post.id, emoji);
                }}
                className={`
                  flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition
                  ${userReactions.includes(emoji)
                    ? "bg-blue-50 text-blue-700 border border-blue-400 shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"}
                `}
                style={{
                  fontFamily:
                    "Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif",
                }}
                title={`React with ${emoji}`}
              >
                <span>{emoji}</span>
                <span>{count}</span>
              </button>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No reactions</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-3 text-xs text-gray-400 items-end sm:items-center">
          <span className="text-xs">{getTimeAgo(createdAt)}</span>
          <span>
            by <b className="text-blue-600">{author}</b>
          </span>
        </div>
      </div>

      {showReactions && allowReact && (
        <div
          className="absolute left-6 -top-12 z-50"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
          onClick={(e) => e.stopPropagation()}
        >
          <ReactionHoverBar
            onReact={(emoji) => onToggleReaction?.(post.id, emoji)}
          />
        </div>
      )}
    </div>
  );
}
