// DashboardLayout.jsx
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Profile from "./Profile";
import Header from "./Header";

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [showCreateEmployeeModal, setShowCreateEmployeeModal] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
        return;
    }
    
    const fetchProfiles = () => {
        axios.get("http://127.0.0.1:8000/users/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then(userRes => {
            setUser(userRes.data);
            return axios.get("http://127.0.0.1:8000/employees/me", {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
          })
          .then(empRes => {
            if(empRes) setEmployeeProfile(empRes.data);
          })
          .catch((error) => {
            console.error("Error fetching profiles:", error);
            setUser(null);
            setEmployeeProfile(null);
          });
    };

    fetchProfiles();
  }, []);


  // Role helpers
  const isAdmin = user?.role === "admin";
  const isSuperAdmin = user?.role === "super_admin";

  const handleManageEmployeesClick = () => {
    setShowEmployeeList(true);
  };

  const handleProfileUpdateSuccess = (updatedProfile) => {
    // Updates local state after employee self-edit success in Profile.jsx
    setEmployeeProfile(updatedProfile);
  };

  const handleEditImage = (avatarData) => {
    // Updates local state after employee self-avatar update success in Profile.jsx
    setEmployeeProfile(prev => ({ ...prev, avatar_url: avatarData }));
  };

  if(!user) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <>
      <Header
        isAdmin={isAdmin || isSuperAdmin}
        onManageEmployees={handleManageEmployeesClick}
      />
      <Profile
        user={employeeProfile || user}
        isAdmin={isAdmin}
        isSuperAdmin={isSuperAdmin}
        onEditProfile={handleProfileUpdateSuccess}
        onEditImage={handleEditImage}
        showEmployeeList={showEmployeeList}
        setShowEmployeeList={setShowEmployeeList}
        showCreateEmployeeModal={showCreateEmployeeModal}
        setShowCreateEmployeeModal={setShowCreateEmployeeModal}
      />
    </>
  );
}