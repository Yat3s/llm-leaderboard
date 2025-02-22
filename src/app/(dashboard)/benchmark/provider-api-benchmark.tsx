"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "~/components/section-title";
import { Card } from "~/components/ui/card";
import { ProviderCategoryChart } from "./provider-category-chart";
import { ProviderTable } from "./provider-table";

export const ProviderApiBenchmark = () => {
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
      />

      <Card className="p-6">
        <ProviderTable />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ProviderCategoryChart category="speed" />
          <ProviderCategoryChart category="price" />
        </div>
      </Card>
    </motion.div>
  );
};
