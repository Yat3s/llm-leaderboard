"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ModelBenchmarkTable } from "~/components/model-benchmark-table";
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

interface BenchmarkSummary {
  providerId: string;
  firstTokenTime: number;
  reasoningTokensPerSecond: number;
  contentTokensPerSecond: number;
  tokensPerSecond: number;
}

const calculateAverageBenchmarks = (
  benchmarkResults: {
    providerId: string;
    firstTokenTime: number | null;
    reasoningTime: number;
    contentTime: number;
    totalTime: number;
    reasoningTokens: number;
    contentTokens: number;
    overallTokens: number;
  }[],
): BenchmarkSummary[] => {
  // Group results by providerId
  const resultsByProvider = benchmarkResults.reduce((map, result) => {
    const results = map.get(result.providerId) || [];
    results.push(result);
    map.set(result.providerId, results);
    return map;
  }, new Map<string, (typeof benchmarkResults)[number][]>());

  // Calculate averages for each provider
  const averages = Array.from(resultsByProvider.entries()).map(
    ([providerId, results]) => {
      const avgFirstTokenTime =
        results.reduce((sum, r) => sum + (r.firstTokenTime ?? 0), 0) /
        results.length;
      const avgReasoningTokensPerSecond =
        results.reduce(
          (sum, r) => sum + r.reasoningTokens / (r.reasoningTime / 1000),
          0,
        ) / results.length;
      const avgContentTokensPerSecond =
        results.reduce(
          (sum, r) => sum + r.contentTokens / (r.contentTime / 1000),
          0,
        ) / results.length;
      const avgTokensPerSecond =
        results.reduce(
          (sum, r) => sum + r.overallTokens / (r.totalTime / 1000),
          0,
        ) / results.length;

      return {
        providerId,
        firstTokenTime: avgFirstTokenTime,
        reasoningTokensPerSecond: avgReasoningTokensPerSecond,
        contentTokensPerSecond: avgContentTokensPerSecond,
        tokensPerSecond: avgTokensPerSecond,
      };
    },
  );

  // Sort by average tokens per second
  return averages.sort((a, b) => b.tokensPerSecond - a.tokensPerSecond);
};

export default function ProviderPage() {
  return (
    <div className="container mx-auto space-y-12 py-10">
      <ProviderPerformanceTable />
      <ProviderPricingTable />
      <ModelBenchmarkTable />
    </div>
  );
}

const ProviderPricingTable = () => {
  const providers = getModelProviders();

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
      <div className="flex items-end gap-2">
        <h1 className="text-4xl font-bold">DeepSeek R1 价格</h1>
      </div>
      <div className="mt-6 rounded-lg border p-4 shadow-md shadow-muted/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>服务商</TableHead>
              <TableHead>输入价格 (每百万 Tokens)</TableHead>
              <TableHead>输出价格 (每百万 Tokens)</TableHead>
              <TableHead>免费额度</TableHead>
              <TableHead>价格详情</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider) => (
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
                <TableCell>
                  {provider.price?.input
                    ? `¥${provider.price.input}`
                    : "未公布"}
                </TableCell>
                <TableCell>
                  {provider.price?.output
                    ? `¥${provider.price.output}`
                    : "未公布"}
                </TableCell>
                <TableCell>
                  {provider.price?.trial?.toLocaleString() ?? "未公布"}
                </TableCell>
                <TableCell>
                  {provider.price?.docUrl ? (
                    <a
                      href={provider.price.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      查看详情
                    </a>
                  ) : (
                    "暂无"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

// deepseek-r1 is so popular, so we only test it
const MODEL = "deepseek-r1";

const ProviderPerformanceTable = () => {
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
