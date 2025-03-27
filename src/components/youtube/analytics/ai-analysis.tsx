"use client";

import { type BatchAnalysisResult } from "@/lib/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AIAnalysisProps {
  batchAnalysis: BatchAnalysisResult;
}

export function AIAnalysis({ batchAnalysis }: AIAnalysisProps) {
  // detailedAnalysisが存在しない場合のフォールバック
  const detailedAnalysis = batchAnalysis.detailedAnalysis ?? {
    keywordAnalysis: [],
    userEngagement: {
      mostEngagingComments: [],
      peakEngagementTimes: [],
    },
    contentCategories: [],
    actionableInsights: [],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI分析結果</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 要約 */}
          <div className="text-sm text-muted-foreground">
            {batchAnalysis.summary}
          </div>

          {/* 感情分析 */}
          <div className="space-y-4">
            <h3 className="font-medium">感情分析</h3>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div>ポジティブ</div>
                <div>
                  {batchAnalysis.overallSentiment.distribution.positive}%
                </div>
              </div>
              <Progress
                value={batchAnalysis.overallSentiment.distribution.positive}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div>ニュートラル</div>
                <div>
                  {batchAnalysis.overallSentiment.distribution.neutral}%
                </div>
              </div>
              <Progress
                value={batchAnalysis.overallSentiment.distribution.neutral}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div>ネガティブ</div>
                <div>
                  {batchAnalysis.overallSentiment.distribution.negative}%
                </div>
              </div>
              <Progress
                value={batchAnalysis.overallSentiment.distribution.negative}
              />
            </div>
          </div>

          {/* キーワード分析 */}
          {detailedAnalysis.keywordAnalysis.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">キーワード分析</h3>
              <div className="grid gap-4">
                {detailedAnalysis.keywordAnalysis.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span>{keyword.keyword}</span>
                      <Badge
                        variant={
                          keyword.sentiment === "positive"
                            ? "default"
                            : keyword.sentiment === "negative"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {keyword.sentiment === "positive"
                          ? "ポジティブ"
                          : keyword.sentiment === "negative"
                          ? "ネガティブ"
                          : "ニュートラル"}
                      </Badge>
                    </div>
                    <div>{keyword.frequency}回</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* コンテンツカテゴリ */}
          {detailedAnalysis.contentCategories.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">コンテンツカテゴリ</h3>
              <div className="space-y-4">
                {detailedAnalysis.contentCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>{category.category}</div>
                      <div>{category.percentage}%</div>
                    </div>
                    <Progress value={category.percentage} />
                    <div className="text-sm text-muted-foreground">
                      例: {category.examples.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* エンゲージメント分析 */}
          {detailedAnalysis.userEngagement.mostEngagingComments.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">エンゲージメント分析</h3>
              <div className="space-y-4">
                {detailedAnalysis.userEngagement.mostEngagingComments.map(
                  (comment, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="text-sm">{comment.text}</div>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <div>👍 {comment.likeCount}</div>
                        <div>💬 {comment.replyCount}</div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* アクションアイテム */}
          {detailedAnalysis.actionableInsights.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">アクションアイテム</h3>
              <div className="space-y-4">
                {detailedAnalysis.actionableInsights.map((insight, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          insight.type === "strength"
                            ? "default"
                            : insight.type === "improvement"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {insight.type === "strength"
                          ? "強み"
                          : insight.type === "improvement"
                          ? "改善点"
                          : "機会"}
                      </Badge>
                      <div className="font-medium">{insight.description}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      提案: {insight.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
