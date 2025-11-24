import {api} from "@/lib/api";
export async function likeCmnt({commentId}: {commentId: string}) {
    return api(`/comments/${commentId}/like`, {
        method: "POST",
    });
}

export async function likePost({postId}: {postId: string}) {
    return api(`/posts/${postId}/like`, {
        method: "POST",
    });
}

export async function postLiker({postId}: {postId: string}) {
    return api(`/posts/${postId}/likes`, {
        method: "GET",
    });
}


export async function unlikePost({postId}: {postId: string}) {
    return api(`/posts/${postId}/like`, {
        method: "DELETE",
    });
}