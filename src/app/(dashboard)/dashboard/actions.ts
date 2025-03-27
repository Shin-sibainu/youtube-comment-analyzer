"use server";

import { YouTubeService } from "@/lib/youtube";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AIAnalyzer } from "@/lib/ai";

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

    let aiAnalysis;
    try {
      // AI分析を実行
      aiAnalysis = await AIAnalyzer.analyzeComments(comments);
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
        },
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
