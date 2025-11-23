import {api} from "@/lib/api";

export async function getFeed() {
    return api("/posts/feed", {
        method: "GET",
    });
}