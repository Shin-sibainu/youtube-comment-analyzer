import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b flex items-center justify-between px-4">
        <div className="font-bold text-xl">YouTube Comment Analyzer</div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 rounded-md hover:bg-gray-100">
                ログイン
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800">
                無料で始める
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="h-16 border-t flex items-center justify-center">
        <p className="text-sm text-gray-500">
          © 2024 YouTube Comment Analyzer. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
