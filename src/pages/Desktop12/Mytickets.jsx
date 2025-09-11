"use client";

import Link from "next/link";
import { MessageCircleQuestion, Ticket } from "lucide-react";

export default function MyTickets({ faqLink, ticketsLink }) {
  return (
    <div className="border border-blue-300 rounded-xl shadow-sm p-5 bg-white">
      {/* Heading */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Support Resources
      </h2>

      <div className="space-y-3">
        {/* FAQs */}
        <Link
          href={faqLink}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
        >
          <div className="bg-red-100 text-red-600 p-2 rounded-lg">
            <MessageCircleQuestion className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-gray-700">
            FAQs – Common Questions & Answers
          </p>
        </Link>

        {/* My Tickets */}
        <Link
          href={ticketsLink}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
        >
          <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
            <Ticket className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-gray-700">
            My Tickets – View Your Query History
          </p>
        </Link>
      </div>
    </div>
  );
}
