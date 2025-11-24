import {api} from "@/lib/api";

export async function getFeed() {
    return api("/posts/feed", {
        method: "GET",
    });
}

export async function publicPosts() {
    return api("/posts/public", {
        method: "GET",
    });
}