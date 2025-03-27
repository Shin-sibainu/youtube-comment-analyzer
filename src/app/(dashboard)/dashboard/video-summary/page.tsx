"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VideoSummaryPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">動画要約</h2>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>YouTube動画要約</CardTitle>
            <CardDescription>
              要約したい動画のURLを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
              <Button type="submit" variant="default" className="w-full">
                要約開始
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
