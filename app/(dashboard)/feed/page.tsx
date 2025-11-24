"use client"

import Header from "@/app/components/feed/Header"
import Sidebar from "@/app/components/feed/Sidebar"
import Stories from "@/app/components/feed/Stories"
import CreatePost from "@/app/components/feed/CreatePost"
import PostCard from "@/app/components/feed/PostCard"
import Suggestions from "@/app/components/feed/Suggestions"
import { publicPosts } from "@/app/api/feed"
import React from "react"
import { useEffect, useState } from "react"

export default function FeedPage() {

  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Feed - BuddyScript"
    let isMounted = true

    async function loadFeed() {
      try {
        const postsData = await publicPosts()
        if (isMounted) setPosts(postsData.data || [])
      } catch (err) {
        console.error("Failed to load feed:", err)
        if (isMounted) setPosts([])
      }
    }

    loadFeed()

    return () => {
      isMounted = false
    }
  }, [])
  

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto w-full md:max-w-2xl mx-auto">
          <div className="p-3 md:p-6">
            {/* Stories */}
            <div className="hidden md:block">
              <Stories />
            </div>

            {/* Create Post */}
            <CreatePost />

            {/* Posts */}
            <div>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Hidden on mobile and tablet */}
        <div className="hidden xl:block w-96 overflow-y-auto border-l border-gray-200 p-6 bg-gray-50">
          <Suggestions />
        </div>
      </div>
    </div>
  )
}
