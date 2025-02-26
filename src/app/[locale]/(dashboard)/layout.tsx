"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { ThemeToggle } from "~/components/theme-toggle";
import { PulsingDot } from "~/components/ui/pulsing-dot";

const tabs = [
  { href: "/benchmark", label: "Benchmark" },
  { href: "/providers", label: "服务商" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <main className="flex w-full flex-col items-center bg-background">
      <div className="relative flex w-full flex-col items-center bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] bg-[size:4rem_4rem] px-4 pb-16 pt-24 dark:bg-black dark:bg-[linear-gradient(to_right,#222222_1px,transparent_1px),linear-gradient(to_bottom,#222222_1px,transparent_1px)]">
        <h1 className="animate-title mb-2 text-4xl font-bold md:text-7xl">
          {t("dashboard.title")}
        </h1>
        <p className="mt-2 text-base text-muted-foreground md:text-xl">
          {t(
            "dashboard.description",
            "基于多项基准测试，深入对比 LLM 性能、成本与特点，API 服务商的性能与价格",
          )}
        </p>
        <div className="z-20 mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border bg-blue-200/20 px-3 py-2 text-sm font-medium text-blue-500">
            <PulsingDot
              size="h-2.5 w-2.5"
              dotColor="bg-blue-500"
              className="inline-block"
            />
            {t("dashboard.autoUpdate")}
          </div>
          <Link href="https://github.com/Yat3s/llm-leaderboard" target="_blank">
            <Image
              src="/github-mark.svg"
              alt="GitHub"
              width={24}
              height={24}
              className="dark:hidden"
            />
            <Image
              src="/github-mark-white.svg"
              alt="GitHub"
              width={24}
              height={24}
              className="hidden dark:block"
            />
          </Link>
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        {/* Mask */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>
      <div className="container flex flex-col items-center">
        {/* Hide tabs for now */}
        {/* <Tabs tabs={tabs} /> */}

        <div className="mt-6 w-full">{children}</div>
      </div>
    </main>
  );
}
