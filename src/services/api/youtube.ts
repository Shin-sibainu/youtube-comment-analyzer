import { z } from "zod";

// YouTubeのコメントデータの型定義
const commentSchema = z.object({
  id: z.string(),
  snippet: z.object({
    topLevelComment: z.object({
      snippet: z.object({
        textDisplay: z.string(),
        authorDisplayName: z.string(),
        authorChannelId: z.object({
          value: z.string(),
        }),
        likeCount: z.number(),
        publishedAt: z.string(),
      }),
    }),
    totalReplyCount: z.number(),
  }),
});

type YouTubeComment = z.infer<typeof commentSchema>;

export class YouTubeService {
  private apiKey: string;

  constructor() {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error("YouTube API key is not set");
    }
    this.apiKey = apiKey;
  }

  // 動画IDを抽出
  private extractVideoId(url: string): string {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    if (!match) {
      throw new Error("Invalid YouTube URL");
    }
    return match[1];
  }

  // コメントを取得
  async getComments(videoUrl: string) {
    try {
      const videoId = this.extractVideoId(videoUrl);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      const comments = z.array(commentSchema).parse(data.items);

      return comments.map((comment) => ({
        id: comment.id,
        content: comment.snippet.topLevelComment.snippet.textDisplay,
        authorName: comment.snippet.topLevelComment.snippet.authorDisplayName,
        authorId: comment.snippet.topLevelComment.snippet.authorChannelId.value,
        likeCount: comment.snippet.topLevelComment.snippet.likeCount,
        replyCount: comment.snippet.totalReplyCount,
        publishedAt: new Date(
          comment.snippet.topLevelComment.snippet.publishedAt
        ),
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  }

  // 動画の詳細情報を取得
  async getVideoDetails(videoUrl: string) {
    try {
      const videoId = this.extractVideoId(videoUrl);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch video details");
      }

      const data = await response.json();
      if (!data.items || data.items.length === 0) {
        throw new Error("Video not found");
      }

      const video = data.items[0];
      return {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnailUrl: video.snippet.thumbnails.high.url,
        channelTitle: video.snippet.channelTitle,
        publishedAt: new Date(video.snippet.publishedAt),
      };
    } catch (error) {
      console.error("Error fetching video details:", error);
      throw error;
    }
  }
}
