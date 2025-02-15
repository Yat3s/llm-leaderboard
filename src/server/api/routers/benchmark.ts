// src/server/api/routers/benchmark.ts

import { z } from "zod";
import { getModelProviders } from "~/constants/llm-providers";
import { runBenchmarks, saveBenchmarkResults } from "~/server/benchmark/benchmark";
import { TEST_CASES } from "~/server/benchmark/test-cases";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const benchmarkRouter = createTRPCRouter({
    fetchLatestByProvider: publicProcedure
        .input(
            z.object({
                providerId: z.string(),
                model: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const results = await ctx.db.providerBenchmarkResult.findMany({
                where: {
                    providerId: input.providerId,
                    model: input.model,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            });
            return results[0];
        }),

    testRunBenchmark: publicProcedure
        .mutation(async ({ }) => {
            for (const testCase of TEST_CASES) {
                console.log(`\nExecuting test case: ${testCase.name}`);
                console.log("================================");

                const results = await runBenchmarks(getModelProviders(), testCase.prompt);
                if (results) {
                    console.log(`Saving results for ${testCase.name}`);
                    await saveBenchmarkResults(results);
                }
            }
        }),
});