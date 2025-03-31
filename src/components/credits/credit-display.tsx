"use client";

/*
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { getRemainingCredits } from "@/lib/credits";
import { Coins } from "lucide-react";

export function CreditDisplay() {
  const { userId } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (userId) {
      getRemainingCredits(userId).then(setCredits);
    }
  }, [userId]);

  if (credits === null) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Coins className="h-4 w-4 text-yellow-500" />
      <span>残りクレジット: {credits}</span>
    </div>
  );
}
*/

// 一時的に空のコンポーネントを返す
export function CreditDisplay() {
  return null;
}
