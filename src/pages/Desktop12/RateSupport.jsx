"use client";

import { Star } from "lucide-react";

export default function RateSupport({ feedbackLink }) {
  return (
    <div className="rounded-lg shadow-sm p-6 text-center bg-gradient-to-r from-purple-100 to-blue-100">
      {/* Star Icon */}
      <div className="mx-auto mb-3 w-10 h-10 flex items-center justify-center rounded-lg bg-purple-50">
        <Star className="h-6 w-6 text-yellow-500" />
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800">Rate Our Support</h2>
      <p className="text-sm text-gray-600 mb-4">
        Help us improve our service
      </p>

      {/* Feedback Button */}
      <a
        href={feedbackLink}
        className="inline-block px-4 py-2 rounded-lg border border-purple-500 text-purple-600 font-medium hover:bg-purple-50 transition"
      >
        Give Feedback
      </a>
    </div>
  );
}
