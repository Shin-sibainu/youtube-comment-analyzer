"use client";

import { type BatchAnalysisResult } from "@/lib/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIAnalysisProps {
  batchAnalysis: BatchAnalysisResult;
}

export function AIAnalysis({ batchAnalysis }: AIAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI分析結果</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="font-medium mb-2">概要</div>
            <div className="text-sm">{batchAnalysis.summary}</div>
          </div>

          <div>
            <div className="font-medium mb-2">感情分析</div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div>ポジティブ</div>
                <div>
                  {batchAnalysis.overallSentiment.distribution.positive}%
                </div>
              </div>
              <div>
                <div>ニュートラル</div>
                <div>
                  {batchAnalysis.overallSentiment.distribution.neutral}%
                </div>
              </div>
              <div>
                <div>ネガティブ</div>
                <div>
                  {batchAnalysis.overallSentiment.distribution.negative}%
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="font-medium mb-2">主要トピック</div>
            <div className="flex flex-wrap gap-2">
              {batchAnalysis.topTopics.map((topic, index) => (
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
  );
}
