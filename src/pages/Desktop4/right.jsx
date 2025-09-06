"use client"
import Image from "next/image";
import { useState } from "react"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Divider from "../../components/ui/Divider"
import SocialButton from "../../components/ui/SocialButton"

export default function RightPanel() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Welcome Back! 👋</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Today is a new day, it's your day, You shape it.
            <br />
            Sign in to start managing your projects
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Input
                type="email"
                placeholder="your email is here..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Input
                type="password"
                placeholder="At least 8 character..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-right mt-2">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot Password ?
              </a>
            </div>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            size="lg"
          >
            Login
          </Button>
        </form>

        <Divider />

        {/* Social Login Options */}
        <div className="space-y-3">
          <SocialButton
            icon={
              <Image
                src="/micro.png"
                alt="Zytexa Logo"
                width={20}   // bigger width
                height={15}  // bigger height

              />
            }
            text="Continue with Microsoft"
          />

          <SocialButton
            icon={
              <Image
                src="/google.png"
                alt="Zytexa Logo"
                width={20}   // bigger width
                height={15}  // bigger height

              />

            }
            text="Continue with Google"
          />

          <SocialButton
            icon={
              <Image
                src="/glogo.png"
                alt="Zytexa Logo"
                width={20}   // bigger width
                height={15}  // bigger height

              />
            }
            text="Continue with Email"
          />
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't you have an account?{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
