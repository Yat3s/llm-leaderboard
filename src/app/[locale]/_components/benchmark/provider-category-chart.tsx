"use client";

import { useTranslation } from "next-i18next";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { getModelProviders } from "~/lib/llm-providers";
import { api } from "~/trpc/react";
import { calculateAverageBenchmarks } from "./utils";

const MODEL = "deepseek-r1";

interface Props {
  category: "speed" | "price";
}

export function ProviderCategoryChart({ category }: Props) {
  const { t } = useTranslation();

  const chartConfig = {
    speed: {
      label: t("providerChart.speed.label"),
      color: "hsl(217, 91%, 60%)",
    },
    price: {
      label: t("providerChart.price.label"),
      color: "hsl(142, 76%, 36%)",
    },
  } satisfies ChartConfig;

  const providers = getModelProviders();
  const { data: rawBenchmarkResults, isLoading } =
    api.benchmark.fetchProviderBenchmarks.useQuery({
      providerIds: providers.map((p) => p.id),
      model: MODEL,
    });

  const benchmarkSummaries = rawBenchmarkResults
    ? calculateAverageBenchmarks(rawBenchmarkResults)
    : [];

  const chartData = providers
    .map((provider) => {
      const summary = benchmarkSummaries.find(
        (s) => s.providerId === provider.id,
      );
      return {
        name: provider.name,
        speed: summary?.tokensPerSecond
          ? Number(summary.tokensPerSecond.toFixed(2))
          : 0,
        price: provider.price?.output
          ? Number(provider.price.output.toFixed(2))
          : 0,
      };
    })
    .sort((a, b) => {
      if (category === "speed") {
        return b.speed - a.speed;
      }
      return a.price - b.price;
    });

  const chartTitle =
    category === "speed"
      ? t("providerChart.speed.title")
      : t("providerChart.price.title");

  const chartDescription =
    category === "speed"
      ? t("providerChart.speed.description")
      : t("providerChart.price.description");

  return (
    <div className="mt-8">
      <div className="mb-4">
        <h3 className="text-lg font-medium">{chartTitle}</h3>
        <p className="text-sm text-muted-foreground">{chartDescription}</p>
      </div>
      <div className="mb-16 h-[300px]">
        {!isLoading && (
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} margin={{}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{ fontSize: 12 }}
                angle={-45}
                height={120}
                textAnchor="end"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey={category}
                fill={chartConfig[category].color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
