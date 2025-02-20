"use client";

import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
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
  | "HumanEval";

type SortDirection = "asc" | "desc";

export const ModelBenchmarkTable = () => {
  const [sortField, setSortField] = useState<SortField>("GPQA");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data: modelBenchmarks, isLoading } =
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
      default:
        return getBenchmarkScore(model.benchmarks, field) ?? -Infinity;
    }
  };

  const sortedBenchmarks = modelBenchmarks
    ? [...modelBenchmarks].sort((a, b) => {
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
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => handleSort(field)}
        className="h-8 px-2"
      >
        {children}
        <ArrowUpDown
          className={`ml-1 h-4 w-4 ${sortField === field ? "opacity-100" : "opacity-50"}`}
        />
      </Button>
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
      <div className="flex items-end gap-2">
        <h1 className="text-4xl font-bold">模型性能对比</h1>
      </div>
      <div className="mt-6">
        <div className="overflow-x-auto">
          <div className="min-w-max rounded-lg border p-4 shadow-md shadow-muted/50">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <TableHead className="sticky left-0 bg-background">
                    模型
                  </TableHead>
                  <TableHead>组织</TableHead>
                  <SortableHeader field="multimodal">多模态</SortableHeader>
                  <SortableHeader field="context">上下文长度</SortableHeader>
                  <SortableHeader field="throughput">
                    吞吐量 (tokens/s)
                  </SortableHeader>
                  <SortableHeader field="latency">延迟 (s)</SortableHeader>
                  <TableHead>输入价格 ($/1M tokens)</TableHead>
                  <TableHead>输出价格 ($/1M tokens)</TableHead>
                  <SortableHeader field="GPQA">GPQA</SortableHeader>
                  <SortableHeader field="MMLU">MMLU</SortableHeader>
                  <SortableHeader field="MMLU-Pro">MMLU-Pro</SortableHeader>
                  <SortableHeader field="DROP">DROP</SortableHeader>
                  <SortableHeader field="HumanEval">HumanEval</SortableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBenchmarks.map((model) => (
                    <TableRow key={model.modelId}>
                      <TableCell className="sticky left-0 bg-background font-medium">
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
                      <TableCell>{model.organization}</TableCell>
                      <TableCell>{model.multimodal ? "是" : "否"}</TableCell>
                      <TableCell>{model.context.toLocaleString()}</TableCell>
                      <TableCell>
                        {model.throughput?.toFixed(1) ?? "N/A"}
                      </TableCell>
                      <TableCell>
                        {model.latency?.toFixed(2) ?? "N/A"}
                      </TableCell>
                      <TableCell>
                        ${(model.pricePerInputToken * 1000000).toFixed(3)}
                      </TableCell>
                      <TableCell>
                        ${(model.pricePerOutputToken * 1000000).toFixed(3)}
                      </TableCell>
                      <TableCell>
                        {formatScore(
                          getBenchmarkScore(model.benchmarks, "GPQA"),
                        )}
                      </TableCell>
                      <TableCell>
                        {formatScore(
                          getBenchmarkScore(model.benchmarks, "MMLU"),
                        )}
                      </TableCell>
                      <TableCell>
                        {formatScore(
                          getBenchmarkScore(model.benchmarks, "MMLU-Pro"),
                        )}
                      </TableCell>
                      <TableCell>
                        {formatScore(
                          getBenchmarkScore(model.benchmarks, "DROP"),
                        )}
                      </TableCell>
                      <TableCell>
                        {formatScore(
                          getBenchmarkScore(model.benchmarks, "HumanEval"),
                        )}
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
  if (score === null) return "N/A";
  return `${(score * 100).toFixed(1)}%`;
};
