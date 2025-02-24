"use client";

import { ModelBenchmarkTable } from "~/app/_components/benchmark/model-benchmark-table";
import { api } from "~/trpc/react";
import { ModelBenchmarkByCategory } from "../../_components/benchmark/model-benchmark-by-category";
import { ProviderApiBenchmark } from "../../_components/benchmark/provider-api-benchmark";
import { ModelBenchmarkByCategorySkeleton } from "../../_components/skeleton/model-benchmark-by-category-skeleton";
import { ModelBenchmarkTableSkeleton } from "../../_components/skeleton/model-benchmark-table-skeleton";
import { ProviderApiBenchmarkSkeleton } from "../../_components/skeleton/provider-api-benchmark-skeleton";

export default function BenchmarkPage() {
  const { data: benchmark, isLoading } =
    api.benchmark.fetchModelBenchmarks.useQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-16 py-10">
        <ModelBenchmarkTableSkeleton />
        <ModelBenchmarkByCategorySkeleton />
        <ProviderApiBenchmarkSkeleton />
      </div>
    );
  }

  if (!benchmark) {
    return <div>Error loading benchmark data</div>;
  }

  return (
    <div className="container mx-auto space-y-16 py-10">
      <ModelBenchmarkTable data={benchmark} />
      <ModelBenchmarkByCategory data={benchmark} />
      <ProviderApiBenchmark />
    </div>
  );
}
