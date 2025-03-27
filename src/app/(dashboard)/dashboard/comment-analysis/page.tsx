"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnalyzeForm } from "@/components/youtube/analyze-form";
import { CommentList } from "@/components/youtube/comments/comment-list";
import { analyzeVideo } from "../actions";
import { useState } from "react";

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

export default function CommentAnalysisPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (url: string) => {
    const data = await analyzeVideo(url);
    setResult(data);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">コメント分析</h2>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>YouTube動画分析</CardTitle>
            <CardDescription>
              分析したい動画のURLを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyzeForm onAnalyze={handleAnalyze} />
          </CardContent>
        </Card>

        {result && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>分析結果</CardTitle>
                <CardDescription>
                  コメントの分析結果を表示します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <div className="text-sm font-medium">総コメント数</div>
                    <div className="text-2xl font-bold">
                      {result.analysis.totalComments}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">ユニークユーザー</div>
                    <div className="text-2xl font-bold">
                      {result.analysis.uniqueUsers}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">平均返信時間</div>
                    <div className="text-2xl font-bold">
                      {result.analysis.avgResponseTime}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">感情スコア</div>
                    <div className="text-2xl font-bold">
                      {result.analysis.sentimentScore}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <CommentList comments={result.comments} />
          </>
        )}
      </div>
    </div>
  );
}
