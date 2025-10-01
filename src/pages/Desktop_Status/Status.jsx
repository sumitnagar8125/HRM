// components/Status.jsx
import React, { useState } from 'react';

const Status = ({ employees }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter employees by name
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Scrollable employee list */}
      <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white shadow-md rounded-lg px-6 py-4 flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">{employee.name}</p>
                <p className="text-sm text-gray-500">ID: {employee.id}</p>
              </div>
              <div>
                <span
                  className={`px-4 py-1 rounded-full text-white text-sm font-medium ${
                    employee.status === 'available'
                      ? 'bg-green-500'
                      : employee.status === 'offline'
                      ? 'bg-red-500'
                      : employee.status === 'onleave'
                      ? 'bg-blue-500'
                      : employee.status === 'onbreak'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-500'
                  }`}
                >
                  {employee.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No employees found.</p>
        )}
      </div>
    </div>
  );
};

export default Status;
