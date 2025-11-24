"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, Share2, MoreVertical } from "lucide-react"
import { likePost, unlikePost, postLiker } from "@/app/api/like/index";
import { createCmntPost, getCmntPost, getRepliesCmnt } from "@/app/api/comment/index";

interface Post {
  _id: string
  text: string
  media?: { url: string }[]
  authorSnapshot: {
    firstName: string
    lastName: string
    avatarUrl?: string
  }
  likesCount: number
  likedByCurrentUser: boolean
  commentsCount?: number
  createdAt: string
}

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.likedByCurrentUser)
  const [likes, setLikes] = useState(post.likesCount)
  const [showComments, setShowComments] = useState(false)
  const [showLikers, setShowLikers] = useState(false)
  const [likers, setLikers] = useState<any[]>([])
  const [loadingLikers, setLoadingLikers] = useState(false)

  const toggleLike = async () => {
    // optimistic update
    const prevLiked = liked
    const prevLikes = likes
    setLiked(!prevLiked)
    setLikes((p) => p + (prevLiked ? -1 : 1))

    try {
      if (!prevLiked) {
        await likePost({ postId: post._id })
      } else {
        await unlikePost({ postId: post._id })
      }
    } catch (err) {
      console.error("Like/unlike failed:", err)
      // revert optimistic
      setLiked(prevLiked)
      setLikes(prevLikes)
    }
  }

  const formatDate = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes} minute ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour ago`
    const days = Math.floor(hours / 24)
    return `${days} day ago`
  }

  return (
    <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 overflow-hidden mb-4 md:mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4">
        <div className="flex items-center gap-3">
          <img
            src={post.authorSnapshot.avatarUrl || "/placeholder.svg?height=40&width=40&query=avatar"}
            alt={post.authorSnapshot.firstName}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {post.authorSnapshot.firstName} {post.authorSnapshot.lastName}
            </p>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)} • Public</p>
          </div>
        </div>
        <button className="p-1 md:p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="px-3 md:px-4 pb-3 md:pb-4">
        <p className="text-gray-900 text-sm mb-3 break-words">{post.text}</p>
        {post.media && post.media.length > 0 && (
          <img
            src={post.media[0].url || "/placeholder.svg"}
            alt="Post media"
            className="w-full h-48 md:h-64 object-cover rounded-lg"
          />
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-t border-gray-200 text-xs text-gray-500">
        <button
          onClick={async () => {
            setShowLikers(true)
            setLoadingLikers(true)
            try {
              const res = await postLiker({ postId: post._id })
              console.log("Likers response:", res)
              setLikers(res.data || [])
            } catch (err) {
              console.error("Failed to load likers:", err)
              setLikers([])
            } finally {
              setLoadingLikers(false)
            }
          }}
          className="text-left cursor-pointer text-xs text-gray-500 hover:underline"
        >
          {likes} likes
        </button>
        <button onClick={() => setShowComments((s) => !s)} className="text-left cursor-pointer text-xs text-gray-500 hover:underline">
          {post.commentsCount || 0} comments
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 border-t border-gray-200">
        <button
          onClick={toggleLike}
          className="flex-1 flex items-center justify-center gap-1 md:gap-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition group text-xs md:text-sm"
        >
          <Heart
            className={`w-4 md:w-5 h-4 md:h-5 transition ${liked ? "fill-red-500 text-red-500" : "text-gray-600 group-hover:text-red-500"}`}
          />
          <span className="hidden md:inline font-medium">{liked ? "Liked" : "Like"}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-1 md:gap-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-xs md:text-sm"
        >
          <MessageCircle className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
          <span className="hidden md:inline font-medium">Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 md:gap-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-xs md:text-sm">
          <Share2 className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
          <span className="hidden md:inline font-medium">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200 p-3 md:p-4 bg-gray-50">
          <Comments postId={post._id} />
        </div>
      )}

      {/* Likers Modal */}
      {showLikers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowLikers(false)} />
          <div className="bg-white rounded-lg shadow-lg w-full md:w-96 z-10 max-h-[80vh] overflow-auto">
            <div className="p-3 md:p-4 border-b flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-semibold text-sm md:text-base">Likes</h3>
              <button onClick={() => setShowLikers(false)} className="text-sm text-gray-500">Close</button>
            </div>
            <div className="p-3 md:p-4">
              {loadingLikers ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : likers.length === 0 ? (
                <p className="text-sm text-gray-500">No likes yet</p>
              ) : (
                likers.map((l: any) => (
                  <div key={l._id || l.id || Math.random()} className="flex items-center gap-3 py-2">
                    <img src={l.userId?.avatarUrl || l.avatarUrl || "/placeholder.svg?height=40&width=40&query=avatar"} alt={l.userId?.firstName} className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{(l.userId?.firstName && l.userId?.lastName) ? `${l.userId.firstName} ${l.userId.lastName}` : l.name || l.username || "Unknown"}</div>
                      <div className="text-xs text-gray-500 truncate">{l.title || ""}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      const res = await createCmntPost({ postId, text: newComment })
      // If API returns created comment use it, otherwise optimistic
      const created = res || {
        _id: Date.now().toString(),
        text: newComment,
        authorSnapshot: { firstName: "You", lastName: "" },
      }
      setComments((c) => [...c, created])
      setNewComment("")
    } catch (err) {
      console.error("Failed to create comment:", err)
    }
  }

  useEffect(() => {
    let mounted = true
    async function loadComments() {
      setLoading(true)
      try {
        const res = await getCmntPost({ postId })
        if (mounted) setComments(res.data || [])
      } catch (err) {
        console.error("Failed to load comments:", err)
        if (mounted) setComments([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadComments()
    return () => { mounted = false }
  }, [postId])

  const loadReplies = async (commentId: string) => {
    try {
      const res = await getRepliesCmnt({ commentId, postId })
      return res || []
    } catch (err) {
      console.error("Failed to load replies:", err)
      return []
    }
  }

  return (
    <div className="space-y-2 md:space-y-3">
      {comments.map((c) => (
        <CommentItem key={c._id} comment={c} loadReplies={loadReplies} />
      ))}

      <div className="flex gap-2 mt-3 md:mt-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddComment}
          className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}

function CommentItem({ comment, loadReplies }: { comment: any, loadReplies: (id: string) => Promise<any[]> }) {
  const [expanded, setExpanded] = useState(false)
  const [replies, setReplies] = useState<any[]>([])
  const [loadingReplies, setLoadingReplies] = useState(false)

  const toggleReplies = async () => {
    if (expanded) {
      setExpanded(false)
      return
    }
    setLoadingReplies(true)
    try {
      const res = await loadReplies(comment._id);
      console.log("Replies response:", res)
      setReplies(res.data)
      setExpanded(true)
    } finally {
      setLoadingReplies(false)
    }
  }

  return (
    <div className="text-xs md:text-sm mb-2 md:mb-3">
      <p className="text-gray-900 break-words">
        <span className="font-semibold">{comment.authorSnapshot?.firstName || comment.authorName || 'Unknown'}</span> {comment.text}
      </p>
      <div className="text-xs text-gray-500 mt-1">
        <button onClick={toggleReplies} className="hover:underline">
          {expanded ? 'Hide replies' : `Show replies (${replies.length || 0})`}
        </button>
      </div>
      {loadingReplies && <p className="text-xs text-gray-500">Loading replies...</p>}
      {expanded && replies.map((r) => (
        <div key={r._id} className="ml-3 md:ml-4 mt-2">
          <p className="text-xs md:text-sm break-words"><span className="font-semibold">{r.authorSnapshot?.firstName || 'Unknown'}</span> {r.text}</p>
        </div>
      ))}
    </div>
  )
}
