import React, { useState } from "react";

// Styles
const cardStyles = {
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  padding: "16px",
  marginBottom: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const sectionStyles = {
  height: "375px",
  overflowY: "auto",
  border: "1px solid #eef1f6",
  background: "#f6f8fa",
  margin: "0 12px 0 0",
  padding: "18px",
  borderRadius: "12px",
  width: "32%",
};

const headingStyles = {
  marginBottom: "20px",
  fontWeight: "600",
  fontSize: "1.2rem",
};

function Status({ employees }) {
  const [search, setSearch] = useState("");

  // Filter by search query
  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const active = filtered.filter(emp => emp.status === 'available');
  const onBreak = filtered.filter(emp => emp.status === 'onbreak');
  const out = filtered.filter(emp => emp.status === 'offline' || emp.status === 'onleave');

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search employee by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "320px",
            padding: "10px",
            fontSize: "1rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            boxShadow: "0 1px 4px #eee",
            outline: "none",
          }}
        />
      </div>
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Active Section */}
        <div style={sectionStyles}>
          <div style={headingStyles}>Active</div>
          {active.length === 0 && <div>No active employees found.</div>}
          {active.map(emp => (
            <div key={emp.id} style={cardStyles}>
              <div>
                <span style={{ fontWeight: "bold" }}>{emp.name}</span>
                <span style={{ color: "#47cf73", marginLeft: "8px", fontWeight: "500" }}>({emp.status})</span>
              </div>
            </div>
          ))}
        </div>
        {/* Break Section */}
        <div style={sectionStyles}>
          <div style={headingStyles}>On Break</div>
          {onBreak.length === 0 && <div>No employees on break.</div>}
          {onBreak.map(emp => (
            <div key={emp.id} style={cardStyles}>
              <div>
                <span style={{ fontWeight: "bold" }}>{emp.name}</span>
                <span style={{ color: "#ffd700", marginLeft: "8px", fontWeight: "500" }}>({emp.status})</span>
              </div>
            </div>
          ))}
        </div>
        {/* Out Section */}
        <div style={sectionStyles}>
          <div style={headingStyles}>Out</div>
          {out.length === 0 && <div>No employees out.</div>}
          {out.map(emp => (
            <div key={emp.id} style={cardStyles}>
              <div>
                <span style={{ fontWeight: "bold" }}>{emp.name}</span>
                <span style={{
                  color: emp.status === "offline" ? "#ff4545" : "#8a58db",
                  marginLeft: "8px",
                  fontWeight: "500"
                }}>
                  ({emp.status})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Status;
