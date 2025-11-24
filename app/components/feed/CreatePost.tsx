"use client"

import type React from "react"

import { useState } from "react"
import { ImageIcon, Video, Calendar, FileText, Send } from "lucide-react"
import { create, getPresignedUrl } from "@/app/api/posts"

export default function CreatePost() {
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [visibility, setVisibility] = useState<"public" | "private">("public")

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  const uploadFile = async (file: File) => {
    try {
      const res = await getPresignedUrl(file.name)
      if (!res || !res.success || !res.data) throw new Error("Failed to get presigned URL")
      
      const { url, publicUrl } = res.data
      
      await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })
      
      return publicUrl
    } catch (error) {
      console.error("Upload failed:", error)
      throw error
    }
  }

  const handleSubmit = async () => {
    if (!text && !file) return

    setIsLoading(true)
    try {
      let media: any[] = []
      
      if (file) {
        const publicUrl = await uploadFile(file)
        media.push({
          url: publicUrl,
          type: file.type,
        })
      }

      await create({
        text,
        media,
        visibility,
      })

      setText("")
      setFile(null)
      setPreview("")
      setVisibility("public")
      // Optional: Refresh feed or show success message
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-6">
      {/* Top Section */}
      <div className="flex gap-3 md:gap-4 mb-4">
        <img src="/user-preview.png" alt="User" className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <input
            type="text"
            placeholder="Write something ..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 md:py-3 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm md:text-base"
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
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
        <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <label className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition flex-shrink-0">
            <ImageIcon className="w-5 h-5 text-gray-600" />
            <span className="hidden md:inline text-sm font-medium">Photo</span>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition flex-shrink-0">
            <Video className="w-5 h-5 text-gray-600" />
            <span className="hidden md:inline text-sm font-medium">Video</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition flex-shrink-0">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="hidden md:inline text-sm font-medium">Event</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition flex-shrink-0">
            <FileText className="w-5 h-5 text-gray-600" />
            <span className="hidden md:inline text-sm font-medium">Article</span>
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as "public" | "private")}
            className="px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <button
            onClick={handleSubmit}
            disabled={isLoading || (!text && !file)}
            className="flex items-center gap-2 px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-sm md:text-base"
          >
            <Send className="w-4 h-4" />
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  )
}
