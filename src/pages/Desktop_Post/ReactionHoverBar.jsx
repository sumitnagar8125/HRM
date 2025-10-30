// src/pages/Desktop_Post/ReactionHoverBar.js
import React from "react";

const COMMON_EMOJIS = ["😂","🥳","👍","👏","🎉","🔥"];

export default function ReactionHoverBar({ onReact }) {
  return (
    <div className="flex gap-2 flex-nowrap overflow-x-auto bg-white rounded-full shadow-md px-3 py-2 border border-gray-200 select-none scrollbar-thin">
      {COMMON_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          title={`React with ${emoji}`}
          className="text-xl hover:bg-blue-100 rounded px-2 cursor-pointer transition"
          onClick={(e) => {
            e.stopPropagation();
            onReact(emoji);
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
