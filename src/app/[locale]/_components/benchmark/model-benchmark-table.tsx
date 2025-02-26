"use client";

import { motion } from "framer-motion";
import { ArrowUpDown, Check, HelpCircle, X } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { SectionTitle } from "~/app/[locale]/_components/section-title";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
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
import { BenchmarkScore, type ModelBenchmark } from "~/types/model";
import { OrgLogo } from "../../../../components/org-logo";

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

interface ModelBenchmarkTableProps {
  data: {
    modelBenchmarks: ModelBenchmark[];
    updatedAt: Date;
  };
}

export function ModelBenchmarkTable({ data }: ModelBenchmarkTableProps) {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<SortField>("GPQA");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const getBenchmarkScore = (
    benchmarks: BenchmarkScore[],
    datasetName: string,
  ) => {
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

  const sortedBenchmarks = [...data.modelBenchmarks].sort((a, b) => {
    const aValue = getSortValue(a, sortField);
    const bValue = getSortValue(b, sortField);
    return sortDirection === "desc" ? bValue - aValue : aValue - bValue;
  });

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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <SectionTitle
        title={t("benchmarkTable.title")}
        description={t("benchmarkTable.description")}
        updatedAt={data.updatedAt}
      />
      <div className="flex justify-end text-sm text-muted-foreground/60">
        {t("benchmarkTable.scrollHint")}
      </div>
      <Card className="mt-1 overflow-x-auto rounded-none p-4 md:mx-0 md:rounded-lg">
        <CardContent className="p-2 md:rounded-xl md:p-4">
          <Table>
            <TableHeader className="bg-background">
              <TableRow>
                <TableHead className="whitespace-nowrap bg-background">
                  {t("benchmarkTable.model")}
                </TableHead>
                <SortableHeader
                  field="GPQA"
                  tooltip={t("benchmarkTable.tooltips.gpqa")}
                >
                  GPQA
                </SortableHeader>
                <SortableHeader
                  field="MMLU-Pro"
                  tooltip={t("benchmarkTable.tooltips.mmluPro")}
                >
                  MMLU-Pro
                </SortableHeader>
                <SortableHeader
                  field="DROP"
                  tooltip={t("benchmarkTable.tooltips.drop")}
                >
                  DROP
                </SortableHeader>
                <SortableHeader
                  field="HumanEval"
                  tooltip={t("benchmarkTable.tooltips.humanEval")}
                >
                  HumanEval
                </SortableHeader>
                <SortableHeader
                  field="inputPrice"
                  tooltip={t("benchmarkTable.tooltips.inputPrice")}
                >
                  {t("benchmarkTable.inputPrice")}
                </SortableHeader>
                <SortableHeader
                  field="outputPrice"
                  tooltip={t("benchmarkTable.tooltips.outputPrice")}
                >
                  {t("benchmarkTable.outputPrice")}
                </SortableHeader>
                <SortableHeader
                  field="license"
                  tooltip={t("benchmarkTable.tooltips.license")}
                >
                  {t("benchmarkTable.openSource")}
                </SortableHeader>
                <SortableHeader
                  field="params"
                  tooltip={t("benchmarkTable.tooltips.params")}
                >
                  {t("benchmarkTable.params")}
                </SortableHeader>
                <SortableHeader
                  field="context"
                  tooltip={t("benchmarkTable.tooltips.context")}
                >
                  {t("benchmarkTable.contextLength")}
                </SortableHeader>
                <SortableHeader
                  field="multimodal"
                  tooltip={t("benchmarkTable.tooltips.multimodal")}
                >
                  {t("benchmarkTable.multimodal")}
                </SortableHeader>
                <SortableHeader
                  field="throughput"
                  tooltip={t("benchmarkTable.tooltips.throughput")}
                >
                  {t("benchmarkTable.throughput")}
                </SortableHeader>
                <SortableHeader
                  field="latency"
                  tooltip={t("benchmarkTable.tooltips.latency")}
                >
                  {t("benchmarkTable.latency")}
                </SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.modelBenchmarks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center">
                    {t("common.loading")}
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
                        : "bg-background"
                    }
                  >
                    <TableCell className="sticky left-0 bg-inherit px-4 font-medium md:min-w-[200px] md:px-2">
                      <div className="flex items-center gap-4 whitespace-nowrap">
                        <div className="relative h-6 w-6 flex-shrink-0">
                          <OrgLogo org={model.organization} />
                        </div>
                        <div className="flex-1 truncate">
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
                      {formatScore(getBenchmarkScore(model.benchmarks, "GPQA"))}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatScore(
                        getBenchmarkScore(model.benchmarks, "MMLU-Pro"),
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatScore(getBenchmarkScore(model.benchmarks, "DROP"))}
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
        </CardContent>
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
      </Card>
    </motion.div>
  );
}

const formatScore = (score: number | null) => {
  if (score === null) return "-";
  return `${(score * 100).toFixed(1)}%`;
};
