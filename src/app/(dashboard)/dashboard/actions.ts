"use server";

import { YouTubeService } from "@/lib/youtube";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AIAnalyzer } from "@/lib/ai";
// import { checkCredits, consumeCredit } from "@/lib/credits";
// import { prisma } from "@/lib/prisma";

const urlSchema = z.object({
  url: z.string().url("有効なURLを入力してください"),
});

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?#]+)/,
    /youtube\.com\/shorts\/([^&?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

export async function analyzeVideo(url: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("認証が必要です");
  }

  // クレジット機能は一時的に無効化
  /*
  // クレジット残高チェック
  const hasCredits = await checkCredits(userId);
  if (!hasCredits) {
    throw new Error("クレジットが不足しています");
  }
  */

  try {
    // URLのバリデーション
    const result = urlSchema.safeParse({ url });
    if (!result.success) {
      throw new Error("有効なURLを入力してください");
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error("有効なYouTube URLではありません");
    }

    const youtubeService = new YouTubeService(process.env.YOUTUBE_API_KEY!);
    const { video, comments, analysis } = await youtubeService.analyzeVideo(
      videoId
    );

    /*
    // プロジェクトの作成
    const project = await prisma.project.create({
      data: {
        name: video.title,
        videoUrl: url,
        videoId,
        userId,
        description: `${video.channelTitle}の動画分析`,
      },
    });

    // クレジットの消費
    const creditConsumed = await consumeCredit(
      userId,
      project.id,
      `「${video.title}」の動画分析`
    );
    if (!creditConsumed) {
      throw new Error("クレジットの消費に失敗しました");
    }
    */

    let aiAnalysis;
    try {
      // AI分析を実行
      const aiResult = await AIAnalyzer.analyzeComments(comments);

      // 次回の動画提案を生成
      const nextVideoSuggestions = await AIAnalyzer.generateVideoSuggestions(
        comments,
        aiResult.batchAnalysis
      );

      aiAnalysis = {
        batchAnalysis: aiResult.batchAnalysis,
        nextVideoSuggestions,
      };

      /*
      // コメントの保存
      await prisma.comment.createMany({
        data: comments.map((comment) => ({
          projectId: project.id,
          content: comment.textDisplay,
          authorName: comment.authorDisplayName,
          authorId: comment.id,
          likeCount: comment.likeCount,
          replyCount: comment.replyCount,
          publishedAt: new Date(comment.publishedAt),
        })),
      });

      // 分析結果の保存
      await prisma.analysis.create({
        data: {
          projectId: project.id,
          sentiment: aiResult.batchAnalysis.overallSentiment.distribution.positive / 100,
          keywords: JSON.stringify(aiResult.batchAnalysis.topTopics),
          summary: aiResult.batchAnalysis.summary,
        },
      });
      */
    } catch (error) {
      console.error("AI分析エラー:", error);
      aiAnalysis = {
        batchAnalysis: {
          overallSentiment: {
            distribution: {
              positive: 0,
              neutral: 100,
              negative: 0,
            },
          },
          topTopics: ["分析エラー"],
          summary: "AI分析中にエラーが発生しました",
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
        nextVideoSuggestions: [],
      };
    }

    // ダッシュボードを再検証
    revalidatePath("/dashboard");

    return {
      video: {
        id: video.id,
        title: video.title,
        channelTitle: video.channelTitle,
        publishedAt: video.publishedAt.toISOString(),
        viewCount: video.viewCount,
        likeCount: video.likeCount,
        commentCount: video.commentCount,
      },
      comments: comments.map((comment) => ({
        id: comment.id,
        authorDisplayName: comment.authorDisplayName,
        authorProfileImageUrl: comment.authorProfileImageUrl,
        textDisplay: comment.textDisplay,
        likeCount: comment.likeCount,
        publishedAt: comment.publishedAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
        replyCount: comment.replyCount,
      })),
      analysis: {
        commentTimeline: analysis.commentTimeline,
        topAuthors: analysis.topAuthors,
      },
      aiAnalysis,
    };
  } catch (error) {
    console.error("動画分析中にエラーが発生しました:", error);
    throw error;
  }
}
