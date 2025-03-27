import Anthropic from "@anthropic-ai/sdk";
import { type Comment } from "./youtube";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEYが設定されていません");
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface CommentAnalysis {
  sentiment: {
    label: "positive" | "negative" | "neutral";
    explanation: string;
  };
  topics: string[];
}

export interface BatchAnalysisResult {
  overallSentiment: {
    distribution: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  topTopics: string[];
  summary: string;
}

export class AIAnalyzer {
  private static async analyzeBatch(
    comments: Comment[]
  ): Promise<BatchAnalysisResult> {
    const prompt = `あなたはYouTubeコメントを分析する専門家です。以下の複数のコメントを簡潔に分析してください。
必ず以下のJSON形式で出力してください。文字列は必ずダブルクォートで囲んでください。

コメント一覧：
${comments.map((c) => `- ${c.textDisplay}`).join("\n")}

出力形式：
{
  "overallSentiment": {
    "distribution": {
      "positive": 数値,
      "neutral": 数値,
      "negative": 数値
    }
  },
  "topTopics": [
    "トピック1",
    "トピック2",
    "トピック3"
  ],
  "summary": "コメント全体の要約を1-2文で"
}

注意：
- 数値はクォートで囲まないでください
- 文字列は必ずダブルクォート(")で囲んでください
- 上記のJSON形式を厳密に守ってください
- 分析は日本語で行い、結果は簡潔かつ正確にしてください
- 感情分析の数値は0-100の範囲のパーセンテージで出力してください
- トピックは最大3つまでにしてください`;

    try {
      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        temperature: 0.0,
        messages: [{ role: "user", content: prompt }],
      });

      const content = message.content.find(
        (c) => "text" in c && typeof c.text === "string"
      );
      if (!content || !("text" in content)) {
        throw new Error("AI応答が空でした");
      }

      try {
        const result = JSON.parse(content.text) as BatchAnalysisResult;
        return result;
      } catch (parseError) {
        console.error("JSON解析エラー:", content.text);
        throw new Error("AI応答のJSON解析に失敗しました");
      }
    } catch (error) {
      console.error("Error in AI analysis:", error);
      if (error instanceof Error) {
        throw new Error(`AI分析エラー: ${error.message}`);
      }
      throw new Error("AI分析中に予期せぬエラーが発生しました");
    }
  }

  static async analyzeComments(comments: Comment[]): Promise<{
    batchAnalysis: BatchAnalysisResult;
  }> {
    if (!comments || comments.length === 0) {
      return {
        batchAnalysis: {
          overallSentiment: {
            distribution: {
              positive: 0,
              neutral: 100,
              negative: 0,
            },
          },
          topTopics: ["コメントなし"],
          summary: "分析対象のコメントがありません",
        },
      };
    }

    // コメントを最大50件に制限
    const targetComments = comments.slice(0, 50);

    try {
      // バッチ分析を実行
      const batchAnalysis = await this.analyzeBatch(targetComments);
      return {
        batchAnalysis,
      };
    } catch (error) {
      console.error("コメント分析エラー:", error);
      throw new Error("コメントの分析中にエラーが発生しました");
    }
  }
}
