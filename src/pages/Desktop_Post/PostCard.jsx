import React from "react";
import ReactionBar from "./ReactionBar";

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
  return (
    <div
      onClick={onClick}
      className="relative rounded-2xl p-6 shadow-md bg-white transition hover:shadow-xl duration-150 cursor-pointer border"
      style={{ opacity: actionLoading ? 0.60 : 1 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {!post.is_viewed && (
            <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full">New</span>
          )}
          <span className="font-bold text-lg">{post.title}</span>
        </div>
        {post.is_pinned && (
          <span className="ml-2 text-2xl text-yellow-400" title="Pinned">📌</span>
        )}
      </div>
      <div className="mt-2 text-gray-700 mb-2">{post.content}</div>
      
      {/* WhatsApp style Reactions under post */}
      <ReactionBar
  emojis={Object.keys(post.reaction_counts)}
  reactionCounts={post.reaction_counts}
  userReactions={post.user_reactions}
  postId={post.id}
  onToggleReaction={allowReact ? onToggleReaction : () => {}}
  allowCustomReaction={allowReact}
/>


      {isAdmin && (
        <div className="flex justify-end gap-3 mt-3">
          <button
            className={`px-4 py-2 rounded-full font-medium transition shadow-lg
              ${post.is_pinned ? "bg-yellow-300 hover:bg-yellow-400 text-yellow-900" : "bg-gray-200 hover:bg-yellow-100 text-gray-900"}
            `}
            onClick={e => { e.stopPropagation(); onPin(post.id); }}
            disabled={actionLoading}
          >
            {post.is_pinned ? "Unpin" : "Pin"}
          </button>
          <button
            className="px-4 py-2 rounded-full bg-red-100 hover:bg-red-300 text-red-700 font-medium transition shadow-lg"
            onClick={e => { e.stopPropagation(); onDelete(post.id); }}
            disabled={actionLoading}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
