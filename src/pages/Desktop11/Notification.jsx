import React, { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";

const Notification = ({ notifications, messages }) => {
  const [activeTab, setActiveTab] = useState("notifications");

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b">
        <button
          className={`pb-2 ${
            activeTab === "notifications"
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
        <button
          className={`pb-2 ${
            activeTab === "messages"
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </button>
      </div>

      {/* Scrollable Section */}
      <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
        {activeTab === "notifications" &&
          notifications.map((note) => (
            <div
              key={note.id}
              className="flex justify-between items-start p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="flex items-start gap-3">
                <FaExclamationCircle className="text-yellow-500 mt-1" size={18} />
                <div>
                  <h4 className="font-semibold text-gray-800">{note.title}</h4>
                  <p className="text-gray-600 text-sm">{note.message}</p>

                  {/* Action buttons */}
                  <div className="mt-2 flex gap-2">
                    <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600">
                      Approve
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                      Review
                    </button>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500">{note.time}</span>
            </div>
          ))}

        {activeTab === "messages" &&
          messages.map((msg) => (
            <div
              key={msg.id}
              className="flex justify-between items-start p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <div>
                <h4 className="font-semibold text-gray-800">{msg.from}</h4>
                <p className="text-gray-600 text-sm">{msg.message}</p>
              </div>
              <span className="text-xs text-gray-500">{msg.time}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Notification;
