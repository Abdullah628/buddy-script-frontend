import {api} from "@/lib/api";

export interface IMediaMeta {
  width?: number;
  height?: number;
  duration?: number;
  [key: string]: any;
}
export interface IMedia {
  url: string;
  type: string; // e.g., "image/jpeg", "image/png", "video/mp4"
  meta?: IMediaMeta;
}

export async function getPresignedUrl(filename: string) {
  return api(`/media/presign?filename=${filename}`, { method: "GET" });
}

export async function create(payload: { text: string; media: IMedia[]; visibility: "public" | "private"  }) {
    return api("/posts", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function getSinglePost({postId}: {postId: string}) {
    return api(`/posts/${postId}`, {
        method: "GET",
    });
}


export async function deletePost({postId}: {postId: string}) {
    return api(`/posts/${postId}`, {
        method: "DELETE",
    });
}

