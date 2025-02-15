"use client";

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

export default function ProviderPage() {
  const providers = getModelProviders();
  const benchmarkQueries = providers.map((provider) =>
    api.benchmark.fetchLatestByProvider.useQuery({
      providerId: provider.id,
      model: provider.model,
    }),
  );

  const lastUpdated = benchmarkQueries
    .map((query) => query.data?.createdAt)
    .sort((a, b) => (b?.getTime() ?? 0) - (a?.getTime() ?? 0))[0];

  const runTestBenchmark = api.benchmark.testRunBenchmark.useMutation();

  return (
    <div className="container mx-auto py-10">
      <button
        className="mb-2 rounded-md bg-blue-500 px-4 py-2 text-white"
        onClick={() => {
          runTestBenchmark.mutate();
        }}
      >
        运行测试
      </button>
      <div className="flex items-end gap-2">
        <h1 className="text-xl font-bold">DeepSeek R1 供应商性能</h1>
        <p className="text-sm text-gray-500">
          上次更新于: {lastUpdated?.toLocaleString()}
        </p>
      </div>
      <div className="mt-2 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>服务商</TableHead>
              <TableHead>首 Token 响应时间(秒)</TableHead>
              <TableHead>推理阶段速度(Tokens/秒)</TableHead>
              <TableHead>生成阶段速度(Tokens/秒)</TableHead>
              <TableHead>平均速度(Tokens/秒)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {benchmarkQueries.map((query, index) => {
              const provider = providers[index];
              if (!provider) return null;
              const result = query.data;

              if (query.isLoading) {
                return (
                  <TableRow key={provider.id}>
                    <TableCell className="flex items-center gap-2">
                      <Image
                        src={provider.logo}
                        alt={provider.name}
                        width={32}
                        height={32}
                      />
                      {provider.name}
                    </TableCell>
                    <TableCell colSpan={6}>Loading...</TableCell>
                  </TableRow>
                );
              }

              const tokensPerSecond = result
                ? (result.overallTokens / (result.totalTime / 1000)).toFixed(2)
                : "N/A";
              const reasoningTokensPerSecond = result
                ? (
                    result.reasoningTokens /
                    (result.reasoningTime / 1000)
                  ).toFixed(2)
                : "N/A";
              const contentTokensPerSecond = result
                ? (result.contentTokens / (result.contentTime / 1000)).toFixed(
                    2,
                  )
                : "N/A";
              return (
                <TableRow key={provider.id}>
                  <TableCell className="flex items-center gap-2">
                    <Image
                      src={provider.logo}
                      alt={provider.name}
                      width={36}
                      height={36}
                    />
                    {provider.name}
                  </TableCell>
                  <TableCell>
                    {result?.firstTokenTime
                      ? (result.firstTokenTime / 1000).toFixed(2)
                      : "N/A"}
                  </TableCell>
                  <TableCell>{reasoningTokensPerSecond}</TableCell>
                  <TableCell>{contentTokensPerSecond}</TableCell>
                  <TableCell>{tokensPerSecond}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
