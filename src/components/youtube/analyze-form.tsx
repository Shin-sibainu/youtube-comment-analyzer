"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AnalyzeFormProps {
  onAnalyze: (url: string) => Promise<void>;
}

export function AnalyzeForm({ onAnalyze }: AnalyzeFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const url = formData.get("url") as string;
      if (!url) {
        toast({
          title: "エラー",
          description: "URLを入力してください",
          variant: "destructive",
        });
        return;
      }
      await onAnalyze(url);
      toast({
        title: "分析完了",
        description: "動画の分析が完了しました",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "エラー",
        description: "分析中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <div className="text-sm font-medium">YouTube URL</div>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          required
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full bg-[#FF0000]/80 hover:bg-[#FF0000] text-white",
          "transition-colors duration-200",
          "disabled:bg-[#FF0000]/50"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            分析中...
          </>
        ) : (
          "分析開始"
        )}
      </Button>
    </form>
  );
}
