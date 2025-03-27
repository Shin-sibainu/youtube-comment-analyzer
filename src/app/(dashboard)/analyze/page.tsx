import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">分析</h1>
        <p className="text-muted-foreground">
          動画のコメント分析の詳細な結果を確認できます
        </p>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">分析履歴</TabsTrigger>
          <TabsTrigger value="trends">トレンド分析</TabsTrigger>
          <TabsTrigger value="compare">比較分析</TabsTrigger>
          <TabsTrigger value="insights">インサイト</TabsTrigger>
        </TabsList>

        {/* 分析履歴 */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>最近の分析</CardTitle>
              <CardDescription>過去に分析した動画の一覧</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                まだ分析履歴がありません
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* トレンド分析 */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>コメントトレンド</CardTitle>
              <CardDescription>時間帯別・曜日別の傾向分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                分析データがありません
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 比較分析 */}
        <TabsContent value="compare" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>動画比較</CardTitle>
              <CardDescription>複数の動画のコメント傾向を比較</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                比較するデータがありません
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* インサイト */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>分析インサイト</CardTitle>
              <CardDescription>AIによる詳細な分析と提案</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                インサイトを生成するには分析データが必要です
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
