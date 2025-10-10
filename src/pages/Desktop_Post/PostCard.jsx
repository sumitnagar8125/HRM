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

  return (
    <div
      className="relative rounded-2xl p-6 shadow-md bg-white border mb-6 transition hover:shadow-xl cursor-pointer"
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
      onClick={onClick}
      style={{ opacity: actionLoading ? 0.6 : 1 }}
    >
      <header className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{post.title}</h3>
        {post.is_pinned && <span title="Pinned" className="text-yellow-400 text-2xl">📌</span>}
      </header>
      <article className="my-3 text-gray-700">{post.content}</article>

      <section className="flex gap-2 flex-wrap mb-1">
        {Object.entries(post.reaction_counts || {}).map(([emoji, count]) => (
          <button
            key={emoji}
            type="button"
            className={`flex items-center gap-1 px-2 py-1 rounded-full font-medium text-yellow-900 border border-yellow-400 bg-yellow-200 text-base
              ${post.user_reactions?.includes(emoji) ? "ring-2 ring-blue-400" : ""}
            `}
            onClick={(e) => {
              e.stopPropagation();
              onToggleReaction(post.id, emoji);
            }}
            title={`React with ${emoji}`}
          >
            <span>{emoji}</span>
            <span>{count}</span>
          </button>
        ))}
      </section>

      {isAdmin && (
        <footer className="flex justify-end gap-3 mt-3 select-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPin(post.id);
            }}
            disabled={actionLoading}
            className={`px-4 py-2 rounded-full font-medium shadow-lg transition ${
              post.is_pinned ? "bg-yellow-300 hover:bg-yellow-400 text-yellow-900" : "bg-gray-200 hover:bg-yellow-100 text-gray-900"
            }`}
          >
            {post.is_pinned ? "Unpin" : "Pin"}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(post.id);
            }}
            disabled={actionLoading}
            className="px-4 py-2 rounded-full bg-red-100 hover:bg-red-300 text-red-700 font-medium shadow-lg transition"
          >
            Delete
          </button>
        </footer>
      )}

      {showReactions && allowReact && (
        <div
          className="absolute -top-12 left-6 w-[95%] z-30"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
          onClick={(e) => e.stopPropagation()}
        >
          <ReactionHoverBar onReact={(emoji) => onToggleReaction(post.id, emoji)} />
        </div>
      )}
    </div>
  );
}
