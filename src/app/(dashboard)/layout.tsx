import { Tabs } from "~/components/ui/tabs";

const tabs = [
  { href: "/providers", label: "服务商" },
  { href: "/models", label: "LLM 模型" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-background container flex flex-1 flex-col items-center px-4 py-8">
      <h1 className="mb-2 text-4xl font-bold">LLM Leaderboard</h1>
      <Tabs tabs={tabs} />

      <div className="mt-6 w-full">{children}</div>
    </main>
  );
}
