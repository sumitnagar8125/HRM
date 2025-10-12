import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const Avatar = ({ src, onClick, editable }) => (
  <div
    className={`rounded-full overflow-hidden w-20 h-20 bg-gray-200 flex items-center justify-center ${
      editable ? "cursor-pointer hover:ring-2 hover:ring-blue-400" : ""
    } relative mb-4`}
    onClick={editable && onClick ? onClick : undefined}
    title={editable ? "Click to change photo" : ""}
  >
    <Image
      src={src && src !== "" ? src : "/logo.png"}
      width={80}
      height={80}
      alt="Avatar"
      style={{ objectFit: "cover" }}
    />
    {editable && (
      <span
        className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow"
        style={{ fontSize: 12 }}
      >
        <svg width="18" height="18" fill="#2563eb" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C13.1046 2 14 2.89543 14 4V5H17C18.1046 5 19 5.89543 19 7V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V7C5 5.89543 5.89543 5 7 5ZM7 7V18H17V7H15V9H9V7H7ZM10 7V5H14V7H10Z" />
        </svg>
      </span>
    )}
  </div>
);

export default function Profile({
  user,
  isAdmin,
  isSuperAdmin,
  onEditProfile,
  onEditImage,
  showEmployeeList,
  setShowEmployeeList,
  showCreateEmployeeModal,
  setShowCreateEmployeeModal,
}) {
  const [editMode, setEditMode] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    username: "",
    password: "",
    role: "employee",
    name: "",
    email: "",
    phone: "",
    avatar_url: "",
    emp_code: "",
  });
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    emp_code: user?.emp_code || "",
    avatar_url: user?.avatar_url || "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        emp_code: user.emp_code || "",
        avatar_url: user.avatar_url || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (showEmployeeList && (isAdmin || isSuperAdmin)) fetchEmployees();
  }, [showEmployeeList, isAdmin, isSuperAdmin]);

  const resetNewEmployeeForm = () => {
    setNewEmployee({
      username: "",
      password: "",
      role: "employee",
      name: "",
      email: "",
      phone: "",
      avatar_url: "",
      emp_code: "",
    });
  };

  const openCreateEmployeeModal = () => {
    resetNewEmployeeForm();
    setShowCreateEmployeeModal(true);
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const updateAvatarOnServer = async (base64Image) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/employees/me/avatar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar_data: base64Image }),
      });
      if (!res.ok) {
        const err = await res.text();
        alert(`Failed to update avatar: ${err}`);
        return;
      }
      alert("Profile picture updated successfully.");
      setForm((f) => ({ ...f, avatar_url: base64Image }));
      if (onEditImage) onEditImage(base64Image);
    } catch {
      alert("Network error while updating avatar.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const base64Image = evt.target.result;
      await updateAvatarOnServer(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in");
      setEmployeeList([]);
      return;
    }
    try {
      const res = await fetch("http://127.0.0.1:8000/employees/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.text();
        alert(`Failed to load employees: ${err}`);
        setEmployeeList([]);
        return;
      }
      const data = await res.json();
      setEmployeeList(data);
    } catch {
      setEmployeeList([]);
      alert("Failed to load employees due to network error.");
    }
  };

  const startEditEmployee = (emp) => {
    setEditingEmployee(emp);
    setForm({
      name: emp.name || "",
      phone: emp.phone || "",
      email: emp.email || "",
      emp_code: emp.emp_code || "",
      avatar_url: emp.avatar_url || "",
    });
    setEditMode(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to update profile.");
      return;
    }
    const idToUpdate = editingEmployee ? editingEmployee.id : user.id;
    try {
      const res = await fetch(`http://127.0.0.1:8000/employees/${idToUpdate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: form.name }),
      });
      if (!res.ok) {
        const err = await res.text();
        alert(`Failed to update profile: ${err}`);
        return;
      }
      alert("Profile updated successfully.");
      if (editingEmployee) {
        setForm({
          name: user?.name || "",
          phone: user?.phone || "",
          email: user?.email || "",
          emp_code: user?.emp_code || "",
          avatar_url: user?.avatar_url || "",
        });
      }
      setEditMode(false);
      setEditingEmployee(null);
      if (showEmployeeList) {
        fetchEmployees();
      } else if (onEditProfile) {
        onEditProfile(form);
      }
    } catch {
      alert("Network error while updating profile.");
    }
  };

  const cancelEdit = () => {
    if (editingEmployee) {
      setForm({
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        emp_code: user?.emp_code || "",
        avatar_url: user?.avatar_url || "",
      });
    }
    setEditMode(false);
    setEditingEmployee(null);
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in");
      return;
    }
    try {
      const user_data = {
        username: newEmployee.username,
        password: newEmployee.password,
        role: newEmployee.role,
        email: newEmployee.email,
        phone: newEmployee.phone,
        avatar_url: newEmployee.avatar_url,
        emp_code: newEmployee.emp_code,
      };
      const employee_data = {
        name: newEmployee.name || newEmployee.username,
        user_id: 0,
        email: newEmployee.email,
        phone: newEmployee.phone,
        avatar_url: newEmployee.avatar_url,
        emp_code: newEmployee.emp_code,
      };
      const res = await fetch("http://127.0.0.1:8000/admin/create-user-employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_data, employee_data }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert("Error: " + (data.detail || "Unknown error"));
        return;
      }
      alert("Employee created");
      setShowCreateEmployeeModal(false);
      fetchEmployees();
    } catch {
      alert("Network error");
    }
  };

  return (
    <>
      {showCreateEmployeeModal && (isAdmin || isSuperAdmin) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Create Employee</h2>
            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    value={newEmployee.username}
                    onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Role</label>
                  <select
                    required
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Phone</label>
                  <input
                    type="text"
                    placeholder="Phone"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Employee Code</label>
                  <input
                    type="text"
                    placeholder="Employee Code"
                    value={newEmployee.emp_code}
                    onChange={(e) => setNewEmployee({ ...newEmployee, emp_code: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-5 py-2 rounded hover:bg-gray-400 transition"
                  onClick={() => setShowCreateEmployeeModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-semibold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEmployeeList && (isAdmin || isSuperAdmin) && !editMode ? (
        <div className="flex justify-center items-start min-h-full">
          <div className="w-full max-w-2xl mx-auto rounded-xl mt-12 bg-white shadow-md relative">
            <div className="flex items-center justify-between px-6 pt-6">
              <h2 className="font-bold text-xl text-blue-800">All Employees</h2>
              <button
                className="bg-blue-600 text-white font-semibold rounded px-4 py-2 shadow hover:bg-blue-700 transition"
                onClick={openCreateEmployeeModal}
              >
                + Create Employee
              </button>
            </div>
            <div
              style={{
                maxHeight: "60vh",
                overflowY: "auto",
                borderRadius: "1rem",
                border: "1px solid #e5e7eb",
              }}
              className="mt-3"
            >
              {employeeList.length ? (
                employeeList.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center px-4 py-3 hover:bg-gray-50"
                  >
                    <Avatar src={emp.avatar_url} />
                    <div className="flex-auto">
                      <div className="font-semibold">{emp.name || "No Name"}</div>
                      <div className="text-gray-500 text-sm">{emp.email || "No email"}</div>
                      <div className="text-gray-400 text-xs">{emp.phone || ""}</div>
                    </div>
                    <button
                      className="ml-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                      onClick={() => startEditEmployee(emp)}
                      title="Edit"
                    >
                      Edit
                    </button>
                  </div>
                ))
              ) : (
                <p className="p-4 text-gray-500 text-center">No employees found.</p>
              )}
            </div>
            <button
              className="mt-6 w-full border text-gray-500 rounded py-2"
              onClick={() => setShowEmployeeList(false)}
            >
              Back to profile
            </button>
          </div>
        </div>
      ) : editMode ? (
        <div className="flex justify-center items-start min-h-full">
          <form
            onSubmit={saveEdit}
            className="w-full max-w-lg mt-12 bg-white rounded-xl shadow p-6 space-y-6"
          >
            <div className="flex items-center justify-center relative">
              <Avatar src={form.avatar_url} onClick={handleAvatarClick} editable />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {["name", "email", "phone", "emp_code"].map((field) => (
              <div key={field}>
                <label className="font-bold capitalize">{field.replace("_", " ")}</label>
                <input
                  type={field === "email" ? "email" : "text"}
                  value={form[field]}
                  onChange={
                    field === "name"
                      ? (e) => setForm({ ...form, [field]: e.target.value })
                      : undefined
                  }
                  className="border p-2 rounded w-full"
                  readOnly={field !== "name"}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 w-full py-2 rounded text-white">
                Save changes
              </button>
              <button type="button" className="border w-full py-2 rounded" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-16">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl shadow-lg max-w-lg w-full px-8 py-8 flex flex-col items-center">
            <Avatar
              src={form.avatar_url}
              onClick={handleAvatarClick}
              editable
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="mt-4 text-center space-y-1 w-full">
              <h2 className="text-xl font-bold text-blue-800 mb-1">{form.name}</h2>
              <div className="text-gray-700"><b>Employee ID:</b> <span className="font-medium">{form.emp_code}</span></div>
              <div className="text-gray-700"><b>Email:</b> <span className="font-medium">{form.email}</span></div>
              <div className="text-gray-700"><b>Phone:</b> <span className="font-medium">{form.phone}</span></div>
            </div>
            <button
              className="w-full bg-blue-600 mt-7 text-white py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
}
