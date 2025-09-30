"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Profile from "./Profile";
import Header from "./header";

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [showCreateEmployeeModal, setShowCreateEmployeeModal] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    axios.get("http://127.0.0.1:8000/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then(userRes => {
      setUser(userRes.data);
      if(userRes.data.role === "employee") {
        return axios.get("http://127.0.0.1:8000/employees/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        setEmployeeProfile(null);
        return null;
      }
    })
    .then(empRes => {
      if(empRes) setEmployeeProfile(empRes.data);
    })
    .catch(() => {
      setUser(null);
      setEmployeeProfile(null);
    });
  }, []);

  const isAdmin = user?.role === "admin";

  const handleManageEmployeesClick = () => {
    setShowEmployeeList(true);
  };

  const handleEditProfile = async (updatedFields) => {
    if (!employeeProfile) return;
    const accessToken = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/employees/${employeeProfile.id}`,
        updatedFields,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setEmployeeProfile(response.data);
      alert("Profile updated successfully!");
    } catch {
      alert("Failed to update profile.");
    }
  };

  const handleEditImage = async (avatarData) => {
    if (!employeeProfile) return;
    const accessToken = localStorage.getItem("token");
    try {
      await axios.put(
        `http://127.0.0.1:8000/employees/me/avatar`,
        { avatar_data: avatarData },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setEmployeeProfile({ ...employeeProfile, avatar_url: avatarData });
      alert("Profile image updated!");
    } catch {
      alert("Failed to update profile image.");
    }
  };

  if(!user) return <div>Loading...</div>;

  return (
    <>
      <Header
        isAdmin={isAdmin}
        onManageEmployees={handleManageEmployeesClick}
      />
      <Profile
        user={user.role === "employee" ? employeeProfile : user}
        isAdmin={isAdmin}
        isPureAdmin={user.role === "admin"}
        onEditProfile={handleEditProfile}
        onEditImage={handleEditImage}
        showEmployeeList={showEmployeeList}
        setShowEmployeeList={setShowEmployeeList}
        showCreateEmployeeModal={showCreateEmployeeModal}
        setShowCreateEmployeeModal={setShowCreateEmployeeModal}
      />
    </>
  );
}
