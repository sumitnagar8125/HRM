"use client";

export default function TimeCards({ data = [] }) {
  // Ensure data is always an array
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-xl shadow-sm">
        No timecard data available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {data.map((card, idx) => (
        <div
          key={idx}
          className="bg-white shadow rounded-xl p-4 flex flex-col items-start"
        >
          {/* icon */}
          <div className={`mb-2 ${card?.color || ""}`}>
            {card?.icon ?? "🕒"}
          </div>

          {/* title */}
          <h3 className="text-lg font-semibold">
            {card?.title ?? "Untitled"}
          </h3>

          {/* main value */}
          <p className="text-xl font-bold">
            {card?.value ?? "N/A"}
          </p>

          {/* subtitle */}
          <p className="text-sm text-gray-500">
            {card?.subtitle ?? ""}
          </p>
        </div>
      ))}
    </div>
  );
}
