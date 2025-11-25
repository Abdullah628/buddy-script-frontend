"use client"

import { Bell, Mail, Home, Settings, Search } from "lucide-react"
import Image from "next/image"
import { me, logout } from "@/app/api/auth"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await me()
        if (res && res.success && res.data) {
          setUser(res.data)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Logo - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          <Image src="/logo.svg" alt="BuddyScript Logo" width={190} height={32} />
        </div>

        {/* Search Bar - Full width on mobile, constrained on desktop */}
        <div className="flex-1 md:flex-initial mx-0 md:mx-8 md:max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
          </div>
        </div>

        {/* Right Icons - Hidden on mobile except user */}
        <div className="hidden md:flex items-center gap-6 ml-6">
          <button onClick={() => router.push('/')} className="p-2 hover:bg-gray-100 rounded-full transition">
            <Home className="w-6 h-6 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
              2
            </span>
          </button>
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
            <Mail className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
              2
            </span>
          </button>
        </div>

        {/* User Dropdown - Always visible */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 md:gap-2 ml-2 md:ml-0 md:pl-3 pr-1 md:pr-2 py-1 hover:bg-gray-100 rounded-full transition"
          >
            <img 
              src={user?.avatarUrl || "/user-preview.png"} 
              alt="User" 
              className="w-8 h-8 rounded-full" 
            />
            <span className="hidden md:inline text-sm font-medium text-gray-900">
              {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
            </span>
            <svg className="hidden md:block w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => router.push(`/feed/${user._id}`)}
              >
                <Home className="w-4 h-4" />
                My Feed
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => setShowDropdown(false)}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                onClick={handleLogout}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
