"use client"

import type React from "react"

import { useState } from "react"
import { ImageIcon, Video, Calendar, FileText, Send } from "lucide-react"

export default function CreatePost() {
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  const handleSubmit = async () => {
    if (!text && !file) return

    setIsLoading(true)
    try {
      // Simulate post creation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setText("")
      setFile(null)
      setPreview("")
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      {/* Top Section */}
      <div className="flex gap-4 mb-4">
        <img src="/abstract-geometric-shapes.png" alt="User" className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <input
            type="text"
            placeholder="Write something ..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <div className="relative mb-4 rounded-lg overflow-hidden">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />
          <button
            onClick={() => {
              setFile(null)
              setPreview("")
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bottom Section */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition">
            <ImageIcon className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Photo</span>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <Video className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Video</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Event</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <FileText className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Article</span>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || (!text && !file)}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
        >
          <Send className="w-4 h-4" />
          {isLoading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  )
}
