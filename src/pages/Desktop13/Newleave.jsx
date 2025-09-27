"use client";

import React, { useState } from "react";
import { Calendar, ClipboardList, Image, AlignLeft } from "lucide-react";

export default function Newleave() {
  const [formData, setFormData] = useState({
      "start_date": "",
      "end_date": "",
      "leave_type": "",
      "reason": ""
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // checks

    const payload = {
      ...formData,
      employee_id: ""
    }

    const response = await fetch("/leaves", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        // ""
      }
    })
  }
  return (
    <div className="p-6 w-full">
      <div className="bg-white rounded-xl shadow-md p-6 border">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Policy */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ClipboardList size={18} />
              Select a Policy
            </label>
            <select className="mt-2 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none">
              <option value="">Select a Policy</option>
              <option value="Sick">Sick Leave</option>
              <option value="Casual">Casual Leave</option>
              <option value="Earned">Earned Leave</option>
            </select>
          </div>

          {/* Full day / Half day */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar size={18} />
              Full day
            </label>
            <select className="mt-2 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none">
              <option value="">Select</option>
              <option value="full">Full Day</option>
              <option value="half">Half Day</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Start date
              </label>
              <input
                type="date"
                className="mt-2 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                End date
              </label>
              <input
                type="date"
                className="mt-2 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <AlignLeft size={18} />
              Add a reason or note
            </label>
            <textarea
              placeholder="Write your reason here..."
              rows={3}
              className="mt-2 w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            />
          </div>

          {/* Upload File */}
          <div>
            <label
              htmlFor="fileUpload"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <Image size={18} />
              Photo
            </label>

            {/* Upload Zone */}
            <label
              htmlFor="fileUpload"
              className="mt-2 block border-dashed border-2 border-gray-300 rounded-lg p-6 text-center text-gray-500 cursor-pointer hover:border-purple-400"
            >
              <p className="text-sm">Tap to upload file</p>
              <input
                id="fileUpload"
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    alert(`Selected: ${e.target.files[0].name}`);
                  }
                }}
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Request
          </button>
        </form>
      </div>
    </div>
  );
}
