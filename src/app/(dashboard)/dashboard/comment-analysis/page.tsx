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
import { Lightbulb, TrendingUp, Users, BarChart2 } from "lucide-react";

interface VideoSuggestion {
  title: string;
  description: string;
  estimatedViews: string;
  targetAudience: string;
  keywords: string[];
  confidence: number;
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
    nextVideoSuggestions: VideoSuggestion[];
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
            <AnalyzeForm onAnalyze={analyzeVideo} onResult={setResult} />
          </CardContent>
        </Card>

        {result && (
          <>
            {result.aiAnalysis.nextVideoSuggestions && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-[#FF0000]/90" />
                    次回の動画提案
                  </CardTitle>
                  <CardDescription>
                    コメント分析から導き出された、次にバズる可能性が高い動画の提案です
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {result.aiAnalysis.nextVideoSuggestions.map(
                      (suggestion, index) => (
                        <div
                          key={index}
                          className="relative overflow-hidden rounded-lg border-2 border-muted p-4 hover:border-[#FF0000]/20 transition-colors duration-200"
                        >
                          <div className="absolute right-2 top-2">
                            <div className="text-[#FF0000] font-bold">
                              {Math.round(suggestion.confidence * 100)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              バズる確率
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {suggestion.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {suggestion.description}
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-[#FF0000]/90" />
                                <span className="text-sm">
                                  予想再生回数: {suggestion.estimatedViews}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-[#FF0000]/90" />
                                <span className="text-sm">
                                  ターゲット層: {suggestion.targetAudience}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BarChart2 className="h-4 w-4 text-[#FF0000]/90" />
                                <div className="flex flex-wrap gap-1">
                                  {suggestion.keywords.map(
                                    (keyword, kIndex) => (
                                      <span
                                        key={kIndex}
                                        className="px-2 py-0.5 bg-[#FF0000]/10 text-[#FF0000] rounded-full text-xs"
                                      >
                                        {keyword}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* コメントリストは自動的に表示されます */}
          </>
        )}
      </div>
    </div>
  );
}
