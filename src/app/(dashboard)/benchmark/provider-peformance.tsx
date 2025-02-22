"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getModelProviders } from "~/constants/llm-providers";
import { api } from "~/trpc/react";
import { calculateAverageBenchmarks } from "./utils";

// deepseek-r1 is so popular, so we only test it
const MODEL = "deepseek-r1";

export const ProviderPerformanceTable = () => {
  const providers = getModelProviders();
  const { data: rawBenchmarkResults, isLoading } =
    api.benchmark.fetchRecentByProviders.useQuery({
      providerIds: providers.map((p) => p.id),
      model: MODEL,
    });

  const benchmarkSummaries = rawBenchmarkResults
    ? calculateAverageBenchmarks(rawBenchmarkResults)
    : [];

  // Sort providers based on benchmark summaries
  const sortedProviders = [...providers].sort((a, b) => {
    const summaryA = benchmarkSummaries.find((s) => s.providerId === a.id);
    const summaryB = benchmarkSummaries.find((s) => s.providerId === b.id);
    return (
      (summaryB?.tokensPerSecond ?? -1) - (summaryA?.tokensPerSecond ?? -1)
    );
  });

  const lastUpdated = rawBenchmarkResults
    ?.map((summary) => summary.createdAt)
    .sort((a, b) => (b?.getTime() ?? 0) - (a?.getTime() ?? 0))[0];

  const runTestBenchmark = api.benchmark.testRunBenchmark.useMutation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <button
        onClick={() => {
          runTestBenchmark.mutate();
        }}
      >
        运行测试
      </button>
      <div className="flex items-end gap-2">
        <h1 className="text-4xl font-bold">DeepSeek R1 性能</h1>
        <p className="text-sm text-gray-500">
          上次更新于: {lastUpdated?.toLocaleString()}
        </p>
      </div>
      <div className="mt-6 rounded-lg border p-4 shadow-md shadow-muted/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>服务商</TableHead>
              <TableHead>首 Token 响应时间(秒)</TableHead>
              <TableHead>推理阶段速度(Tokens/秒)</TableHead>
              <TableHead>生成阶段速度(Tokens/秒)</TableHead>
              <TableHead>平均速度(Tokens/秒)</TableHead>
              <TableHead>开发者平台</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProviders.map((provider) => {
              if (isLoading) {
                return (
                  <TableRow key={provider.id}>
                    <TableCell className="flex items-center gap-2">
                      <Image
                        src={provider.logo}
                        alt={provider.name}
                        width={24}
                        height={24}
                      />
                      {provider.name}
                    </TableCell>
                    <TableCell colSpan={6}>Loading...</TableCell>
                  </TableRow>
                );
              }

              const summary = benchmarkSummaries.find(
                (s) => s.providerId === provider.id,
              );

              return (
                <TableRow key={provider.id}>
                  <TableCell
                    onClick={() => {
                      window.open(provider.platform.developerPortal, "_blank");
                    }}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Image
                      src={provider.logo}
                      alt={provider.name}
                      width={24}
                      height={24}
                    />
                    {provider.name}
                  </TableCell>
                  <TableCell>
                    {summary?.firstTokenTime
                      ? (summary.firstTokenTime / 1000).toFixed(2)
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {summary?.reasoningTokensPerSecond.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {summary?.contentTokensPerSecond.toFixed(2)}
                  </TableCell>
                  <TableCell>{summary?.tokensPerSecond.toFixed(2)}</TableCell>
                  <TableCell>
                    <a
                      href={provider.platform.developerPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      点击前往
                    </a>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};
