"use client";

import { motion } from "framer-motion";
import { BookOpen, Brain, Code, MessageSquare } from "lucide-react";
import { useTranslation } from "next-i18next";
import { SectionTitle } from "~/app/[locale]/_components/section-title";
import { Card, CardContent } from "~/components/ui/card";
import { type ModelBenchmark } from "~/types/model";
import { BenchmarkCategoryChart } from "./model-benchmark-category-chart";

interface ModelBenchmarkByCategoryProps {
  data: {
    modelBenchmarks: ModelBenchmark[];
    updatedAt: Date;
  };
}

export function ModelBenchmarkByCategory({
  data,
}: ModelBenchmarkByCategoryProps) {
  const { t } = useTranslation();

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
        title={t("categorySection.title")}
        description={t("categorySection.description")}
        updatedAt={data.updatedAt}
      />
      <Card className="-mx-4 mt-4 rounded-none p-4 md:mx-0 md:rounded-lg md:p-6">
        <CardContent>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
            <BenchmarkCategoryChart
              title={t("categories.codeGeneration")}
              datasetName="HumanEval"
              colorVariable="chart-humaneval"
              icon={<Code className="h-5 w-5" />}
              data={data}
            />
            <BenchmarkCategoryChart
              title={t("categories.generalQA")}
              datasetName="GPQA"
              colorVariable="chart-gpqa"
              icon={<MessageSquare className="h-5 w-5" />}
              data={data}
            />
            <BenchmarkCategoryChart
              title={t("categories.logicalReasoning")}
              datasetName="MMLU-Pro"
              colorVariable="chart-mmlu"
              icon={<Brain className="h-5 w-5" />}
              data={data}
            />
            <BenchmarkCategoryChart
              title={t("categories.readingComprehension")}
              datasetName="DROP"
              colorVariable="chart-drop"
              icon={<BookOpen className="h-5 w-5" />}
              data={data}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
