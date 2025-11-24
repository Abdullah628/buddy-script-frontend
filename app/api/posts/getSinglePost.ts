// get single post by id
import {api} from "@/lib/api";

export async function getSinglePost({postId}: {postId: string}) {
    return api(`/posts/:${postId}`, {
        method: "GET",
    });
}