import React, { useState } from "react";

const cardStyles = {
  background: "#ffffff",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  padding: "16px",
  marginBottom: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  transition: "transform 0.2s ease-in-out",
};
const sectionStyles = {
  height: "400px",
  overflowY: "auto",
  border: "1px solid #e0e7ff",
  background: " #F0F8FF",
  margin: "0 14px 0 0",
  padding: "22px",
  borderRadius: "16px",
  width: "32%",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};
const headingStyles = {
  marginBottom: "24px",
  fontWeight: "700",
  fontSize: "1.4rem",
  color: "#1e40af",
  borderBottom: "2px solid #3b82f6",
  paddingBottom: "8px",
};
const statusTextStyles = {
  available: { color: "#16a34a", fontWeight: "600" },
  active: { color: "#0ea5e9", fontWeight: "600" },
  break: { color: "#ca8a04", fontWeight: "600" },
  onbreak: { color: "#ca8a04", fontWeight: "600" },
  ended: { color: "#ef4444", fontWeight: "600" },
  offline: { color: "#b91c1c", fontWeight: "600" },
  onleave: { color: "#7c3aed", fontWeight: "600" },
};
const inputStyles = {
  width: "340px",
  padding: "12px",
  fontSize: "1.1rem",
  border: "1.5px solid #cbd5e1",
  borderRadius: "8px",
  boxShadow: "0 2px 6px #d1d5db",
  outline: "none",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

function Status({ employees = [] }) {
  const [search, setSearch] = useState("");

  // Defensive fallback to empty array
  const safeEmployees = Array.isArray(employees) ? employees : [];

  // Filter on search by name or username
  const filtered = safeEmployees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.username?.toLowerCase().includes(search.toLowerCase())
  );

  // Categorize employees for UI
  const out = filtered.filter(
    (emp) => emp.currentStatus === "ended" || emp.clockInTime === null
  );
  const active = filtered.filter((emp) => emp.currentStatus === "active");
  const onBreak = filtered.filter(
    (emp) => emp.currentStatus === "break" || emp.currentStatus === "onbreak"
  );

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <input
          type="text"
          placeholder="Search employee by name or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyles}
        />
      </div>
      <div style={{ display: "flex", gap: "24px" }}>
        {/* Active Section */}
        <div style={sectionStyles}>
          <div style={headingStyles}>Active</div>
          {active.length === 0 ? (
            <div style={{ fontStyle: "italic", color: "#64748b" }}>
              No active employees found.
            </div>
          ) : (
            active.map((emp) => (
              <div
                key={emp.id}
                style={cardStyles}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div>
                  <span style={{ fontWeight: "700", fontSize: "1.05rem" }}>{emp.name}</span>{" "}
                  <span style={statusTextStyles[emp.currentStatus] || {}}>
                    {`(${emp.currentStatus})`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* On Break Section */}
        <div style={sectionStyles}>
          <div style={headingStyles}>On Break</div>
          {onBreak.length === 0 ? (
            <div style={{ fontStyle: "italic", color: "#64748b" }}>No employees on break.</div>
          ) : (
            onBreak.map((emp) => (
              <div
                key={emp.id}
                style={cardStyles}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div>
                  <span style={{ fontWeight: "700", fontSize: "1.05rem" }}>{emp.name}</span>{" "}
                  <span style={statusTextStyles[emp.currentStatus] || {}}>
                    {`(${emp.currentStatus})`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Out Section */}
        <div style={sectionStyles}>
          <div style={headingStyles}>Out</div>
          {out.length === 0 ? (
            <div style={{ fontStyle: "italic", color: "#64748b" }}>No employees out.</div>
          ) : (
            out.map((emp) => (
              <div
                key={emp.id}
                style={cardStyles}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div>
                  <span style={{ fontWeight: "700", fontSize: "1.05rem" }}>{emp.name}</span>{" "}
                  <span style={statusTextStyles[emp.currentStatus] || {}}>
                    {`(${emp.currentStatus})`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Status;
