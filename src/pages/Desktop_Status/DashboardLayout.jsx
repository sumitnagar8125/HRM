// components/DashboardLayout.jsx
'use client';
import React, { useEffect, useState } from 'react';
import Status from './Status';

const DashboardLayout = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // You can replace this with a real API call
    const mockData = [
      { id: 1, name: 'Shivam Agarwal', status: 'available' },
      { id: 2, name: 'Ravi Kumar', status: 'offline' },
      { id: 3, name: 'Anjali Mehta', status: 'onleave' },
      { id: 4, name: 'Karan Joshi', status: 'onbreak' },
      { id: 1, name: 'peru Agarwal', status: 'available' },
      { id: 2, name: 'kama Kumar', status: 'offline' },
      { id: 3, name: 'chavu Mehta', status: 'onleave' },
      { id: 4, name: 'hari Joshi', status: 'onbreak' },
      { id: 1, name: 'Shivam Agarwal', status: 'available' },
      { id: 2, name: 'pranav Kumar', status: 'offline' },
      { id: 3, name: 'om Mehta', status: 'onleave' },
      { id: 4, name: 'jay Joshi', status: 'onbreak' },
    ];

    setEmployees(mockData);
  }, []);

  return (
    <main className="flex-1 p-6 bg-gray-100">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Status Dashboard</h1>
        <p className="text-sm text-gray-600">Monitor current status of all employees</p>
      </header>

      {/* Status List */}
      <Status employees={employees} />
    </main>
  );
};

export default DashboardLayout;
