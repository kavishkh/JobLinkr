import { useState } from "react";
import { Send, Image } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { UserRole } from "@/lib/mockData";

interface PostComposerProps {
  role: UserRole;
  onPost: (content: string) => void;
  isPosting: boolean;
}

export function PostComposer({ role, onPost, isPosting }: PostComposerProps) {
  const [content, setContent] = useState("");

  const placeholder =
    role === "employer"
      ? "Share a company update, job opening, or industry news…"
      : "Share an update, achievement, or job search tip…";

  const handleSubmit = () => {
    if (!content.trim()) return;
    onPost(content.trim());
    setContent("");
  };

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 ring-1 ring-border">
          <AvatarImage src="https://i.pravatar.cc/150?img=1" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px] resize-none border-0 bg-transparent p-0 text-sm shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0"
            rows={3}
          />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Image className="h-4 w-4" />
          Photo
        </button>
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isPosting}
          size="sm"
          className="gap-1.5 transition-transform hover:scale-105"
        >
          <Send className="h-3.5 w-3.5" />
          {isPosting ? "Posting…" : "Post"}
        </Button>
      </div>
    </div>
  );
}
