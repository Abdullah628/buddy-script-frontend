import { getFeed } from "@/app/api/feed/getFeed";
import PostCard from "@/app/components/feed/PostCard";

export default async function FeedPage() {
  const feed = await getFeed();

  return (
    <div className="space-y-4">
      {feed.data.map((post: any) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
