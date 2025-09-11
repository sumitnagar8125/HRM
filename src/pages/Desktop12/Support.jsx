export default function Support({ phoneNumber, whatsappLink }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 md:p-8 border">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-6">Get Help - Support</h2>

      {/* Subject */}
      <input
        type="text"
        placeholder="Enter your Subject"
        className="w-full border rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Category */}
      <input
        type="text"
        placeholder="Select Category"
        className="w-full border rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Description */}
      <textarea
        placeholder="Description here..."
        className="w-full border rounded-md px-4 py-2 mb-4 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* File Upload */}
      <label
        htmlFor="fileUpload"
        className="w-full border rounded-md px-4 py-6 mb-4 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 010 10h-1m-4 4l-4-4m0 0l4-4m-4 4h12"
          />
        </svg>
        Tap to upload file
      </label>
      <input id="fileUpload" type="file" className="hidden" />

      {/* Buttons */}
      <div className="flex flex-wrap gap-4">
        <button className="flex-1 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition">
          Submit Query
        </button>

        <a
          href={`tel:${phoneNumber}`}
          className="flex-1 bg-green-600 text-white text-center py-3 rounded-md hover:bg-green-700 transition"
        >
          Call Now
        </a>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-purple-400 text-white text-center py-3 rounded-md hover:bg-purple-500 transition"
        >
          Start Chat
        </a>
      </div>
    </div>
  );
}
