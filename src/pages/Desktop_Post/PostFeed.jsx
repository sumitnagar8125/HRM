import React from "react";
import PostCard from "./PostCard";

export default function PostFeed({ todayQuote, historyQuotes }) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <PostCard
        quote={todayQuote?.text || "No quote for today."}
        author={todayQuote?.author}
        date={todayQuote?.date}
        isToday
      />
      <h2 className="text-lg font-bold text-gray-700 mt-10 mb-3 pl-2">Recent Inspiration</h2>
      <div>
        {historyQuotes.length ? (
          historyQuotes.map((entry, idx) => (
            <PostCard key={idx} quote={entry.text} author={entry.author} date={entry.date} />
          ))
        ) : (
          <p className="text-gray-500 text-center">No history available.</p>
        )}
      </div>
    </div>
  );
}
