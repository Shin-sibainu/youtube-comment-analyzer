import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThumbsUp, MessageCircle, Clock } from "lucide-react";
import { useState } from "react";

interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorProfileUrl: string;
  likeCount: number;
  replyCount: number;
  publishedAt: string;
  isReply: boolean;
}

interface CommentListProps {
  comments: Comment[];
}

type SortOption = "likes" | "newest" | "replies";

export function CommentList({ comments }: CommentListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("likes");
  const [showReplies, setShowReplies] = useState(true);

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case "likes":
        return b.likeCount - a.likeCount;
      case "newest":
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      case "replies":
        return b.replyCount - a.replyCount;
      default:
        return 0;
    }
  });

  const filteredComments = showReplies
    ? sortedComments
    : sortedComments.filter((comment) => !comment.isReply);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>コメント一覧</CardTitle>
        <CardDescription>動画のコメントを表示します</CardDescription>
        <div className="flex items-center justify-between">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="並び替え" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="likes">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>いいね順</span>
                </div>
              </SelectItem>
              <SelectItem value="newest">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>新着順</span>
                </div>
              </SelectItem>
              <SelectItem value="replies">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>返信数順</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? "返信を非表示" : "返信を表示"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border p-4 hover:bg-muted/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <a
                    href={comment.authorProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {comment.authorName}
                  </a>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {comment.content}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {comment.likeCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {comment.replyCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
