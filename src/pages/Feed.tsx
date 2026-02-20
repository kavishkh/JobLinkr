import { useState, useCallback } from "react";
import { PostComposer } from "@/components/PostComposer";
import { PostCard } from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { mockPosts, type Post, type UserRole } from "@/lib/mockData";
import { toast } from "sonner";

export default function Feed({ role }: { role: UserRole }) {
  const [savedPosts, setSavedPosts] = useLocalStorage<Post[]>("joblinkr_posts", mockPosts);
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = useCallback(
    (content: string) => {
      setIsPosting(true);
      // Fake delay
      setTimeout(() => {
        const newPost: Post = {
          id: `p_${Date.now()}`,
          authorId: "u1",
          authorName: role === "employer" ? "TechNova Inc." : "Sarah Chen",
          authorTitle: role === "employer" ? "AI-Powered SaaS Company" : "Senior Frontend Engineer",
          authorRole: role,
          authorAvatar: role === "employer" ? "https://i.pravatar.cc/150?img=12" : "https://i.pravatar.cc/150?img=1",
          content,
          timestamp: new Date(),
          likes: 0,
          comments: 0,
          shares: 0,
          liked: false,
        };
        setSavedPosts((prev) => [newPost, ...prev]);
        setIsPosting(false);
        toast.success("Post published!");
        // TODO: send to backend
      }, 1200);
    },
    [role, setSavedPosts]
  );

  const handleLike = useCallback(
    (id: string) => {
      setSavedPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p))
      );
    },
    [setSavedPosts]
  );

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Feed</h1>

      <PostComposer role={role} onPost={handlePost} isPosting={isPosting} />

      {/* Skeleton while posting */}
      {isPosting && (
        <div className="mt-4 rounded-xl border bg-card p-5">
          <div className="flex gap-3">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="mt-3 h-16 w-full" />
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {savedPosts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))}
      </div>
    </div>
  );
}
