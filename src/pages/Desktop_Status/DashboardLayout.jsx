import React from "react";
import Status from "./Status";

const dummyEmployees = [
  { id: 1, name: 'Shivam Agarwal', status: 'available' },
  { id: 2, name: 'Ravi Kumar', status: 'offline' },
  { id: 3, name: 'Anjali Mehta', status: 'onleave' },
  { id: 4, name: 'Karan Joshi', status: 'onbreak' },
  { id: 5, name: 'Peru Agarwal', status: 'available' }
];

function DashboardLayout() {
  return (
    <div style={{ padding: "28px" }}>
      <h2 style={{
        fontWeight: "700",
        fontSize: "1.5rem",
        marginBottom: "18px",
        letterSpacing: ".5px",
      }}>
        Employee Status Dashboard
      </h2>
      <Status employees={dummyEmployees} />
    </div>
  );
}

export default DashboardLayout;
