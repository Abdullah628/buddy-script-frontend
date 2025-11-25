import {api} from "@/lib/api";
// like a comment
export async function likeCmnt({
  commentId,
  text,
}: {
  commentId: string;
  text: string;
}) {
  return api(`/comments/${commentId}/like`, {
    method: "POST",
    body: JSON.stringify({
      text,
      commentId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
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

// unlike a comment
export async function unlikeCmnt({commentId}: {commentId: string}) {
  return api(`/comments/${commentId}/like`, {
    method: "DELETE",
  });
}

// list comment likers
export async function getCmntLikers({commentId}: {commentId: string}) {
  return api(`/comments/${commentId}/likes`, {
    method: "GET",
  });
}