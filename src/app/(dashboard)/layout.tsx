import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "~/components/theme-toggle";
import { Tabs } from "~/components/ui/tabs";
const tabs = [
  { href: "/benchmark", label: "Benchmark" },
  { href: "/providers", label: "服务商" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex w-full flex-col items-center bg-background">
      <div className="relative flex w-full flex-col items-center bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] bg-[size:4rem_4rem] px-4 pb-16 pt-24 dark:bg-black dark:bg-[linear-gradient(to_right,#222222_1px,transparent_1px),linear-gradient(to_bottom,#222222_1px,transparent_1px)]">
        <h1 className="mb-2 text-7xl font-bold">LLM Leaderboard</h1>
        <p className="mt-2 text-xl text-muted-foreground">
          Analyze and compare AI models across benchmarks, pricing, and
          capabilities.
        </p>
        <div className="relative z-20 mt-4 flex items-center gap-4">
          <Link href="https://github.com/Yat3s/llm-leaderboard" target="_blank">
            <Image
              src="github-mark.svg"
              alt="GitHub"
              width={24}
              height={24}
              className="dark:hidden"
            />
            <Image
              src="github-mark-white.svg"
              alt="GitHub"
              width={24}
              height={24}
              className="hidden dark:block"
            />
          </Link>
          <ThemeToggle />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>
      <div className="container flex flex-col items-center">
        <Tabs tabs={tabs} />

        <div className="mt-6 w-full">{children}</div>
      </div>
    </main>
  );
}
