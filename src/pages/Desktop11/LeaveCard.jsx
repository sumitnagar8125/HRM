import {
  FaPlaneDeparture, FaHeartbeat, FaBriefcase, FaQuestion
} from "react-icons/fa";
import { MdWork, MdPerson, MdErrorOutline } from "react-icons/md";

const leaveTypeIcon = (type) => {
  switch ((type || "").toLowerCase()) {
    case "vacation":
      return <FaPlaneDeparture className="text-sky-400" size={26} />;
    case "sick":
    case "medical":
      return <FaHeartbeat className="text-rose-400" size={26} />;
    case "personal":
      return <MdPerson className="text-purple-400" size={26} />;
    case "emergency":
      return <MdErrorOutline className="text-red-500" size={26} />;
    case "maternity":
      return <MdWork className="text-green-500" size={26} />;
    case "paternity":
      return <FaBriefcase className="text-indigo-400" size={26} />;
    default:
      return <FaQuestion className="text-slate-400" size={26} />;
  }
};

const prettyDate = (iso) => {
  try {
    return iso
      ? new Date(iso).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })
      : "N/A";
  } catch {
    return "N/A";
  }
};

const statusClass = (status) =>
  status === "approved"
    ? "bg-green-100 text-green-700"
    : status === "pending"
    ? "bg-yellow-100 text-yellow-700"
    : "bg-red-100 text-red-600";

export default function LeaveCard({ leave }) {
  return (
    <div className="flex items-center gap-5 bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 mb-4 shadow border border-sky-100 relative group">
      <div className="shrink-0">{leaveTypeIcon(leave.type)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-lg font-bold text-sky-900 uppercase">{leave.type || "Leave"}</span>
          <span className="text-sm text-sky-700 font-semibold">
            {prettyDate(leave.start_date)} &rarr; {prettyDate(leave.end_date)}
          </span>
        </div>
        {leave.employee_id && (
          <div className="text-xs font-semibold text-blue-900 mb-1">
            Employee #{leave.employee_id}
          </div>
        )}
        <div className="text-gray-700">{leave.reason ? <span className="text-xs italic">Reason: {leave.reason}</span> : null}</div>
      </div>
      <div className="ml-2 flex flex-col items-end gap-2">
        <span className={`rounded-full px-4 py-1 uppercase text-xs tracking-wider font-bold ${statusClass(leave.status)}`}>
          {leave.status}
        </span>
      </div>
    </div>
  );
}
