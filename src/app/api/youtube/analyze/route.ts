import { auth } from "@clerk/nextjs/server";
import { YouTubeService } from "@/services/api/youtube";
import { NextResponse } from "next/server";
import { z } from "zod";

interface YouTubeComment {
  id: string;
  content: string;
  authorName: string;
  authorId: string;
  likeCount: number;
  replyCount: number;
  publishedAt: Date;
}

const requestSchema = z.object({
  videoUrl: z.string().url(),
});

export async function POST(req: Request) {
  try {
    // 認証チェック
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // リクエストのバリデーション
    const body = await req.json();
    const { videoUrl } = requestSchema.parse(body);

    // YouTubeサービスの初期化
    const youtubeService = new YouTubeService();

    // 動画情報とコメントの取得
    const [videoDetails, comments] = await Promise.all([
      youtubeService.getVideoDetails(videoUrl),
      youtubeService.getComments(videoUrl),
    ]);

    // 簡単な分析の実行
    const analysis = {
      totalComments: comments.length,
      topAuthors: getTopAuthors(comments),
      commentTimeline: getCommentTimeline(comments),
      // 感情分析やキーワード抽出は後で実装
    };

    return NextResponse.json({
      video: videoDetails,
      comments,
      analysis,
    });
  } catch (error) {
    console.error("Error in analyze route:", error);
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// コメント数の多い投稿者を取得
function getTopAuthors(comments: YouTubeComment[]) {
  const authorCounts = comments.reduce((acc, comment) => {
    const { authorName } = comment;
    acc[authorName] = (acc[authorName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(authorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
}

// コメントの時系列データを作成
function getCommentTimeline(comments: YouTubeComment[]) {
  const timeline = comments
    .map((comment) => ({
      date: comment.publishedAt.toISOString().split("T")[0],
      count: 1,
    }))
    .reduce((acc, { date }) => {
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return Object.entries(timeline)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));
}
