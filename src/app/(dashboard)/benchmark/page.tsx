"use client";

import { ModelBenchmarkTable } from "~/components/model-benchmark-table";
import { ProviderPerformanceTable } from "./provider-peformance";
import { ProviderPricingTable } from "./provider-pricing";

export default function BenchmarkPage() {
  return (
    <div className="container mx-auto space-y-12 py-10">
      <ModelBenchmarkTable />
      <ProviderPerformanceTable />
      <ProviderPricingTable />
    </div>
  );
}
