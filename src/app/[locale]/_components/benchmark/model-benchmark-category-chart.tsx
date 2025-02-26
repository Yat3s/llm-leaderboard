"use client";

import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { OrgLogo } from "~/components/org-logo";
import { cn } from "~/lib/utils";
import { ModelBenchmark } from "~/types/model";

interface BenchmarkCategoryChartProps {
  title: string;
  datasetName: string;
  colorVariable: string;
  icon?: React.ReactNode;
  data: {
    modelBenchmarks: ModelBenchmark[];
    updatedAt: Date;
  };
}

export function BenchmarkCategoryChart({
  title,
  datasetName,
  colorVariable,
  icon,
  data,
}: BenchmarkCategoryChartProps) {
  const { t } = useTranslation();

  const topModels = [...data.modelBenchmarks]
    .map((model) => ({
      name: model.name,
      organization: model.organization,
      score:
        model.benchmarks.find((b) => b.datasetName === datasetName)?.score ?? 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const chartData = topModels.map((model) => ({
    name: model.name,
    organization: model.organization,
    score: Number((model.score * 100).toFixed(1)),
  }));

  const maxScore = Math.max(...chartData.map((item) => item.score));
  const minScore = Math.min(...chartData.map((item) => item.score));
  const baseScore = minScore - 3;

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
      <div className="mb-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          {icon}
          {title}
        </h3>
      </div>
      <div className="space-y-3">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="group flex items-center justify-start gap-4"
          >
            <div className="flex w-[120px] items-center gap-2 md:w-[140px]">
              <OrgLogo
                org={item.organization.toLowerCase()}
                className="h-3 w-3 md:h-4 md:w-4"
              />
              <span
                className={cn(
                  "truncate text-[11px] text-muted-foreground md:text-xs",
                  chartData.indexOf(item) === 0
                    ? "font-bold text-foreground"
                    : "",
                )}
                title={item.name}
              >
                {item.name.length > 16
                  ? `${item.name.slice(0, 16)}...`
                  : item.name}
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2">
              <div
                style={{
                  width: `${((item.score - baseScore) / (maxScore - baseScore)) * 100}%`,
                  backgroundColor: `hsl(var(--${colorVariable}))`,
                  opacity: `${100 - chartData.indexOf(item) * 10}%`,
                }}
                className="h-4 rounded transition-all"
              ></div>
              <span className="text-xs text-muted-foreground">
                {item.score.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
