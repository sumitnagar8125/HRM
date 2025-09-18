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
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("employee");

  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter a valid email or password");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        alert("Invalid credentials");
        return;
      }

      const responseBody = await response.json();
      console.log("Login success:", responseBody);

      // Save token
      localStorage.setItem("token", responseBody.access_token);

      // Fetch user details for employee_id
      const userResponse = await fetch("http://127.0.0.1:8000/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${responseBody.access_token}`,
        },
      });

      if (!userResponse.ok) {
        alert("Failed to fetch user info");
        return;
      }

      const userData = await userResponse.json();
      console.log("User info:", userData);

      // Save employee_id (adjust key based on backend response)
      localStorage.setItem("employee_id", userData.employee_id || userData.id);

      // Redirect to home
      window.location.href = "/home";
    } catch (err) {
      console.error("Login error", err);
      alert("Something went wrong");
    }
  };

  // ✅ Handle Signup
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword) {
      alert("Please enter a valid email and password");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupEmail,
          password: signupPassword,
          role: signupRole,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        alert("Signup failed: " + errData.detail);
        return;
      }

      const user = await response.json();
      console.log("Signup successful:", user);
      alert("Signup successful! You can now login.");

      setEmail(signupEmail);
      setPassword(signupPassword);
      setIsLogin(true);
    } catch (err) {
      console.error("Signup error", err);
      alert("Something went wrong during signup");
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

        {/* Form */}
        <form
          onSubmit={isLogin ? handleLogin : handleSignUp}
          className="space-y-6"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email..."
                value={isLogin ? email : signupEmail}
                onChange={(e) =>
                  isLogin
                    ? setEmail(e.target.value)
                    : setSignupEmail(e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type="password"
                placeholder="At least 6 characters..."
                value={isLogin ? password : signupPassword}
                onChange={(e) =>
                  isLogin
                    ? setPassword(e.target.value)
                    : setSignupPassword(e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            size="lg"
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        <Divider />

        {/* Social login buttons */}
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

        {/* Toggle login/signup */}
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
