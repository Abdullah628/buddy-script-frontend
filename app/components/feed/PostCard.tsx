"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, MessageCircle, Share2, MoreVertical } from "lucide-react"
import { likePost, unlikePost, postLiker, likeCmnt, unlikeCmnt, getCmntLikers } from "@/app/api/like/index";
import { createCmntPost, getCmntPost, getRepliesCmnt } from "@/app/api/comment/index";
import { me } from "@/app/api/auth";
import { useAuth } from "@/store/auth.store";
import { deletePost, updatePost } from "@/app/api/posts/index";
import { useRouter } from "next/navigation";
import { uploadMedia } from "@/app/api/upload/index"

interface Post {
  _id: string
  text: string
  media?: { url: string }[]
  authorSnapshot: {
    firstName: string
    lastName: string
    avatarUrl?: string
  }
  authorId?: string
  likesCount: number
  likedByCurrentUser: boolean
  visibility?: string
  commentsCount?: number
  createdAt: string
}

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.likedByCurrentUser)
  const [likes, setLikes] = useState(post.likesCount)
  const [showComments, setShowComments] = useState(false)
  const [showLikers, setShowLikers] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [likers, setLikers] = useState<any[]>([])
  const [loadingLikers, setLoadingLikers] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [localText, setLocalText] = useState(post.text)
  const router = useRouter()
  const [showEditModal, setShowEditModal] = useState(false)
  const [editText, setEditText] = useState(post.text)
  const [editFile, setEditFile] = useState<File | null>(null)
  const [editPreview, setEditPreview] = useState<string>(post.media?.[0]?.url || "")
  const [editLoading, setEditLoading] = useState(false)

  // click-away for menu
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return
      const target = e.target as Node
      if (menuRef.current && !menuRef.current.contains(target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await me()
        if (res && res.success && res.data) {
          setUser(res.data)
          const likersRes = await postLiker({ postId: post._id })
          const likersArr = (likersRes && (likersRes.data || likersRes)) || []
          setLikers(likersArr)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }
    fetchUser()
  }, [])


  // If the API didn't provide `likedByCurrentUser`, infer it by checking
  // whether the logged-in user's id appears in the loaded `likers` list.
  useEffect(() => {
    if (post.likedByCurrentUser !== undefined && post.likedByCurrentUser !== null) {
      setLiked(post.likedByCurrentUser)
      return
    }

    if (!user) return

    const userId = user._id || user.id
    if (!userId) return

    const likersArr = likers || []

    const hasLiked = Array.isArray(likersArr) && likersArr.some((l: any) => {
      if (!l) return false
      // The likers items are shaped like: { _id, targetId, targetType, userId: { _id, firstName, ... }, createdAt }
      if (l.userId) {
        const uid = typeof l.userId === 'string' ? l.userId : (l.userId._id || l.userId.id)
        return uid === userId
      }
      // fallback: item itself may be an id or have _id/id fields
      const itemId = typeof l === 'string' ? l : (l._id || l.id)
      return itemId === userId
    })

    setLiked(Boolean(hasLiked))
  }, [post, user, likers])


  return (
    <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 overflow-hidden mb-4 md:mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4">
        <div className="flex items-center gap-3">
          <img
            src={post.authorSnapshot.avatarUrl || "/user-preview.png"}
            alt={post.authorSnapshot.firstName}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {post.authorSnapshot.firstName} {post.authorSnapshot.lastName}
            </p>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)} • {post.visibility==="private" ? "Private" : "Public"}</p>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setShowMenu((s) => !s)} className="p-1 md:p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20">
              {(user && (user._id === post.authorId || user.id === post.authorId)) ? (
                <>
                  <button
                    onClick={async () => {
                      setShowMenu(false)
                      const confirmed = confirm("Delete this post?")
                      if (!confirmed) return
                      try {
                        await deletePost({ postId: post._id })
                        // Try SPA refresh first, then force a full reload as fallback
                        try {
                          router.refresh()
                        } finally {
                          // Ensure UI updates even if router.refresh doesn't trigger immediately
                          setTimeout(() => {
                            try { window.location.reload() } catch (e) { /* ignore */ }
                          }, 100)
                        }
                      } catch (err) {
                        console.error("Failed to delete post:", err)
                        alert("Failed to delete post")
                      }
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-red-600"
                  >
                    Delete post
                  </button>
                  <button
                    onClick={async () => {
                      setShowMenu(false)
                      setShowEditModal(true)
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                  >
                    Edit
                  </button>
                </>
              ) : null}

              <button onClick={() => { setShowMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">Save post</button>
              <button onClick={() => { setShowMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">Interested</button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-3 md:px-4 pb-3 md:pb-4">
        <p className="text-gray-900 text-sm mb-3 break-words">{localText}</p>
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
              const arr = (res && (res.data || res)) || []
              setLikers(arr)
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
          className="flex-1 cursor-pointer flex items-center justify-center gap-1 md:gap-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition group text-xs md:text-sm"
        >
          <Heart
            className={`w-4 md:w-5 h-4 md:h-5 transition ${liked ? "fill-red-500 text-red-500" : "text-gray-600 group-hover:text-red-500"}`}
          />
          <span className="hidden  md:inline font-medium">{liked ? "Liked" : "Like"}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 cursor-pointer flex items-center justify-center gap-1 md:gap-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-xs md:text-sm"
        >
          <MessageCircle className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
          <span className="hidden md:inline font-medium">Comment</span>
        </button>
        <button className="flex-1 cursor-pointer flex items-center justify-center gap-1 md:gap-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-xs md:text-sm">
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
                    <img src={l.userId?.avatarUrl || l.avatarUrl || "/user-preview.png"} alt={l.userId?.firstName} className="w-8 h-8 rounded-full flex-shrink-0" />
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowEditModal(false)} />
          <div className="bg-white rounded-lg shadow-lg w-full md:w-96 z-10 max-h-[80vh] overflow-auto">
            <div className="p-3 md:p-4 border-b flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-semibold text-sm md:text-base">Edit Post</h3>
              <button onClick={() => setShowEditModal(false)} className="text-sm text-gray-500">Close</button>
            </div>
            <div className="p-3 md:p-4 space-y-3">
              <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full border rounded-md p-2" rows={4} />
              <div>
                {editPreview ? (
                  <img src={editPreview} className="w-full h-48 object-cover rounded-md" alt="preview" />
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0] || null
                  setEditFile(f)
                  if (f) {
                    const reader = new FileReader()
                    reader.onload = () => setEditPreview(String(reader.result || ""))
                    reader.readAsDataURL(f)
                  } else {
                    setEditPreview(post.media?.[0]?.url || "")
                  }
                }} />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowEditModal(false)} className="px-3 py-2 rounded-md border">Cancel</button>
                <button onClick={async () => {
                  setEditLoading(true)
                  try {
                    let mediaArr: any[] | undefined = undefined
                    if (editFile) {
                      // read as data URL
                      const dataUrl = await new Promise<string>((res, rej) => {
                        const r = new FileReader()
                        r.onload = () => res(String(r.result || ""))
                        r.onerror = rej
                        r.readAsDataURL(editFile)
                      })
                      const upl = await uploadMedia(dataUrl, "posts")
                      const up = (upl && (upl.data || upl)) || upl
                      const url = up?.url || up?.secure_url || up?.secureUrl || up?.secureURL
                      if (url) mediaArr = [{ url }]
                    }

                    const payload: any = { postId: post._id, text: editText }
                    if (mediaArr) payload.media = mediaArr
                    await updatePost(payload)
                    setLocalText(editText)
                    setShowEditModal(false)
                    router.refresh()
                  } catch (err) {
                    console.error("Failed to update post:", err)
                    alert("Failed to update post")
                  } finally {
                    setEditLoading(false)
                  }
                }} className="px-3 py-2 bg-blue-600 text-white rounded-md">{editLoading ? 'Saving...' : 'Save'}</button>
              </div>
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
  const router = useRouter()

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
      // Try SPA refresh, then ensure a full reload as fallback so author info and counts update.
      try {
        router.refresh()
      } finally {
        setTimeout(() => {
          try { window.location.reload() } catch (e) { /* ignore */ }
        }, 700)
      }
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
        const data = (res && (res.data || res)) || []
        if (mounted) setComments(data)
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
      return (res && (res.data || res)) || []
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
  const [repliesCount, setRepliesCount] = useState<number>(comment.repliesCount || 0)
  const [liked, setLiked] = useState<boolean>(comment.likedByCurrentUser || false)
  const [likesCount, setLikesCount] = useState<number>(comment.likesCount || 0)
  const [commentLikers, setCommentLikers] = useState<any[]>([])
  const [replyLikedMap, setReplyLikedMap] = useState<Record<string, boolean>>({})
  const [replyLikesCountMap, setReplyLikesCountMap] = useState<Record<string, number>>({})
  const authUser = useAuth((s) => s.user)

  useEffect(() => {
    let mounted = true
    // Prefetch replies count so the UI shows correct count before expanding.
    async function fetchCount() {
      try {
        const res = await loadReplies(comment._id)
        const anyRes: any = res
        const arr = Array.isArray(anyRes) ? anyRes : ((anyRes && (anyRes.data || anyRes)) || [])
        if (mounted) setRepliesCount(Array.isArray(arr) ? arr.length : 0)
        // fetch comment likers to set initial liked state and likes count
        try {
          const likersRes = await getCmntLikers({ commentId: comment._id })
          const likersArr: any[] = (likersRes && (likersRes.data || likersRes)) || []
          if (mounted) {
            setCommentLikers(likersArr)
            const userId = authUser?._id || authUser?.id
            const hasLiked = Array.isArray(likersArr) && likersArr.some((l: any) => {
              if (!l) return false
              if (l.userId) return (l.userId._id || l.userId.id) === userId
              return (l._id || l.id) === userId
            })
            setLiked(Boolean(hasLiked))
            setLikesCount(likersArr.length || comment.likesCount || 0)
          }
        } catch (err) {
          // ignore likers fetch error
        }
      } catch (err) {
        if (mounted) setRepliesCount(0)
      }
    }
    fetchCount()
    return () => { mounted = false }
  }, [comment._id, loadReplies])

  const toggleReplies = async () => {
    if (expanded) {
      setExpanded(false)
      return
    }
    setLoadingReplies(true)
    try {
      if (!replies || replies.length === 0) {
        const res = await loadReplies(comment._id);
        const anyRes: any = res
        const arr = Array.isArray(anyRes) ? anyRes : ((anyRes && (anyRes.data || anyRes)) || [])
        setReplies(arr || [])
        // fetch likers for each reply in parallel
        try {
          const likersResults = await Promise.all(arr.map((r: any) => getCmntLikers({ commentId: r._id })))
          const newReplyLikedMap: Record<string, boolean> = {}
          const newReplyLikesCountMap: Record<string, number> = {}
          const userId = authUser?._id || authUser?.id
          likersResults.forEach((lr: any, idx: number) => {
            const a: any = lr
            const la = Array.isArray(a) ? a : ((a && (a.data || a)) || [])
            const rid = arr[idx]?._id
            if (rid) {
              newReplyLikesCountMap[rid] = la.length || 0
              newReplyLikedMap[rid] = Array.isArray(la) && la.some((l: any) => l?.userId && (l.userId._id === userId || l.userId.id === userId))
            }
          })
          setReplyLikedMap((m) => ({ ...m, ...newReplyLikedMap }))
          setReplyLikesCountMap((m) => ({ ...m, ...newReplyLikesCountMap }))
        } catch (err) {
          // ignore reply likers error
        }
      }
      setExpanded(true)
    } finally {
      setLoadingReplies(false)
    }
  }

  const toggleReplyLike = async (reply: any) => {
    const rid = reply._id
    const prevLiked = !!replyLikedMap[rid]
    const prevCount = replyLikesCountMap[rid] || 0
    setReplyLikedMap((m) => ({ ...m, [rid]: !prevLiked }))
    setReplyLikesCountMap((m) => ({ ...m, [rid]: (m[rid] || 0) + (prevLiked ? -1 : 1) }))
    try {
      if (!prevLiked) {
        await likeCmnt({ commentId: rid, text: "" })
      } else {
        await unlikeCmnt({ commentId: rid })
      }
    } catch (err) {
      console.error("Failed to toggle reply like:", err)
      setReplyLikedMap((m) => ({ ...m, [rid]: prevLiked }))
      setReplyLikesCountMap((m) => ({ ...m, [rid]: prevCount }))
    }
  }

  const toggleCommentLike = async () => {
    const prevLiked = liked
    const prevCount = likesCount
    setLiked(!prevLiked)
    setLikesCount((c) => c + (prevLiked ? -1 : 1))
    try {
      if (!prevLiked) {
        // likeCmnt expects commentId and text; pass empty text for like action
        await likeCmnt({ commentId: comment._id, text: "" })
      } else {
        await unlikeCmnt({ commentId: comment._id })
      }
    } catch (err) {
      console.error("Failed to toggle comment like:", err)
      setLiked(prevLiked)
      setLikesCount(prevCount)
    }
  }

  return (
    <div className="text-xs md:text-sm mb-2 md:mb-3">
      <p className="text-gray-900 break-words">
        <span className="font-semibold">{(comment.authorSnapshot?.firstName && comment.authorSnapshot?.lastName) ? `${comment.authorSnapshot.firstName} ${comment.authorSnapshot.lastName}` : (comment.authorSnapshot?.firstName || comment.authorName || 'Unknown')}</span> {comment.text}
      </p>
      <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
        <button onClick={toggleReplies} className="hover:underline">
          {expanded ? 'Hide replies' : `Show replies (${repliesCount || 0})`}
        </button>
        <button onClick={toggleCommentLike} className="flex items-center gap-1 hover:underline text-gray-600">
          <Heart className={`w-3 h-3 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="text-xs">{likesCount > 0 ? likesCount : 'Like'}</span>
        </button>
      </div>
      {loadingReplies && <p className="text-xs text-gray-500">Loading replies...</p>}
      {expanded && replies.map((r) => (
        <div key={r._id} className="ml-3 md:ml-4 mt-2">
          <p className="text-xs md:text-sm break-words">
            <span className="font-semibold">{(r.authorSnapshot?.firstName && r.authorSnapshot?.lastName) ? `${r.authorSnapshot.firstName} ${r.authorSnapshot.lastName}` : (r.authorSnapshot?.firstName || r.authorName || 'Unknown')}</span> {r.text}
          </p>
          <div className="text-xs text-gray-500 mt-1">
            <button onClick={() => toggleReplyLike(r)} className="flex items-center gap-1 hover:underline text-gray-600">
              <Heart className={`w-3 h-3 ${replyLikedMap[r._id] ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="text-xs">{(replyLikesCountMap[r._id] || r.likesCount) > 0 ? (replyLikesCountMap[r._id] || r.likesCount) : 'Like'}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
