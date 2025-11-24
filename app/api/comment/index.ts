// create comment on post
import {api} from "@/lib/api";
export async function createCmntPost({postId, text, parentCommentId}: {postId: string; text: string, parentCommentId?: string}) {
    return api(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({text, parentCommentId}),
    });
}

// get comments of a post
export async function getCmntPost({postId}: {postId: string}) {
    return api(`/posts/${postId}/comments`, {
        method: "GET",
    });
}

// get replies of a comment
export async function getRepliesCmnt({commentId, postId}: {commentId: string, postId: string}) {
    return api(`/posts/${postId}/comments/${commentId}/replies`, {
        method: "GET",
    });
}