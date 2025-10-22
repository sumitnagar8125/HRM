"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Divider from "../../components/ui/Divider";
import SocialButton from "../../components/ui/SocialButton";

export default function RightPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Automatically redirect if valid token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://127.0.0.1:8000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.ok) {
          window.location.href = "/home"; // or router.push("/home");
        }
      })
      .catch(() => {});
  }, []);

  // Handle Login
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

      const response = await fetch("http://127.0.0.1:8000/token", {
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

      const userResponse = await fetch("http://127.0.0.1:8000/users/me", {
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
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
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

        <div className="space-y-3">
          <SocialButton
            icon={<Image src="/micro.png" alt="Microsoft" width={20} height={15} />}
            text="Continue with Microsoft"
            onClick={() => alert("Microsoft login not implemented yet")}
          />
          <SocialButton
            icon={<Image src="/google.png" alt="Google" width={20} height={15} />}
            text="Continue with Google"
            onClick={() => alert("Google login not implemented yet")}
          />
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account? Contact your admin to create one.
        </p>
      </div>
    </div>
  );
}
