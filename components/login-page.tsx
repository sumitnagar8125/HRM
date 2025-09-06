"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Hexagonal Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
          {/* Hexagonal pattern elements */}
          <g stroke="#22d3ee" strokeWidth="2" fill="none">
            {/* Top right hexagons */}
            <polygon points="650,20 680,40 680,80 650,100 620,80 620,40" />
            <polygon points="680,80 710,100 710,140 680,160 650,140 650,100" />
            <polygon points="710,140 740,160 740,200 710,220 680,200 680,160" />

            {/* Right side hexagons */}
            <polygon points="720,280 750,300 750,340 720,360 690,340 690,300" />
            <polygon points="750,340 780,360 780,400 750,420 720,400 720,360" />

            {/* Left side hexagons */}
            <polygon points="50,150 80,170 80,210 50,230 20,210 20,170" />
            <polygon points="80,210 110,230 110,270 80,290 50,270 50,230" />
            <polygon points="110,270 140,290 140,330 110,350 80,330 80,290" />

            {/* Bottom hexagons */}
            <polygon points="200,450 230,470 230,510 200,530 170,510 170,470" />
            <polygon points="230,510 260,530 260,570 230,590 200,570 200,530" />

            {/* Additional scattered hexagons */}
            <polygon points="350,100 380,120 380,160 350,180 320,160 320,120" />
            <polygon points="500,50 530,70 530,110 500,130 470,110 470,70" />
            <polygon points="150,380 180,400 180,440 150,460 120,440 120,400" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Panel */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <svg viewBox="0 0 60 60" className="w-full h-full">
                  <polygon points="15,45 30,15 45,45" fill="#3b82f6" className="opacity-80" />
                  <polygon points="20,35 35,20 50,35" fill="#22d3ee" className="opacity-90" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-blue-600 mb-1">ZYTEXA</h1>
              <p className="text-blue-500 text-sm font-medium">Technology</p>
            </div>

            {/* Role Selection Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium" size="lg">
                Admin
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium" size="lg">
                Employee
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            {/* Welcome Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back! 👋</h2>
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium text-base"
                size="lg"
              >
                Login
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Social Login Options */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full py-3 border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-3 bg-transparent"
                size="lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#00A4EF" d="M0 0h11.377v11.372H0z" />
                  <path fill="#FFB900" d="M12.623 0H24v11.372H12.623z" />
                  <path fill="#1BA1E2" d="M0 12.628h11.377V24H0z" />
                  <path fill="#00BCF2" d="M12.623 12.628H24V24H12.623z" />
                </svg>
                <span className="text-gray-700">Continue with Microsoft</span>
              </Button>

              <Button
                variant="outline"
                className="w-full py-3 border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-3 bg-transparent"
                size="lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-gray-700">Continue with Google</span>
              </Button>

              <Button
                variant="outline"
                className="w-full py-3 border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-3 bg-transparent"
                size="lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                <span className="text-gray-700">Continue with Email</span>
              </Button>
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
      </div>
    </div>
  )
}
