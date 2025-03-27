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
    label: "ポジティブ" | "ネガティブ" | "ニュートラル";
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
  detailedAnalysis: {
    keywordAnalysis: {
      keyword: string;
      frequency: number;
      sentiment: "ポジティブ" | "ニュートラル" | "ネガティブ";
    }[];
    userEngagement: {
      mostEngagingComments: {
        text: string;
        likeCount: number;
        replyCount: number;
      }[];
      peakEngagementTimes: {
        time: string;
        commentCount: number;
      }[];
    };
    contentCategories: {
      category: string;
      percentage: number;
      examples: string[];
    }[];
    actionableInsights: {
      type: "強み" | "改善点" | "機会";
      description: string;
      suggestion: string;
    }[];
  };
}

export interface VideoSummaryResult {
  title: string;
  description: string;
  keyPoints: string[];
  topics: string[];
  summary: string;
}

export class AIAnalyzer {
  private static async analyzeBatch(
    comments: Comment[]
  ): Promise<BatchAnalysisResult> {
    const prompt = `あなたはYouTubeコメントを分析する専門家です。以下の複数のコメントを詳細に分析してください。
必ず以下のJSON形式で出力してください。文字列は必ずダブルクォートで囲んでください。

コメント一覧：
${comments.map((c) => `- ${c.textDisplay}`).join("\n")}

分析ポイント：
1. 全体的な感情分析（ポジティブ/ネガティブ/ニュートラル）
2. 主要なトピックの抽出
3. キーワード分析（出現頻度と感情）
4. ユーザーエンゲージメント分析
5. コンテンツカテゴリ分類
6. アクションアイテムの提案

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
  "summary": "コメント全体の要約を1-2文で",
  "detailedAnalysis": {
    "keywordAnalysis": [
      {
        "keyword": "キーワード",
        "frequency": 出現回数,
        "sentiment": "ポジティブ/ニュートラル/ネガティブ"
      }
    ],
    "userEngagement": {
      "mostEngagingComments": [
        {
          "text": "コメント本文",
          "likeCount": いいね数,
          "replyCount": 返信数
        }
      ],
      "peakEngagementTimes": [
        {
          "time": "時間帯",
          "commentCount": コメント数
        }
      ]
    },
    "contentCategories": [
      {
        "category": "カテゴリ名",
        "percentage": 割合（数値）,
        "examples": [
          "例文1",
          "例文2"
        ]
      }
    ],
    "actionableInsights": [
      {
        "type": "強み/改善点/機会",
        "description": "分析内容の説明",
        "suggestion": "具体的な提案"
      }
    ]
  }
}

注意：
- 数値はクォートで囲まないでください
- 文字列は必ずダブルクォート(")で囲んでください
- 上記のJSON形式を厳密に守ってください
- 分析は日本語で行い、結果は簡潔かつ正確にしてください
- 感情分析の数値は0-100の範囲のパーセンテージで出力してください
- トピックは最大3つまでにしてください
- キーワード分析は最大10個まで抽出してください
- エンゲージメントの高いコメントは最大5つまで抽出してください
- コンテンツカテゴリは最大5つまでにしてください
- アクションアイテムは最大3つまでにしてください
- すべての出力は日本語で行ってください
- 感情分析の結果は "ポジティブ"、"ニュートラル"、"ネガティブ" のいずれかを使用してください
- アクションアイテムのtypeは "強み"、"改善点"、"機会" のいずれかを使用してください`;

    try {
      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        temperature: 0.0,
        messages: [{ role: "user", content: prompt }],
      });

      const content = message.content.find(
        (c) => "text" in c && typeof c.text === "string"
      );
      if (!content || !("text" in content)) {
        throw new Error("AI応答が空でした");
      }

      let result;
      try {
        const text = content.text.trim();
        if (!text.startsWith("{") || !text.endsWith("}")) {
          throw new Error("不完全なJSONレスポンス");
        }
        result = JSON.parse(text) as BatchAnalysisResult;

        if (
          !result.overallSentiment?.distribution ||
          !result.topTopics ||
          !result.summary
        ) {
          throw new Error("必須フィールドが欠落しています");
        }
      } catch (parseError) {
        console.error("JSON解析エラー:", content.text);
        return {
          overallSentiment: {
            distribution: {
              positive: 0,
              neutral: 100,
              negative: 0,
            },
          },
          topTopics: ["解析エラー"],
          summary:
            "AI応答の解析に失敗しました。しばらく時間をおいて再度お試しください。",
          detailedAnalysis: {
            keywordAnalysis: [],
            userEngagement: {
              mostEngagingComments: [],
              peakEngagementTimes: [],
            },
            contentCategories: [],
            actionableInsights: [],
          },
        };
      }

      return result;
    } catch (error) {
      console.error("Error in AI analysis:", error);
      throw new Error(
        `AI分析エラー: ${
          error instanceof Error
            ? error.message
            : "予期せぬエラーが発生しました"
        }`
      );
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
          detailedAnalysis: {
            keywordAnalysis: [],
            userEngagement: {
              mostEngagingComments: [],
              peakEngagementTimes: [],
            },
            contentCategories: [],
            actionableInsights: [],
          },
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
      // エラー時のフォールバック値を返す
      return {
        batchAnalysis: {
          overallSentiment: {
            distribution: {
              positive: 0,
              neutral: 100,
              negative: 0,
            },
          },
          topTopics: ["分析エラー"],
          summary:
            "AI分析中にエラーが発生しました。しばらく時間をおいて再度お試しください。",
          detailedAnalysis: {
            keywordAnalysis: [],
            userEngagement: {
              mostEngagingComments: [],
              peakEngagementTimes: [],
            },
            contentCategories: [],
            actionableInsights: [],
          },
        },
      };
    }
  }

  static async summarizeVideo(
    title: string,
    description: string,
    subtitles: { text: string }[]
  ): Promise<VideoSummaryResult> {
    const prompt = `あなたはYouTube動画の内容を要約する専門家です。以下の情報から動画の内容を分析し、要約してください。

タイトル：${title}
説明文：${description}
字幕：
${subtitles.map((s) => s.text).join("\n")}

以下のJSON形式で出力してください：

{
  "title": "動画のタイトル",
  "description": "動画の説明（1-2文）",
  "keyPoints": [
    "重要なポイント1",
    "重要なポイント2",
    "重要なポイント3"
  ],
  "topics": [
    "トピック1",
    "トピック2",
    "トピック3"
  ],
  "summary": "動画の要約（3-5文）"
}

注意：
- すべての出力は日本語で行ってください
- 重要なポイントは箇条書きで3-5個抽出してください
- トピックは3個まで抽出してください
- 要約は簡潔かつ分かりやすく記述してください`;

    try {
      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
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
        const text = content.text.trim();
        if (!text.startsWith("{") || !text.endsWith("}")) {
          throw new Error("不完全なJSONレスポンス");
        }
        const result = JSON.parse(text) as VideoSummaryResult;

        if (!result.title || !result.description || !result.summary) {
          throw new Error("必須フィールドが欠落しています");
        }

        return result;
      } catch (error) {
        console.error("JSON解析エラー:", content.text);
        return {
          title: title,
          description: "要約の生成に失敗しました",
          keyPoints: ["要約エラー"],
          topics: ["エラー"],
          summary:
            "動画の要約に失敗しました。しばらく時間をおいて再度お試しください。",
        };
      }
    } catch (error) {
      console.error("Error in video summarization:", error);
      throw new Error(
        `動画要約エラー: ${
          error instanceof Error
            ? error.message
            : "予期せぬエラーが発生しました"
        }`
      );
    }
  }
}
