"use server";

import { YouTubeService } from "@/lib/youtube";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
  "use server";

  const { userId } = await auth();
  if (!userId) {
    throw new Error("認証が必要です");
  }

  const result = urlSchema.safeParse({ url });
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  try {
    const videoId = extractVideoId(result.data.url);
    if (!videoId) {
      throw new Error("有効なYouTube URLを入力してください");
    }

    const service = new YouTubeService(process.env.YOUTUBE_API_KEY!);
    const data = await service.analyzeVideo(videoId);

    // ダッシュボードの再検証
    revalidatePath("/dashboard");

    return {
      analysis: {
        totalComments: data.analysis.totalComments,
        uniqueUsers: data.analysis.uniqueAuthors,
        avgResponseTime: "計算中...", // TODO: 実際の計算を実装
        sentimentScore: 0, // TODO: 感情分析を実装
      },
      comments: data.comments.map((comment) => ({
        id: comment.id,
        content: comment.textDisplay,
        authorName: comment.authorDisplayName,
        authorProfileUrl: comment.authorProfileImageUrl || "",
        likeCount: comment.likeCount,
        replyCount: comment.replyCount,
        publishedAt: comment.publishedAt.toISOString(),
        isReply: false, // TODO: 実際の返信情報を追加
      })),
    };
  } catch (error) {
    console.error("Error analyzing video:", error);
    throw error instanceof Error
      ? error
      : new Error("分析中にエラーが発生しました");
  }
}
