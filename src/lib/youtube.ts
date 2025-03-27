import { z } from "zod";

export const commentSchema = z.object({
  id: z.string(),
  authorDisplayName: z.string(),
  authorProfileImageUrl: z.string().optional(),
  textDisplay: z.string(),
  likeCount: z.number(),
  publishedAt: z.date(),
  updatedAt: z.date(),
  replyCount: z.number(),
});

export type Comment = z.infer<typeof commentSchema>;

export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  channelTitle: z.string(),
  publishedAt: z.date(),
  viewCount: z.number(),
  likeCount: z.number(),
  commentCount: z.number(),
});

export type Video = z.infer<typeof videoSchema>;

export interface AnalysisResult {
  totalComments: number;
  uniqueAuthors: number;
  topAuthors: { name: string; count: number }[];
  commentTimeline: { date: string; count: number }[];
  averageLikes: number;
}

export class YouTubeService {
  private apiKey: string;
  private baseUrl = "https://www.googleapis.com/youtube/v3";

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("YouTube API キーが必要です");
    }
    this.apiKey = apiKey;
  }

  async fetchAllComments(
    videoId: string,
    onProgress?: (progress: number) => void
  ): Promise<Comment[]> {
    let allComments: Comment[] = [];
    let nextPageToken: string | undefined;
    let totalFetched = 0;

    try {
      const video = await this.getVideoDetails(videoId);
      const totalComments = Math.min(video.commentCount, 1000); // APIの制限により1000件まで

      do {
        const response = await fetch(
          `${
            this.baseUrl
          }/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${
            this.apiKey
          }${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`
        );

        if (!response.ok) {
          throw new Error(`YouTube API エラー: ${response.statusText}`);
        }

        const data = await response.json();
        const comments = data.items.map((item: any) => ({
          id: item.id,
          authorDisplayName:
            item.snippet.topLevelComment.snippet.authorDisplayName,
          authorProfileImageUrl:
            item.snippet.topLevelComment.snippet.authorProfileImageUrl,
          textDisplay: item.snippet.topLevelComment.snippet.textDisplay,
          likeCount: item.snippet.topLevelComment.snippet.likeCount,
          publishedAt: new Date(
            item.snippet.topLevelComment.snippet.publishedAt
          ),
          updatedAt: new Date(item.snippet.topLevelComment.snippet.updatedAt),
          replyCount: item.snippet.totalReplyCount,
        }));

        allComments = [...allComments, ...comments];
        totalFetched += comments.length;

        if (onProgress) {
          onProgress((totalFetched / totalComments) * 100);
        }

        nextPageToken = data.nextPageToken;

        // 1000件を超えた場合は終了
        if (totalFetched >= 1000) {
          break;
        }

        // API制限を考慮して少し待機
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } while (nextPageToken);

      return allComments;
    } catch (error) {
      console.error("コメント取得エラー:", error);
      throw error;
    }
  }

  async getVideoDetails(videoId: string): Promise<Video> {
    try {
      const response = await fetch(
        `${this.baseUrl}/videos?part=snippet,statistics&id=${videoId}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API エラー: ${response.statusText}`);
      }

      const data = await response.json();
      const video = data.items[0];

      return {
        id: video.id,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        publishedAt: new Date(video.snippet.publishedAt),
        viewCount: parseInt(video.statistics.viewCount),
        likeCount: parseInt(video.statistics.likeCount),
        commentCount: parseInt(video.statistics.commentCount),
      };
    } catch (error) {
      console.error("動画情報取得エラー:", error);
      throw error;
    }
  }

  async analyzeVideo(
    videoId: string,
    onProgress?: (progress: number) => void
  ): Promise<{
    video: Video;
    comments: Comment[];
    analysis: AnalysisResult;
  }> {
    try {
      const video = await this.getVideoDetails(videoId);
      const comments = await this.fetchAllComments(videoId, onProgress);

      // コメント分析
      const authorCounts = new Map<string, number>();
      const timelineCounts = new Map<string, number>();
      let totalLikes = 0;

      comments.forEach((comment) => {
        // 投稿者カウント
        const currentCount = authorCounts.get(comment.authorDisplayName) || 0;
        authorCounts.set(comment.authorDisplayName, currentCount + 1);

        // タイムラインカウント
        const date = comment.publishedAt.toISOString().split("T")[0];
        const dateCount = timelineCounts.get(date) || 0;
        timelineCounts.set(date, dateCount + 1);

        totalLikes += comment.likeCount;
      });

      // トップ投稿者の取得
      const topAuthors = Array.from(authorCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      // タイムラインの生成（日付順）
      const commentTimeline = Array.from(timelineCounts.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({ date, count }));

      const analysis: AnalysisResult = {
        totalComments: comments.length,
        uniqueAuthors: authorCounts.size,
        topAuthors,
        commentTimeline,
        averageLikes: comments.length > 0 ? totalLikes / comments.length : 0,
      };

      return { video, comments, analysis };
    } catch (error) {
      console.error("動画分析エラー:", error);
      throw error;
    }
  }
}
