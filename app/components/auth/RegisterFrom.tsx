"use client"

import type React from "react"

import { useState } from "react"
import { register } from "@/app/api/auth/register"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Chromium, Eye, EyeOff } from "lucide-react"

export default function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await register({ firstName, lastName, email, password })
      router.push("/feed")
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex justify-center items-center">
          <div className="relative w-full max-w-md">
            <Image
              src="/registration.png"
              alt="Registration illustration showing a person managing communication"
              width={800}
              height={800}
              priority
              className="w-full h-auto drop-shadow-lg"
            />
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 space-y-6">
            {/* Logo Section */}
            <div className="flex justify-center mb-2">
              <div className="text-blue-600 font-bold text-2xl">⚡ BuddyScript</div>
            </div>

            {/* Welcome Text */}
            <div className="text-center space-y-2">
              <p className="text-gray-600 text-sm font-medium">Get started</p>
              <h1 className="text-gray-900 text-3xl font-bold">Create your account</h1>
            </div>

            {/* Google Sign-up Button */}
            <button
              type="button"
              className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-colors duration-200 text-gray-700 font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <Chromium />
              </svg>
              <span> sign-up with google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm font-medium">Or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Name Input */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-gray-700 font-medium text-sm">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-gray-900"
                  required
                />
              </div>

              {/* Last Name Input */}
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-gray-700 font-medium text-sm">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-gray-900"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-gray-700 font-medium text-sm">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-gray-900"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-gray-700 font-medium text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-gray-900 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <label className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 text-blue-600 cursor-pointer accent-blue-600 mt-0.5"
                />
                <span className="text-gray-700 text-sm group-hover:text-gray-900">
                  I agree to the{" "}
                  <a href="#terms" className="text-blue-600 hover:text-blue-700 font-medium">
                    Terms & Conditions
                  </a>
                </span>
              </label>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mt-8"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
