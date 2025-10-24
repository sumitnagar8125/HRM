// src/pages/Desktop_Post/ReactionBar.js
import React, { useState, useRef } from "react";

const COMMON_EMOJIS = ["😀","😍","😂","🥳","👍","👏","🙏","🎉","🔥"];

export default function ReactionBar({
  emojis = [],
  reactionCounts = {},
  userReactions = [],
  postId,
  onToggleReaction,
  allowCustomReaction = false,
}) {
  const [customReaction, setCustomReaction] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const submitCustomReaction = () => {
    if (!customReaction.trim()) {
      setError("Add an emoji or text");
      return;
    }
    setError("");
    onToggleReaction(postId, customReaction.trim());
    setCustomReaction("");
    setShowEmoji(false);
  };

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* Reaction chips shown to everyone */}
        {emojis.map(emoji => (
          <button
            key={emoji}
            className={`
              rounded-full px-3 py-1 font-semibold flex items-center gap-1 border text-base
              ${userReactions.includes(emoji)
                ? "bg-yellow-300 text-yellow-900 border-yellow-400"
                : "bg-gray-100 text-gray-800 border-gray-200"}
              hover:bg-yellow-50 transition
            `}
            title="Click to toggle your reaction"
            onClick={e => {
              e.stopPropagation();
              onToggleReaction(postId, emoji);
            }}
          >
            <span>{emoji}</span>
            <span className="pl-1">{reactionCounts[emoji]}</span>
          </button>
        ))}
      </div>
      {allowCustomReaction && (
        <div className="relative flex items-center gap-2 w-full mt-2">
          <button
    type="button"
    className="absolute left-2 z-10 text-xl bg-transparent border-none outline-none"
    style={{ background: "none" }}
    onClick={(e) => { e.stopPropagation(); setShowEmoji(!showEmoji); }}
    tabIndex={-1}
  >😊</button>
  <input
    ref={inputRef}
    style={{ paddingLeft: "2.3rem" }} // to leave space for the emoji button
    className="pr-3 py-1 rounded-full border border-gray-300 text-sm focus:ring-2 focus:ring-blue-200 shadow w-[160px] outline-none transition"
    placeholder="Add reaction"
    value={customReaction}
    onChange={e => { setCustomReaction(e.target.value); setError(""); }}
    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); submitCustomReaction(); } }}
    onFocus={() => setShowEmoji(false)}
  />
          {showEmoji && (
            <div className="absolute z-20 bg-white shadow-lg rounded p-2 mt-12 left-0 flex flex-wrap gap-2">
              {COMMON_EMOJIS.map(e => (
                <button
                  key={e}
                  className="hover:bg-blue-100 text-xl px-1 py-1 rounded"
                  onClick={() => {
                    setCustomReaction(e);
                    setShowEmoji(false);
                    inputRef.current?.focus();
                  }}
                >{e}</button>
              ))}
            </div>
          )}
          <button
            className="px-5 py-1 rounded-full font-semibold bg-blue-500 text-white hover:bg-blue-700 shadow transition"
            onClick={submitCustomReaction}
          >Add</button>
          {error && <span className="text-xs text-red-600 ml-2">{error}</span>}
        </div>
      )}
    </div>
  );
}