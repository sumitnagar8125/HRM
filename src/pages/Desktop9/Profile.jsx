import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const Avatar = ({ src, onClick, editable }) => (
  <div
    className={`rounded-full overflow-hidden w-16 h-16 bg-gray-200 flex items-center justify-center mr-4 relative ${
      editable ? "cursor-pointer hover:ring-2 hover:ring-blue-400" : ""
    }`}
    onClick={editable && onClick ? onClick : undefined}
    title={editable ? "Click to change photo" : ""}
  >
    <Image
      src={src && src !== "" ? src : "/logo.png"}
      width={64}
      height={64}
      alt="Avatar"
      style={{ objectFit: "cover" }}
    />
    {editable && (
      <>
        <span
          className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow"
          style={{ fontSize: 12 }}
        >
          <svg
            width="18"
            height="18"
            fill="#2563eb"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C13.1046 2 14 2.89543 14 4V5H17C18.1046 5 19 5.89543 19 7V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V7C5 5.89543 5.89543 5 7 5ZM7 7V18H17V7H15V9H9V7H7ZM10 7V5H14V7H10Z" />
          </svg>
        </span>
        <span
          className="absolute bottom-0 right-0 w-6 h-6 bg-gray-700 bg-opacity-70 rounded-full flex items-center justify-center cursor-pointer"
          style={{ transform: "translate(30%, 30%)" }}
          onClick={onClick}
          title="Change Profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            width={16}
            height={16}
          >
            <path d="M5 7h14v14H5z" opacity=".3" />
            <path d="M20 5h-3.586l-1.707-1.707A.996.996 0 0014 3H10c-.265 0-.52.105-.707.293L7.586 5H4c-1.1046 0-2 .8954-2 2v12c0 1.1046.8954 2 2 2h16c1.1046 0 2-.8954 2-2V7c0-1.1046-.8954-2-2-2zM20 19H4V7h4.414l1.293-1.293.293-.293h4.586l.293.293L15.586 7H20v12zM12 10c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z" />
            <circle cx="12" cy="13" r="1.5" />
          </svg>
        </span>
      </>
    )}
  </div>
);

export default function Profile({
  user,
  isAdmin,
  isPureAdmin,
  onEditProfile,
  onEditImage,
  showEmployeeList,
  setShowEmployeeList,
}) {
  const [editMode, setEditMode] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
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
    if (showEmployeeList) fetchEmployees();
  }, [showEmployeeList]);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
    } catch (error) {
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
    try {
      const res = await fetch("http://127.0.0.1:8000/employees/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
      setEditMode(false);
      setEditingEmployee(null);
      if (showEmployeeList) {
        fetchEmployees();
      } else if (onEditProfile) {
        onEditProfile(form);
      }
    } catch (error) {
      alert("Network error while updating profile.");
    }
  };

  if (isPureAdmin && showEmployeeList && !editMode) {
    return (
      <div className="flex justify-center items-start min-h-full">
        <div className="w-full max-w-2xl mx-auto rounded-xl mt-12 bg-white shadow-md">
          <h2 className="font-bold text-xl mb-4 text-center">All Employees</h2>
          <div
            style={{
              maxHeight: "60vh",
              overflowY: "auto",
              borderRadius: "1rem",
              border: "1px solid #e5e7eb",
            }}
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
                    <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25z" />
                    </svg>
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
    );
  }

  if (editMode) {
    return (
      <div className="flex justify-center items-start min-h-full">
        <form onSubmit={saveEdit} className="w-full max-w-lg rounded-xl mt-12 bg-white shadow space-y-6 p-6">
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
                onChange={(e) => field === "name" ? setForm({ ...form, [field]: e.target.value }) : null}
                className="border p-2 rounded w-full"
                readOnly={field !== "name"}
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 w-full py-2 rounded text-white">
              Save changes
            </button>
            <button type="button" className="border w-full py-2 rounded" onClick={() => { setEditMode(false); setEditingEmployee(null); }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (isPureAdmin) {
    return (
      <div className="flex flex-col items-center justify-center mt-16">
        <div className="bg-white rounded-xl shadow max-w-lg p-8 flex flex-col items-center">
          <Avatar src={form.avatar_url} onClick={handleAvatarClick} editable />
          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          <div className="mt-6 space-y-2">
            <div><strong>Admin Username:</strong> {user?.username || "Unknown"}</div>
            <div><strong>Role:</strong> {user?.role}</div>
          </div>
          <button className="mt-6 bg-blue-600 text-white py-2 rounded w-full" onClick={() => setEditMode(true)}>
            Edit profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <div className="bg-white rounded-xl shadow max-w-2xl w-full p-6 space-y-6">
        <Avatar src={form.avatar_url} onClick={handleAvatarClick} editable />
        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        <div>
          <p><strong>Name:</strong> {form.name}</p>
          <p><strong>Employee ID:</strong> {form.emp_code}</p>
          <p><strong>Email:</strong> {form.email}</p>
          <p><strong>Phone:</strong> {form.phone}</p>
        </div>
        <button className="bg-blue-600 text-white py-2 rounded w-full" onClick={() => setEditMode(true)}>
          Edit Profile
        </button>
      </div>
    </div>
  );
}
