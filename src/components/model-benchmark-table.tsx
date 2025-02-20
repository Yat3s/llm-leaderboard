"use client";

import { motion } from "framer-motion";
import { ArrowUpDown, Check, HelpCircle, RefreshCcw, X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
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
import { api } from "~/trpc/react";
import { type ModelBenchmark } from "~/types/model";
import { OrgLogo } from "./org-logo";

type SortField =
  | "throughput"
  | "latency"
  | "context"
  | "multimodal"
  | "GPQA"
  | "MMLU"
  | "MMLU-Pro"
  | "DROP"
  | "HumanEval"
  | "params"
  | "inputPrice"
  | "outputPrice"
  | "license";

type SortDirection = "asc" | "desc";

export const ModelBenchmarkTable = () => {
  const [sortField, setSortField] = useState<SortField>("GPQA");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data: benchmark, isLoading } =
    api.benchmark.fetchModelBenchmarks.useQuery();

  const getBenchmarkScore = (benchmarks: any[], datasetName: string) => {
    const benchmark = benchmarks.find((b) => b.datasetName === datasetName);
    return benchmark ? benchmark.score : null;
  };

  const getSortValue = (model: ModelBenchmark, field: SortField) => {
    switch (field) {
      case "throughput":
        return model.throughput ?? -Infinity;
      case "latency":
        return model.latency ?? Infinity;
      case "context":
        return model.context ?? -Infinity;
      case "multimodal":
        return model.multimodal ? 1 : 0;
      case "params":
        return model.params ?? -Infinity;
      case "inputPrice":
        return model.pricePerInputToken ?? -Infinity;
      case "outputPrice":
        return model.pricePerOutputToken ?? -Infinity;
      case "license":
        return model.license === "Proprietary" ? 0 : 1;
      default:
        return getBenchmarkScore(model.benchmarks, field) ?? -Infinity;
    }
  };

  const sortedBenchmarks = benchmark
    ? [...benchmark.modelBenchmarks].sort((a, b) => {
        const aValue = getSortValue(a, sortField);
        const bValue = getSortValue(b, sortField);
        return sortDirection === "desc" ? bValue - aValue : aValue - bValue;
      })
    : [];

  const totalPages = Math.ceil((sortedBenchmarks?.length || 0) / itemsPerPage);
  const paginatedBenchmarks = sortedBenchmarks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

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
            className={`ml-1 h-3 w-3 ${sortField === field ? "opacity-100" : "opacity-50"}`}
          />
        </Button>
      </div>
    </TableHead>
  );

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
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Benchmark</h1>
        <p className="flex items-center text-sm text-muted-foreground">
          数据更新于 {benchmark?.updatedAt.toLocaleString()}{" "}
          <RefreshCcw className="mx-2 inline-block h-3 w-3" />每 2 天自动更新
        </p>
      </div>
      <div className="mt-6">
        <div className="overflow-x-auto">
          <div className="min-w-max rounded-xl border p-4 shadow-md shadow-muted/50">
            <Table>
              <TableHeader className="bg-background">
                <TableRow>
                  <TableHead className="bg-background">模型</TableHead>
                  <SortableHeader field="GPQA" tooltip="通用编程问答能力评测">
                    GPQA
                  </SortableHeader>
                  <SortableHeader field="MMLU" tooltip="多任务语言理解基准测试">
                    MMLU
                  </SortableHeader>
                  <SortableHeader
                    field="MMLU-Pro"
                    tooltip="MMLU的专业版本，更具挑战性"
                  >
                    MMLU-Pro
                  </SortableHeader>
                  <SortableHeader field="DROP" tooltip="阅读理解和问答能力评测">
                    DROP
                  </SortableHeader>
                  <SortableHeader field="HumanEval" tooltip="代码生成能力评测">
                    HumanEval
                  </SortableHeader>
                  <SortableHeader
                    field="inputPrice"
                    tooltip="每百万输入token的价格（美元）"
                  >
                    输入价格 ($/1M)
                  </SortableHeader>
                  <SortableHeader
                    field="outputPrice"
                    tooltip="每百万输出token的价格（美元）"
                  >
                    输出价格 ($/1M)
                  </SortableHeader>
                  <SortableHeader field="license" tooltip="模型是否开源">
                    开源
                  </SortableHeader>
                  <SortableHeader field="params" tooltip="模型参数量（十亿）">
                    参数 (B)
                  </SortableHeader>
                  <SortableHeader
                    field="context"
                    tooltip="模型支持的最大上下文长度（token数）"
                  >
                    上下文长度
                  </SortableHeader>
                  <SortableHeader
                    field="multimodal"
                    tooltip="是否支持多模态输入（如图像）"
                  >
                    多模态
                  </SortableHeader>
                  <SortableHeader
                    field="throughput"
                    tooltip="模型每秒处理的token数"
                  >
                    吞吐量 (tokens/s)
                  </SortableHeader>
                  <SortableHeader
                    field="latency"
                    tooltip="处理请求的平均延迟时间（秒）"
                  >
                    延迟 (s)
                  </SortableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBenchmarks.map((model, index) => (
                    <TableRow
                      key={model.modelId}
                      className={
                        // Only apply background color to first 3 rows of the first page
                        currentPage === 1 && index < 3
                          ? index === 0
                            ? "bg-blue-100/50 dark:bg-blue-950/30"
                            : index === 1
                              ? "bg-blue-50/50 dark:bg-blue-950/20"
                              : "bg-blue-50/30 dark:bg-blue-950/10"
                          : ""
                      }
                    >
                      <TableCell className="sticky left-0 bg-inherit font-medium">
                        <div className="flex items-center gap-4">
                          <div className="relative h-6 w-6 flex-shrink-0">
                            <OrgLogo org={model.organization} />
                          </div>
                          <div>
                            {model.scorecardBlogLink ? (
                              <a
                                href={model.scorecardBlogLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {model.name}
                              </a>
                            ) : (
                              model.name
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {formatScore(
                          getBenchmarkScore(model.benchmarks, "GPQA"),
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatScore(
                          getBenchmarkScore(model.benchmarks, "MMLU"),
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatScore(
                          getBenchmarkScore(model.benchmarks, "MMLU-Pro"),
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatScore(
                          getBenchmarkScore(model.benchmarks, "DROP"),
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatScore(
                          getBenchmarkScore(model.benchmarks, "HumanEval"),
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {model.pricePerInputToken
                          ? `$${(model.pricePerInputToken * 1000000).toFixed(3)}`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {model.pricePerOutputToken
                          ? `$${(model.pricePerOutputToken * 1000000).toFixed(3)}`
                          : "-"}
                      </TableCell>
                      <TableCell className="flex items-center justify-center">
                        {model.license === "Proprietary" ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {model.params
                          ? (model.params / 1000000000).toFixed(2)
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {model.context.toLocaleString()}
                      </TableCell>
                      <TableCell className="flex items-center justify-center">
                        {model.multimodal ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {model.throughput?.toFixed(1) ?? "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {model.latency?.toFixed(2) ?? "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </motion.div>
  );
};

const formatScore = (score: number | null) => {
  if (score === null) return "-";
  return `${(score * 100).toFixed(1)}%`;
};
