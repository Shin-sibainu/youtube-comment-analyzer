"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  MessageSquare,
  FileText,
  TrendingUp,
  Lightbulb,
  Sparkles,
  BarChart2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="relative overflow-hidden border-2 border-muted hover:border-[#FF0000]/20 transition-colors duration-200">
          <div className="absolute right-4 top-4 text-[#FF0000]/10">
            <MessageSquare className="h-24 w-24" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#FF0000]/90" />
              コメント分析
            </CardTitle>
            <CardDescription className="text-base">
              動画のコメントを分析し、インサイトを得ることができます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <div className="font-medium mb-2">主な機能：</div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#FF0000]/90" />
                    コメントの感情分析
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-[#FF0000]/90" />
                    時系列分析
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#FF0000]/90" />
                    ユーザー行動分析
                  </li>
                </ul>
              </div>
              <Button
                className={cn(
                  "w-full bg-[#FF0000]/90 hover:bg-[#FF0000] text-white h-12 text-base",
                  "transition-all duration-200 hover:scale-[1.02]"
                )}
                asChild
              >
                <Link href="/dashboard/comment-analysis">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  分析を開始
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 border-muted hover:border-[#FF0000]/20 transition-colors duration-200">
          <div className="absolute right-4 top-4 text-[#FF0000]/10">
            <FileText className="h-24 w-24" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#FF0000]/90" />
              動画要約
            </CardTitle>
            <CardDescription className="text-base">
              動画の内容をAIが要約し、重要なポイントを抽出します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <div className="font-medium mb-2">主な機能：</div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#FF0000]/90" />
                    動画内容の要約
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#FF0000]/90" />
                    キーポイントの抽出
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-[#FF0000]/90" />
                    トピック分析
                  </li>
                </ul>
              </div>
              <Button
                className={cn(
                  "w-full bg-[#FF0000]/90 hover:bg-[#FF0000] text-white h-12 text-base",
                  "transition-all duration-200 hover:scale-[1.02]"
                )}
                asChild
              >
                <Link href="/dashboard/video-summary">
                  <FileText className="mr-2 h-5 w-5" />
                  要約を開始
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 border-muted hover:border-[#FF0000]/20 transition-colors duration-200">
          <div className="absolute right-4 top-4 text-[#FF0000]/10">
            <TrendingUp className="h-24 w-24" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#FF0000]/90" />
              トレンド分析
              <span className="ml-2 bg-[#FF0000] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                New
              </span>
            </CardTitle>
            <CardDescription className="text-base">
              最新のYouTubeトレンドを分析し、コンテンツ戦略に活かせます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <div className="font-medium mb-2">主な機能：</div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#FF0000]/90" />
                    トレンドキーワード分析
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-[#FF0000]/90" />
                    人気コンテンツ分析
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#FF0000]/90" />
                    視聴者興味分析
                  </li>
                </ul>
              </div>
              <Button
                className={cn(
                  "w-full bg-[#FF0000]/90 hover:bg-[#FF0000] text-white h-12 text-base",
                  "transition-all duration-200 hover:scale-[1.02]"
                )}
                asChild
              >
                <Link href="/dashboard/trend-analysis">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  分析を開始
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 border-muted hover:border-[#FF0000]/20 transition-colors duration-200">
          <div className="absolute right-4 top-4 text-[#FF0000]/10">
            <Lightbulb className="h-24 w-24" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[#FF0000]/90" />
              コンテンツ提案
              <span className="ml-2 bg-[#FF0000] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                New
              </span>
            </CardTitle>
            <CardDescription className="text-base">
              AIがチャンネルに最適なコンテンツのアイデアを提案します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <div className="font-medium mb-2">主な機能：</div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-[#FF0000]/90" />
                    コンテンツアイデア生成
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#FF0000]/90" />
                    ターゲット分析
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-[#FF0000]/90" />
                    競合チャンネル分析
                  </li>
                </ul>
              </div>
              <Button
                className={cn(
                  "w-full bg-[#FF0000]/90 hover:bg-[#FF0000] text-white h-12 text-base",
                  "transition-all duration-200 hover:scale-[1.02]"
                )}
                asChild
              >
                <Link href="/dashboard/content-suggestions">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  アイデアを見る
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 border-muted hover:border-[#FF0000]/20 transition-colors duration-200">
          <div className="absolute right-4 top-4 text-[#FF0000]/10">
            <Sparkles className="h-24 w-24" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#FF0000]/90" />
              タイトル最適化
              <span className="ml-2 bg-[#FF0000] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                New
              </span>
            </CardTitle>
            <CardDescription className="text-base">
              AIが視聴回数を最大化するタイトルを提案します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <div className="font-medium mb-2">主な機能：</div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#FF0000]/90" />
                    タイトル生成
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-[#FF0000]/90" />
                    クリック率予測
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#FF0000]/90" />
                    ターゲット最適化
                  </li>
                </ul>
              </div>
              <Button
                className={cn(
                  "w-full bg-[#FF0000]/90 hover:bg-[#FF0000] text-white h-12 text-base",
                  "transition-all duration-200 hover:scale-[1.02]"
                )}
                asChild
              >
                <Link href="/dashboard/title-optimization">
                  <Sparkles className="mr-2 h-5 w-5" />
                  最適化を開始
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
