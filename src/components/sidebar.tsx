"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  FileText,
  Home,
  Settings,
  TrendingUp,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "ダッシュボード",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "コメント分析",
      href: "/dashboard/comment-analysis",
      icon: MessageSquare,
    },
    {
      title: "動画要約",
      href: "/dashboard/video-summary",
      icon: FileText,
    },
    {
      title: "トレンド分析",
      href: "/dashboard/trend-analysis",
      icon: TrendingUp,
      badge: "New",
    },
    {
      title: "コンテンツ提案",
      href: "/dashboard/content-suggestions",
      icon: Lightbulb,
      badge: "New",
    },
    {
      title: "タイトル最適化",
      href: "/dashboard/title-optimization",
      icon: Sparkles,
      badge: "New",
    },
    {
      title: "設定",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start rounded-xl py-6 transition-all relative",
                  pathname === item.href
                    ? "bg-[#F1F1F1] text-[#0F0F0F] font-medium hover:bg-[#E5E5E5]"
                    : "text-[#606060] hover:bg-[#F1F1F1]"
                )}
                asChild
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon
                    className={cn(
                      "mr-4 h-5 w-5 transition-colors",
                      pathname === item.href
                        ? "text-[#FF0000]"
                        : "text-[#606060]"
                    )}
                  />
                  <span className="text-sm">{item.title}</span>
                  {item.badge && (
                    <span className="absolute right-2 bg-[#FF0000] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
