import React from "react";
import Header from "./Header";
import Notification from "./Notification";

const DashboardLayout = () => {
  // Dummy data (replace with API calls later)
  const notifications = [
    {
      id: 1,
      title: "Pending Leave Approval",
      message: "Sarah vacation leave request requires your approval (Dec 15–22, 2025)",
      time: "2h ago",
    },
    {
      id: 2,
      title: "New Timesheet Submitted",
      message: "Mike submitted his timesheet for review.",
      time: "4h ago",
    },
    {
      id: 3,
      title: "Policy Update",
      message: "Company holiday policy has been updated. Please review.",
      time: "1d ago",
    },
     {
      id: 1,
      title: "Pending Leave Approval",
      message: "Sarah vacation leave request requires your approval (Dec 15–22, 2025)",
      time: "2h ago",
    },
    {
      id: 2,
      title: "New Timesheet Submitted",
      message: "Mike submitted his timesheet for review.",
      time: "4h ago",
    },
    {
      id: 3,
      title: "Policy Update",
      message: "Company holiday policy has been updated. Please review.",
      time: "1d ago",
    },
     {
      id: 1,
      title: "Pending Leave Approval",
      message: "Sarah vacation leave request requires your approval (Dec 15–22, 2025)",
      time: "2h ago",
    },
    {
      id: 2,
      title: "New Timesheet Submitted",
      message: "Mike submitted his timesheet for review.",
      time: "4h ago",
    },
    {
      id: 3,
      title: "Policy Update",
      message: "Company holiday policy has been updated. Please review.",
      time: "1d ago",
    },
  ];

  const messages = [
    {
      id: 1,
      from: "HR Admin",
      message: "Please update your profile details before the end of the week.",
      time: "1d ago",
    },
    {
      id: 2,
      from: "Team Lead",
      message: "Project meeting rescheduled to 3 PM tomorrow.",
      time: "3d ago",
    },
    {
      id: 3,
      from: "CEO",
      message: "Great work on the last sprint team! Keep it up.",
      time: "5d ago",
    },
    {
      id: 1,
      from: "HR Admin",
      message: "Please update your profile details before the end of the week.",
      time: "1d ago",
    },
    {
      id: 2,
      from: "Team Lead",
      message: "Project meeting rescheduled to 3 PM tomorrow.",
      time: "3d ago",
    },
    {
      id: 3,
      from: "CEO",
      message: "Great work on the last sprint team! Keep it up.",
      time: "5d ago",
    },
    {
      id: 1,
      from: "HR Admin",
      message: "Please update your profile details before the end of the week.",
      time: "1d ago",
    },
    {
      id: 2,
      from: "Team Lead",
      message: "Project meeting rescheduled to 3 PM tomorrow.",
      time: "3d ago",
    },
    {
      id: 3,
      from: "CEO",
      message: "Great work on the last sprint team! Keep it up.",
      time: "5d ago",
    },
  ];

  return (
    <div className="flex-1">
      <Header />
      <main className="p-6">
        {/* Pass dummy data to Notification */}
        <Notification notifications={notifications} messages={messages} />
      </main>
    </div>
  );
};

export default DashboardLayout;
