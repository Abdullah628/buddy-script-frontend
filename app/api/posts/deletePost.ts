// delete post by id
import {api} from "@/lib/api";
export async function deletePost({postId}: {postId: string}) {
    return api(`/posts/:${postId}`, {
        method: "DELETE",
    });
}