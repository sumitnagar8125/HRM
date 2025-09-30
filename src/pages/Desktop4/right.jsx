"use client";
import Image from "next/image";
import { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Divider from "../../components/ui/Divider";
import SocialButton from "../../components/ui/SocialButton";

export default function RightPanel() {
  const [isLogin, setIsLogin] = useState(true);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState("employee"); // State for role

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

  // Handle Signup
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!signupUsername || !signupEmail || !signupPassword) {
      alert("Please enter valid username, email, and password");
      return;
    }

    console.log("Signup data sending role:", selectedRole); // Debug log

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupUsername,
          password: signupPassword,
          role: selectedRole, // Use the controlled state
          email: signupEmail,
          phone: signupPhone,
          avatar_url: "",
          emp_code: "",
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        alert("Signup failed: " + errData.detail);
        return;
      }

      alert("Signup successful! You can now login.");
      setEmail(signupEmail);
      setPassword(signupPassword);
      setIsLogin(true);
    } catch (error) {
      alert("Something went wrong during signup");
      console.error(error);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            {isLogin ? "Welcome Back! 👋" : "Create Account! ✨"}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {isLogin
              ? "Today is a new day, it's your day. Sign in to start managing your projects."
              : "Fill in your details below to create a new account."}
          </p>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="flex gap-4 mb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("employee")}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedRole === "employee"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    Employee
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("admin")}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedRole === "admin"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    Admin
                  </button>
                </div>
                <input
                  type="text"
                  value={selectedRole}
                  readOnly
                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <Input
                type="text"
                placeholder="Username"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Phone number"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
              />
            </>
          )}

          <Input
            type="text"
            placeholder="Email"
            value={isLogin ? email : signupEmail}
            onChange={(e) => (isLogin ? setEmail(e.target.value) : setSignupEmail(e.target.value))}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={isLogin ? password : signupPassword}
            onChange={(e) => (isLogin ? setPassword(e.target.value) : setSignupPassword(e.target.value))}
            required
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            size="lg"
          >
            {isLogin ? "Login" : "Sign Up"}
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
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
