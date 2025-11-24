import {api} from "@/lib/api";

export async function getFeed({userId}: {userId: string}) {
    return api(`/posts/user/:${userId}`, {
        method: "GET",
    });
}