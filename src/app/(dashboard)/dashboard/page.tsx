"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Youtube,
  BarChart2,
  Users,
  Clock,
  MessageSquare,
  SmilePlus,
  FileText,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommentList } from "@/components/youtube/comments/comment-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnalysisResult {
  analysis: {
    totalComments: number;
    uniqueUsers: number;
    avgResponseTime: string;
    sentimentScore: number;
  };
  comments: {
    id: string;
    content: string;
    authorName: string;
    authorProfileUrl: string;
    likeCount: number;
    replyCount: number;
    publishedAt: string;
    isReply: boolean;
  }[];
}

export default function DashboardPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const stats = [
    {
      name: "分析済み動画",
      value: "0",
      description: "合計分析動画数",
      icon: Youtube,
    },
    {
      name: "総コメント数",
      value: "0",
      description: "全動画のコメント合計",
      icon: BarChart2,
    },
    {
      name: "ユニークユーザー",
      value: "0",
      description: "コメント投稿者数",
      icon: Users,
    },
    {
      name: "平均レスポンス時間",
      value: "0分",
      description: "コメントへの返信時間",
      icon: Clock,
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>コメント分析</CardTitle>
            <CardDescription>
              動画のコメントを分析し、インサイトを得ることができます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                主な機能：
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>コメントの感情分析</li>
                  <li>時系列分析</li>
                  <li>ユーザー行動分析</li>
                </ul>
              </div>
              <Button
                className={cn(
                  "w-full bg-[#FF0000]/90 hover:bg-[#FF0000] text-white",
                  "transition-colors duration-200"
                )}
                asChild
              >
                <Link href="/dashboard/comment-analysis">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  分析を開始
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>動画要約</CardTitle>
            <CardDescription>
              動画の内容をAIが要約し、重要なポイントを抽出します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                主な機能：
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>動画内容の要約</li>
                  <li>キーポイントの抽出</li>
                  <li>トピック分析</li>
                </ul>
              </div>
              <Button
                className={cn(
                  "w-full bg-[#FF0000]/90 hover:bg-[#FF0000] text-white",
                  "transition-colors duration-200"
                )}
                asChild
              >
                <Link href="/dashboard/video-summary">
                  <FileText className="mr-2 h-4 w-4" />
                  要約を開始
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
