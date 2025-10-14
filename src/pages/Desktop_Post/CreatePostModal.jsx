// src/pages/Desktop_Post/CreatePostModal.js

import React, { useState } from "react";

export default function CreatePostModal({ onClose, onCreate, loading }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const canSubmit = title.trim() !== "" && content.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onCreate(title, content, isPinned);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-gray-600 transition"
          title="Close"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-6 text-blue-800">Create New Post</h2>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Post Title *</label>
          <input
            type="text"
            placeholder="A short, catchy title"
            required
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">Post Content *</label>
          <textarea
            placeholder="The main content of your post..."
            required
            className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />

          <div className="flex items-center justify-between mb-8 p-3 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                disabled={loading}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 font-semibold">Pin this post</span>
            </label>
            <span className="text-xs text-gray-500">Pinned posts appear at the top</span>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-xl transition duration-200 ${canSubmit && !loading
                ? "bg-green-600 hover:bg-red-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {loading ? "Posting..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}