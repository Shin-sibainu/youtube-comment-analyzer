import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "YouTube Comment Analyzer",
  description: "Analyze your YouTube video comments with AI-powered insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ja" className={`${notoSansJP.variable} ${inter.variable}`}>
        <body className="font-sans antialiased">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
