import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/lib/mockData";

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });

  return (
    <article className="group rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <Avatar className="h-11 w-11 ring-1 ring-border">
            <AvatarImage src={post.authorAvatar} />
            <AvatarFallback>{post.authorName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-card-foreground">{post.authorName}</span>
              <Badge
                variant={post.authorRole === "employer" ? "default" : "secondary"}
                className="text-[10px] px-1.5 py-0"
              >
                {post.authorRole === "employer" ? "Employer" : "Seeker"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{post.authorTitle}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        <button className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="mt-4 text-sm leading-relaxed text-card-foreground whitespace-pre-line">
        {post.content}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-1 border-t pt-3">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 ${
            post.liked
              ? "text-primary font-medium"
              : "text-muted-foreground hover:text-primary hover:bg-primary/5"
          }`}
        >
          <Heart className={`h-4 w-4 ${post.liked ? "fill-primary" : ""}`} />
          {post.likes + (post.liked ? 1 : 0)}
        </button>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <MessageCircle className="h-4 w-4" />
          {post.comments}
        </button>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Share2 className="h-4 w-4" />
          {post.shares}
        </button>
      </div>
    </article>
  );
}
