"use client";

import React from "react";

export default function AboutSection() {
  return (
    <div className="space-y-4 w-full">
      {/* About Company Section */}
      <div className="border rounded-md bg-white shadow-sm p-4">
        <h2 className="text-blue-600 font-semibold mb-3">About Company</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission */}
          <div>
            <h3 className="text-green-600 font-medium mb-1">Mission</h3>
            <p className="text-gray-700 text-sm">
              Empowering businesses through innovative technology solutions and
              exceptional service delivery.
            </p>
          </div>

          {/* Culture */}
          <div>
            <h3 className="text-red-600 font-medium mb-1">Culture</h3>
            <p className="text-gray-700 text-sm">
              Innovation, Integrity, Excellence – Building tomorrow’s
              technology today.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information & Company Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Info */}
        <div className="border rounded-md bg-white shadow-sm p-4">
          <h3 className="text-blue-600 font-semibold mb-2">
            Contact Information
          </h3>
          <p className="text-sm">
  <span className="font-medium">Email:</span>{" "}
  <a
    href="mailto:hr@zytexa.com"
    className="text-blue-600 hover:underline"
  >
    hr@zytexa.com
  </a>
</p>

          <p className="text-sm">
            <span className="font-medium">Website:</span>{" "}
            <a
              href="https://www.xyzeta.com"
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              www.xyzeta.com
            </a>
          </p>
        </div>

        {/* Company Resources */}
        <div className="border rounded-md bg-white shadow-sm p-4">
          <h3 className="text-blue-600 font-semibold mb-2">
            Company Resources
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                HR Policies & Procedures
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Organizational Chart
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Employee Handbook (PDF)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
