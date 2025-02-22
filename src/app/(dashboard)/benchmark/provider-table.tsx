"use client";

import { ArrowUpDown, HelpCircle, Link2 } from "lucide-react";
import { useState } from "react";
import { ProviderLogo } from "~/components/provider-logo";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { getModelProviders } from "~/constants/llm-providers";
import { api } from "~/trpc/react";
import { calculateAverageBenchmarks } from "./utils";
const MODEL = "deepseek-r1";

// 添加排序类型定义
type SortField =
  | "firstTokenTime"
  | "reasoningTokensPerSecond"
  | "contentTokensPerSecond"
  | "tokensPerSecond"
  | "inputPrice"
  | "outputPrice";

type SortDirection = "asc" | "desc";

export const ProviderTable = () => {
  const providers = getModelProviders();
  const { data: rawBenchmarkResults, isLoading } =
    api.benchmark.fetchRecentByProviders.useQuery({
      providerIds: providers.map((p) => p.id),
      model: MODEL,
    });

  const benchmarkSummaries = rawBenchmarkResults
    ? calculateAverageBenchmarks(rawBenchmarkResults)
    : [];

  // 添加排序状态
  const [sortField, setSortField] = useState<SortField>("tokensPerSecond");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // 排序处理函数
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // 排序提供商列表
  const sortedProviders = [...providers].sort((a, b) => {
    const summaryA = benchmarkSummaries.find((s) => s.providerId === a.id);
    const summaryB = benchmarkSummaries.find((s) => s.providerId === b.id);

    let comparison = 0;

    switch (sortField) {
      case "firstTokenTime":
        comparison =
          (summaryB?.firstTokenTime ?? -1) - (summaryA?.firstTokenTime ?? -1);
        break;
      case "reasoningTokensPerSecond":
        comparison =
          (summaryB?.reasoningTokensPerSecond ?? -1) -
          (summaryA?.reasoningTokensPerSecond ?? -1);
        break;
      case "contentTokensPerSecond":
        comparison =
          (summaryB?.contentTokensPerSecond ?? -1) -
          (summaryA?.contentTokensPerSecond ?? -1);
        break;
      case "tokensPerSecond":
        comparison =
          (summaryB?.tokensPerSecond ?? -1) - (summaryA?.tokensPerSecond ?? -1);
        break;
      case "inputPrice":
        comparison =
          (b.price?.input ?? Infinity) - (a.price?.input ?? Infinity);
        break;
      case "outputPrice":
        comparison =
          (b.price?.output ?? Infinity) - (a.price?.output ?? Infinity);
        break;
    }

    return sortDirection === "asc" ? -comparison : comparison;
  });

  const SortableHeader = ({
    field,
    children,
    tooltip,
  }: {
    field: SortField;
    children: React.ReactNode;
    tooltip: string;
  }) => (
    <TableHead>
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => handleSort(field)}
          className={`flex h-8 items-center px-2 ${
            sortField === field
              ? "font-bold text-foreground"
              : "text-muted-foreground"
          }`}
        >
          {children}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-2 w-2 text-muted-foreground/50" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ArrowUpDown
            className={`ml-1 h-3 w-3 ${
              sortField === field ? "opacity-100" : "opacity-50"
            }`}
          />
        </Button>
      </div>
    </TableHead>
  );

  const lastUpdated = rawBenchmarkResults
    ?.map((summary) => summary.createdAt)
    .sort((a, b) => (b?.getTime() ?? 0) - (a?.getTime() ?? 0))[0];

  const runTestBenchmark = api.benchmark.testRunBenchmark.useMutation();

  return (
    <>
      {/* <button
        onClick={() => {
          runTestBenchmark.mutate();
        }}
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        运行测试
      </button> */}

      <div className="mt-2 overflow-x-auto">
        <div className="min-w-[1200px] rounded-xl">
          <Table>
            <TableHeader className="bg-background">
              <TableRow>
                <TableHead className="bg-background">服务商</TableHead>
                <SortableHeader
                  field="firstTokenTime"
                  tooltip="从发送请求到收到第一个 token 的时间"
                >
                  首 Token 响应时间(秒)
                </SortableHeader>
                <SortableHeader
                  field="reasoningTokensPerSecond"
                  tooltip="推理阶段的生成速度"
                >
                  推理阶段速度
                </SortableHeader>
                <SortableHeader
                  field="contentTokensPerSecond"
                  tooltip="内容生成阶段的速度"
                >
                  生成阶段速度
                </SortableHeader>
                <SortableHeader
                  field="tokensPerSecond"
                  tooltip="平均每秒生成的 token 数量"
                >
                  平均速度
                </SortableHeader>
                <SortableHeader
                  field="inputPrice"
                  tooltip="每百万输入 token 的价格（人民币）"
                >
                  输入价格
                </SortableHeader>
                <SortableHeader
                  field="outputPrice"
                  tooltip="每百万输出 token 的价格（人民币）"
                >
                  输出价格
                </SortableHeader>
                <TableHead>免费额度</TableHead>
                <TableHead>开发者平台</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProviders.map((provider, index) => {
                if (isLoading) {
                  return (
                    <TableRow key={provider.id}>
                      <TableCell className="flex items-center gap-2">
                        <ProviderLogo
                          provider={provider.id}
                          width={24}
                          height={24}
                        />
                        {provider.name}
                      </TableCell>
                      <TableCell colSpan={8}>Loading...</TableCell>
                    </TableRow>
                  );
                }

                const summary = benchmarkSummaries.find(
                  (s) => s.providerId === provider.id,
                );

                return (
                  <TableRow
                    key={provider.id}
                    className={
                      index < 3
                        ? index === 0
                          ? "bg-blue-100/50 dark:bg-blue-950/30"
                          : index === 1
                            ? "bg-blue-50/50 dark:bg-blue-950/20"
                            : "bg-blue-50/30 dark:bg-blue-950/10"
                        : ""
                    }
                  >
                    <TableCell className="sticky left-0 flex items-center gap-4 bg-inherit">
                      <ProviderLogo
                        provider={provider.id}
                        width={24}
                        height={24}
                      />
                      {provider.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {summary?.firstTokenTime
                        ? (summary.firstTokenTime / 1000).toFixed(2)
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      {summary?.reasoningTokensPerSecond.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {summary?.contentTokensPerSecond.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {summary?.tokensPerSecond.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {provider.price?.input
                        ? `¥${provider.price.input}`
                        : "未公布"}
                    </TableCell>
                    <TableCell className="text-center">
                      {provider.price?.output
                        ? `¥${provider.price.output}`
                        : "未公布"}
                    </TableCell>
                    <TableCell className="text-center">
                      {provider.price?.trial?.toLocaleString() ?? "未公布"}
                    </TableCell>
                    <TableCell className="text-center">
                      <a
                        href={provider.platform.developerPortal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex text-blue-500 hover:text-blue-600"
                      >
                        <Link2 className="h-4 w-4" />
                        点击前往
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
