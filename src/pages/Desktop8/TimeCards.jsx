"use client";
export default function TimeCards({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {data.map((card, idx) => (
        <div
          key={idx}
          className="bg-white shadow rounded-xl p-4 flex flex-col items-start"
        >
          <div className={`mb-2 ${card.color}`}>{card.icon}</div>
          <h3 className="text-lg font-semibold">{card.title}</h3>
          <p className="text-xl font-bold">{card.value}</p>
          <p className="text-sm text-gray-500">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
