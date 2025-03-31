import { prisma } from "@/lib/prisma";

export type CreditHistoryType =
  | "INITIAL"
  | "CONSUME"
  | "PURCHASE"
  | "SUBSCRIPTION_BONUS";

export async function checkCredits(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  return user ? user.credits > 0 : false;
}

export async function consumeCredit(
  userId: string,
  projectId: string,
  description: string = "動画分析の利用"
): Promise<boolean> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // クレジット残高確認
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      });

      if (!user || user.credits <= 0) {
        throw new Error("クレジットが不足しています");
      }

      // クレジット消費
      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });

      // 履歴記録
      await tx.creditHistory.create({
        data: {
          userId,
          projectId,
          amount: -1,
          type: "CONSUME",
          description,
        },
      });

      return true;
    });

    return result;
  } catch (error) {
    console.error("クレジット消費エラー:", error);
    return false;
  }
}

export async function addCredits(
  userId: string,
  amount: number,
  type: CreditHistoryType,
  description: string
): Promise<boolean> {
  try {
    await prisma.$transaction(async (tx) => {
      // クレジット追加
      await tx.user.update({
        where: { id: userId },
        data: { credits: { increment: amount } },
      });

      // 履歴記録
      await tx.creditHistory.create({
        data: {
          userId,
          amount,
          type,
          description,
        },
      });
    });

    return true;
  } catch (error) {
    console.error("クレジット追加エラー:", error);
    return false;
  }
}

export async function getRemainingCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  return user?.credits ?? 0;
}

export async function getCreditHistory(userId: string) {
  return prisma.creditHistory.findMany({
    where: { userId },
    include: {
      project: {
        select: {
          name: true,
          videoUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
