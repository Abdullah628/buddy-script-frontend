export default function PostCard({ post }: any) {
  return (
    <div className="border rounded-xl p-4 shadow">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={post.authorSnapshot.avatarUrl}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">
            {post.authorSnapshot.firstName} {post.authorSnapshot.lastName}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <p className="mb-3">{post.text}</p>

      {post.media?.length > 0 && (
        <img
          src={post.media[0].url}
          className="rounded-lg w-full object-cover"
        />
      )}
    </div>
  );
}
