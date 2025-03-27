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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">最近の分析</TabsTrigger>
          <TabsTrigger value="top">トップコメント</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>最近の分析</CardTitle>
              <CardDescription>最近分析した動画のコメント統計</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="text-center py-8 text-muted-foreground">
                まだ分析データがありません
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="top" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>トップコメント</CardTitle>
              <CardDescription>最も反応の多いコメント</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                まだコメントデータがありません
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {result && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                分析済みコメント
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.analysis.totalComments}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                ユニークユーザー
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.analysis.uniqueUsers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                平均返信時間
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.analysis.avgResponseTime}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">感情スコア</CardTitle>
              <SmilePlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {result.analysis.sentimentScore}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <CommentList comments={result.comments} />
        </div>
      )}
    </div>
  );
}
