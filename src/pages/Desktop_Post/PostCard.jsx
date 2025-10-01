import React from "react";

export default function PostCard({ quote, author, date, isToday }) {
  return (
    <div
      className={`rounded-xl shadow-lg px-6 py-5 mb-6 flex flex-col border transition-all duration-300 ${
        isToday ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white hover:shadow-xl"
      }`}
      style={{ position: "relative" }}
    >
      {isToday ? (
        <div className="flex items-center mb-2 gap-2">
          <span className="text-2xl">🌟</span>
          <span className="font-bold text-xl text-blue-700">Today's Inspiration</span>
        </div>
      ) : (
        <span className="text-md font-semibold text-gray-500 mb-2 tracking-wide">{date}</span>
      )}
      <span
        className={isToday ? "text-blue-900 text-lg italic" : "text-gray-800 text-md italic"}
        style={{ wordBreak: "break-word", whiteSpace: "pre-line" }}
      >
        {quote}
      </span>
      {author && <span className="mt-2 text-sm text-gray-500 italic">- {author}</span>}
    </div>
  );
}
