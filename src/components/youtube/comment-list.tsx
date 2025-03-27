"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, MessageCircle } from "lucide-react";
import type { Comment } from "@/lib/youtube";

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>コメント一覧</CardTitle>
        <CardDescription>
          分析対象の{comments.length}件のコメントを表示しています
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex flex-col gap-2 rounded-lg border p-4"
              >
                <div className="flex items-center gap-2">
                  {comment.authorProfileImageUrl && (
                    <img
                      src={comment.authorProfileImageUrl}
                      alt={comment.authorDisplayName}
                      className="h-6 w-6 rounded-full"
                    />
                  )}
                  <span className="font-semibold">
                    {comment.authorDisplayName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(comment.publishedAt).toLocaleDateString("ja-JP")}
                  </span>
                </div>
                <p className="text-sm">{comment.textDisplay}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{comment.likeCount}</span>
                  </div>
                  {comment.replyCount > 0 && (
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{comment.replyCount}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
