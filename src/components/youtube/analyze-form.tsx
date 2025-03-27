"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AIAnalysis } from "./analytics/ai-analysis";
import { TimelineChart } from "./analytics/timeline-chart";
import { TopAuthorsChart } from "./analytics/top-authors-chart";
import { type BatchAnalysisResult } from "@/lib/ai";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, Clock, MessageCircle } from "lucide-react";

interface AnalyzeFormProps {
  onAnalyze: (url: string) => Promise<AnalysisResult>;
}

interface AnalysisResult {
  video: {
    id: string;
    title: string;
    channelTitle: string;
    publishedAt: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
  comments: {
    id: string;
    authorDisplayName: string;
    authorProfileImageUrl?: string;
    textDisplay: string;
    likeCount: number;
    publishedAt: string;
    updatedAt: string;
    replyCount: number;
  }[];
  analysis: {
    commentTimeline: Array<{ date: string; count: number }>;
    topAuthors: Array<{ name: string; count: number }>;
  };
  aiAnalysis: {
    batchAnalysis: BatchAnalysisResult;
  };
}

export function AnalyzeForm({ onAnalyze }: AnalyzeFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const url = formData.get("url") as string;
      if (!url) {
        toast({
          title: "エラー",
          description: "URLを入力してください",
          variant: "destructive",
        });
        return;
      }
      const result = await onAnalyze(url);
      setResult(result);
      toast({
        title: "分析完了",
        description: "動画の分析が完了しました",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "エラー",
        description: "分析中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-2">
        <div className="text-sm font-medium">YouTube URL</div>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          required
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full bg-[#FF0000]/80 hover:bg-[#FF0000] text-white",
          "transition-colors duration-200",
          "disabled:bg-[#FF0000]/50"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            分析中...
          </>
        ) : (
          "分析開始"
        )}
      </Button>

      {result && (
        <div className="space-y-8">
          {/* 動画情報 */}
          <Card>
            <CardHeader>
              <CardTitle>{result.video.title}</CardTitle>
              <CardDescription>
                {result.video.channelTitle} •{" "}
                {new Date(result.video.publishedAt).toLocaleDateString("ja-JP")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium">再生回数</div>
                  <div>{result.video.viewCount.toLocaleString()}回</div>
                </div>
                <div>
                  <div className="font-medium">高評価</div>
                  <div>{result.video.likeCount.toLocaleString()}件</div>
                </div>
                <div>
                  <div className="font-medium">コメント</div>
                  <div>{result.video.commentCount.toLocaleString()}件</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* グラフ */}
          <div className="grid gap-4 md:grid-cols-2">
            <TimelineChart data={result.analysis.commentTimeline} />
            <TopAuthorsChart data={result.analysis.topAuthors} />
          </div>

          {/* AI分析 */}
          <AIAnalysis batchAnalysis={result.aiAnalysis.batchAnalysis} />

          {/* コメントリスト */}
          <Card>
            <CardHeader>
              <CardTitle>コメント一覧</CardTitle>
              <CardDescription>
                {result.comments.length}件のコメントを表示しています
              </CardDescription>
              <div className="flex items-center gap-4 mt-4">
                <Select
                  defaultValue="newest"
                  onValueChange={(value) => {
                    const sortedComments = [...result.comments].sort((a, b) => {
                      switch (value) {
                        case "likes":
                          return b.likeCount - a.likeCount;
                        case "newest":
                          return (
                            new Date(b.publishedAt).getTime() -
                            new Date(a.publishedAt).getTime()
                          );
                        case "replies":
                          return b.replyCount - a.replyCount;
                        default:
                          return 0;
                      }
                    });
                    setResult({ ...result, comments: sortedComments });
                  }}
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
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {result.comments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-start gap-2">
                        {comment.authorProfileImageUrl && (
                          <img
                            src={comment.authorProfileImageUrl}
                            alt={comment.authorDisplayName}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">
                              {comment.authorDisplayName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(comment.publishedAt).toLocaleDateString(
                                "ja-JP"
                              )}
                            </div>
                          </div>
                          <div className="mt-1 whitespace-pre-wrap">
                            {comment.textDisplay}
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                            <div>👍 {comment.likeCount}</div>
                            {comment.replyCount > 0 && (
                              <div>💬 {comment.replyCount}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </form>
  );
}
