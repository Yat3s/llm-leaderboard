"use client";

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

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-end justify-between">
        <h1 className="mb-8 text-3xl font-bold">DeepSeek R1 供应商性能</h1>
        <p className="text-sm text-gray-500">
          上次更新于: {lastUpdated?.toLocaleString()}
        </p>
      </div>
      <div className="mt-1 rounded-md border">
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
                    <TableCell>{provider.name}</TableCell>
                    <TableCell colSpan={6}>Loading...</TableCell>
                  </TableRow>
                );
              }

              if (!result) {
                return (
                  <TableRow key={provider.id}>
                    <TableCell>{provider.name}</TableCell>
                    <TableCell colSpan={6}>No data available</TableCell>
                  </TableRow>
                );
              }

              const tokensPerSecond = (
                result.overallTokens /
                (result.totalTime / 1000)
              ).toFixed(2);
              const reasoningTokensPerSecond = (
                result.reasoningTokens /
                (result.reasoningTime / 1000)
              ).toFixed(2);
              const contentTokensPerSecond = (
                result.contentTokens /
                (result.contentTime / 1000)
              ).toFixed(2);
              return (
                <TableRow key={provider.id}>
                  <TableCell>{provider.name}</TableCell>
                  <TableCell>
                    {result.firstTokenTime
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
