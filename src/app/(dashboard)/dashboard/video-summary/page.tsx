"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnalyzeForm } from "@/components/youtube/analyze-form";
import { useState } from "react";

interface SummaryResult {
  title: string;
  description: string;
  keyPoints: string[];
  topics: string[];
  summary: string;
}

export default function VideoSummaryPage() {
  const [result, setResult] = useState<SummaryResult | null>(null);

  const handleAnalyze = async (_url: string) => {
    // TODO: 動画要約機能を実装
    setResult({
      title: "サンプル動画",
      description: "これはサンプルの動画説明です。",
      keyPoints: ["重要なポイント1", "重要なポイント2", "重要なポイント3"],
      topics: ["トピック1", "トピック2", "トピック3"],
      summary: "この動画は...",
    });
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">動画要約</h2>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>YouTube動画要約</CardTitle>
            <CardDescription>
              要約したい動画のURLを入力してください
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
                <CardTitle>{result.title}</CardTitle>
                <CardDescription>{result.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">要約</h3>
                    <p className="text-sm text-muted-foreground">
                      {result.summary}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      重要なポイント
                    </h3>
                    <ul className="list-disc pl-4 space-y-1">
                      {result.keyPoints.map((point, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">主なトピック</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.topics.map((topic, index) => (
                        <div
                          key={index}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                        >
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
