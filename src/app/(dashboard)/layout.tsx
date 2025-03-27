import { UserButton } from "@clerk/nextjs";
import { Sidebar } from "@/components/sidebar";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* サイドバー */}
      <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-[#E5E5E5]">
          <div className="flex h-16 shrink-0 items-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-xl font-bold hover:text-[#FF0000] transition-colors"
            >
              <svg
                className="w-8 h-8 text-[#FF0000]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              <span>YT Analyzer</span>
            </Link>
          </div>
          <Sidebar />
          <div className="mt-auto">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  userButtonBox: "w-full",
                  userButtonTrigger:
                    "w-full flex items-center gap-2 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-[#FF0000]",
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="pl-72">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
