// RightPanel.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Divider from "../../components/ui/Divider";

export default function RightPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.ok) {
          window.location.href = "/home";
        }
      })
      .catch(() => {});
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter a valid email or password");
      return;
    }
    try {
      const body = new URLSearchParams();
      body.append("grant_type", "password");
      body.append("username", email.trim());
      body.append("password", password.trim());

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!response.ok) {
        const err = await response.text();
        alert("Invalid credentials: " + err);
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);

      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      if (!userResponse.ok) {
        alert("Failed to fetch user info");
        return;
      }
      const userData = await userResponse.json();
      localStorage.setItem("employee_id", userData.employee_id || userData.id);
      window.location.href = "/home";
    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
            Welcome Back! 👋
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Today is a new day, it's your day. Sign in to start managing your projects.
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            type="text"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            size="lg"
          >
            Login
          </Button>
        </form>
        <Divider />
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account? Contact your admin to create one.
        </p>
      </div>
    </div>
  );
}
