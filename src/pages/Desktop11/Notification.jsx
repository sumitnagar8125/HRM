import React, { useState } from "react";
import LeaveCard from "./LeaveCard";
import LeaveDetailModal from "./LeaveDetailModal";

export default function Notification({ notifications, leaveStatus, allApplications, role, userId }) {
  const [tab, setTab] = useState("leaveStatus");
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const isAdmin = role === "admin" || role === "super_admin";

  const refresh = () => window.location.reload();

  let data = [];
  if (tab === "notifications") data = notifications;
  else if (tab === "leaveStatus") data = leaveStatus;
  else if (tab === "allApplications") data = allApplications;

  return (
    <>
      <div className="p-6 bg-white shadow rounded-lg">
        <div className="flex gap-4 mb-4 border-b">
          {isAdmin ? (
            <>
              <button
                className={`pb-2 ${tab === "notifications" ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-600"}`}
                onClick={() => setTab("notifications")}
              >
                Notifications
              </button>
              <button
                className={`pb-2 ${tab === "allApplications" ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-600"}`}
                onClick={() => setTab("allApplications")}
              >
                All Applications
              </button>
            </>
          ) : (
            <>
              {/* Employee tabs */}
              <button
                className={`pb-2 ${tab === "allApplications" ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-600"}`}
                onClick={() => setTab("allApplications")}
              >
                History
              </button>
              <button
                className={`pb-2 ${tab === "leaveStatus" ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-600"}`}
                onClick={() => setTab("leaveStatus")}
              >
                Leave Status
              </button>
            </>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto pr-2">
          {data.length === 0 ? (
            <p className="text-gray-600">No data found.</p>
          ) : (
            data.map((leave) => (
              <div
                key={leave.id}
                onClick={() => setSelectedLeaveId(leave.id)}
                className="cursor-pointer hover:bg-blue-50 rounded"
              >
                <LeaveCard leave={leave} />
              </div>
            ))
          )}
        </div>
      </div>
      {selectedLeaveId && (
        <LeaveDetailModal
          leaveId={selectedLeaveId}
          onClose={() => setSelectedLeaveId(null)}
          role={role}
          selfId={userId}
          refresh={refresh}
        />
      )}
    </>
  );
}
