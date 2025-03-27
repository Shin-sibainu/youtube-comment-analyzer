import { YouTubeService } from "@/lib/youtube";
import { NextResponse } from "next/server";

if (!process.env.YOUTUBE_API_KEY) {
  throw new Error("YouTube API キーが設定されていません");
}

const youtubeService = new YouTubeService(process.env.YOUTUBE_API_KEY);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id;

    // 動画情報を取得
    const video = await youtubeService.getVideoDetails(videoId);

    // 字幕を取得
    const subtitles = await youtubeService.getCaptions(videoId);

    return NextResponse.json({ video, subtitles });
  } catch (error) {
    console.error("YouTube API エラー:", error);
    return NextResponse.json(
      { error: "動画情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
