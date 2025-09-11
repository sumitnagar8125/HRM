"use client";

export default function Contact({ hours, contact }) {
  return (
    <div className="border rounded-lg shadow-sm bg-white p-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Support Hours & Contact Info
      </h2>
      <div className="space-y-2 text-sm text-gray-700">
        {/* Weekdays */}
        <p>
          <span className="font-semibold">Monday - Friday:</span>{" "}
          {hours.weekdays}
        </p>

        {/* Saturday */}
        <p>
          <span className="font-semibold">Saturday:</span> {hours.saturday}
        </p>

        {/* Contact */}
        <p>
          <span className="font-semibold">Contact:</span> {contact.email} |{" "}
          {contact.phone}
        </p>
      </div>
    </div>
  );
}
