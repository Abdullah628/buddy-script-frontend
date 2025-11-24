"use client"

import { useEffect, useState } from "react"
import { myFeed } from "@/app/api/feed"
import PostCard from "@/app/components/feed/PostCard"
import { useParams } from "next/navigation"

export default function UserFeedPage() {
  const params = useParams()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchFeed = async () => {
      if (!params.userId) return

      try {
        const res = await myFeed({ userId: params.userId as string })
        if (res && res.success && res.data) {
          setPosts(res.data)
        } else {
            setError("Failed to load feed")
        }
      } catch (err) {
        console.error("Failed to fetch feed:", err)
        setError("Failed to load feed")
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()
  }, [params.userId])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">My Feed</h1>
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  )
}
