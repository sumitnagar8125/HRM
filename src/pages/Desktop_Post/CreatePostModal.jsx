import React, { useState } from "react";

export default function CreatePostModal({ onClose, onCreate, loading }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const canSubmit = title.trim() !== "" && content.trim() !== "";

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate(title, content, isPinned);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-3xl font-bold text-gray-600 hover:text-red-600"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full mb-3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <textarea
          placeholder="Content"
          className="w-full mb-3 px-4 py-2 border rounded min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            disabled={loading}
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">Pin this post</span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className={`w-full py-2 rounded text-white font-semibold shadow-lg ${
            canSubmit && !loading
              ? "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
