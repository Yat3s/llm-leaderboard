"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "~/components/section-title";
import { Card } from "~/components/ui/card";
import { getModelProviders } from "~/data/llm-providers";
import { api } from "~/trpc/react";
import { ProviderCategoryChart } from "./provider-category-chart";
import { ProviderTable } from "./provider-table";
import { calculateAverageBenchmarks } from "./utils";

const MODEL = "deepseek-r1";

export const ProviderApiBenchmark = () => {
  const providers = getModelProviders();
  const { data: rawBenchmarkResults, isLoading } =
    api.benchmark.fetchProviderBenchmarks.useQuery({
      providerIds: providers.map((p) => p.id),
      model: MODEL,
    });

  const benchmarkSummaries = rawBenchmarkResults
    ? calculateAverageBenchmarks(rawBenchmarkResults)
    : [];

  const lastUpdated = rawBenchmarkResults
    ?.map((summary) => summary.createdAt)
    .sort((a, b) => (b?.getTime() ?? 0) - (a?.getTime() ?? 0))[0];

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
      className="space-y-8"
    >
      <SectionTitle
        title="API 性能基准测试"
        description="对主流大模型服务商的 API 进行性能与价格对比"
        updatedAt={lastUpdated}
      />

      <Card className="p-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <ProviderTable benchmarkSummaries={benchmarkSummaries} />

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <ProviderCategoryChart category="speed" />
              <ProviderCategoryChart category="price" />
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
};
