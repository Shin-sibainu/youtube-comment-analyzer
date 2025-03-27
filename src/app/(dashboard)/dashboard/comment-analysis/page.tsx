"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnalyzeForm } from "@/components/youtube/analyze-form";
import { analyzeVideo } from "../actions";
import { useState } from "react";
import { type BatchAnalysisResult } from "@/lib/ai";

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

export default function CommentAnalysisPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

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
            <AnalyzeForm onAnalyze={analyzeVideo} />
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
                      {result.video.commentCount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">ユニークユーザー</div>
                    <div className="text-2xl font-bold">
                      {result.analysis.topAuthors.length.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">再生回数</div>
                    <div className="text-2xl font-bold">
                      {result.video.viewCount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">高評価数</div>
                    <div className="text-2xl font-bold">
                      {result.video.likeCount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* コメントリストは自動的に表示されます */}
          </>
        )}
      </div>
    </div>
  );
}
