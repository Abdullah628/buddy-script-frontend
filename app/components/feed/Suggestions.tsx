"use client"

import { X } from "lucide-react"

interface Suggestion {
  name: string
  role: string
  avatarUrl?: string
  isOnline?: boolean
}

export default function Suggestions() {
  const suggested: Suggestion[] = [
    {
      name: "Radovan SkillArena",
      role: "Founder & CEO at Trophy",
      avatarUrl: "/img1.png",
    },
  ]

  const friends: Suggestion[] = [
    {
      name: "Steve Jobs",
      role: "CEO of Apple",
      avatarUrl: "/img5.png",
      isOnline: false,
    },
    {
      name: "Ryan Roslansky",
      role: "CEO of Linkedin",
      avatarUrl: "/img6.png",
      isOnline: true,
    },
    {
      name: "Dylan Field",
      role: "CEO of Figma",
      avatarUrl: "/img7.png",
      isOnline: true,
    },
  ]

  return (
    <div className="w-72 space-y-6">
      {/* You Might Like */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">You Might Like</h3>
          <button className="text-blue-600 text-sm font-semibold hover:underline">See All</button>
        </div>

        <div className="space-y-4">
          {suggested.map((person, idx) => (
            <div key={idx} className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <img
                  src={person.avatarUrl || "/user-preview.png"}
                  alt={person.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{person.name}</p>
                  <p className="text-xs text-gray-500 truncate">{person.role}</p>
                </div>
              </div>
              <button className="ml-2 p-1 hover:bg-gray-100 rounded transition">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition">
          Follow
        </button>
      </div>

      {/* Your Friends */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Your Friends</h3>
          <button className="text-blue-600 text-sm font-semibold hover:underline">See All</button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="input search text"
            className="w-full px-3 py-2 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          {friends.map((friend, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <img
                    src={friend.avatarUrl || "/user-preview.png"}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {friend.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{friend.name}</p>
                  <p className="text-xs text-gray-500 truncate">{friend.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
