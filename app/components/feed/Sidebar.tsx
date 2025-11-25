"use client"

import type React from "react"

import { Play, BarChart3, Users, Bookmark, Users2, Gamepad2, Settings, Save } from "lucide-react"
import { url } from "inspector"

interface SidebarItem {
  icon: React.ReactNode
  label: string
  badge?: string
}

const menuItems: SidebarItem[] = [
  { icon: <Play className="w-5 h-5" />, label: "Learning", badge: "New" },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Insights" },
  { icon: <Users className="w-5 h-5" />, label: "Find friends" },
  { icon: <Bookmark className="w-5 h-5" />, label: "Bookmarks" },
  { icon: <Users2 className="w-5 h-5" />, label: "Group" },
  { icon: <Gamepad2 className="w-5 h-5" />, label: "Gaming", badge: "New" },
  { icon: <Settings className="w-5 h-5" />, label: "Settings" },
  { icon: <Save className="w-5 h-5" />, label: "Save post" },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 h-[calc(100vh-72px)] overflow-y-auto">
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Explore</h3>
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className="w-full flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition group"
          >
            <span className="text-gray-600 group-hover:text-gray-900">{item.icon}</span>
            <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
            {item.badge && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Suggested People */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Suggested People</h3>
          <button className="text-blue-600 text-sm font-semibold hover:underline">See All</button>
        </div>

        <div className="space-y-4">
          {[
            { name: "Mark Paule", url: "/img1.png", role: "CEO of Apple" },
            { name: "Ryan Roslansky", role: "CEO of Linkedin" },
          ].map((person, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={person.url || "/user-preview.png"}
                  alt={person.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{person.name}</p>
                  <p className="text-xs text-gray-500">{person.role}</p>
                </div>
              </div>
              <button className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-1 rounded transition">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
