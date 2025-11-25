"use client"

import { Plus } from "lucide-react"

export default function Stories() {
  const stories = [
    { name: "Your Story", isOwn: true },
    { name: "Ryan Roslansky", image: "/card_ppl1.png" },
    { name: "Ryan Roslansky", image: "/card_ppl2.png" },
    { name: "Ryan Roslansky", image: "/card_ppl3.png" },
    { name: "Ryan Roslansky", image: "/card_ppl4.png" },
  ]

  return (
    <div className="flex gap-3 mb-6 pb-4 overflow-x-auto">
      {stories.map((story, idx) => (
        <div key={idx} className="flex-shrink-0">
          <div className="relative w-28 h-40 rounded-xl bg-gray-900 overflow-hidden cursor-pointer hover:opacity-80 transition">
            <img
              src={story.image || "/user-preview.png"}
              alt={story.name}
              className="w-full h-full object-cover"
            />
            {story.isOwn ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-xs font-semibold">Your Story</span>
              </div>
            ) : (
              <>
                <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={`/user-preview.png`}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <p className="text-white text-xs font-semibold text-center">{story.name}</p>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
