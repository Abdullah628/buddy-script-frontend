// make a route to upload images into cloudinary
import {api} from "@/lib/api";

// Sends a base64 data URI or remote URL string to the backend upload route.
export async function uploadMedia(file: string, folder?: string) {
    return api("/uploads", {
        method: "POST",
        body: JSON.stringify({ file, folder }),
    });
}