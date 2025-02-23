"use client";

import { ModelBenchmarkTable } from "~/app/_components/benchmark/model-benchmark-table";
import { api } from "~/trpc/react";
import { ModelBenchmarkByCategory } from "../../_components/benchmark/model-benchmark-by-category";
import { ProviderApiBenchmark } from "../../_components/benchmark/provider-api-benchmark";

export default function BenchmarkPage() {
  const { data: benchmark, isLoading } =
    api.benchmark.fetchModelBenchmarks.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
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
