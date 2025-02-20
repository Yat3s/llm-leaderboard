// src/server/api/routers/benchmark.ts

import { z } from "zod";
import { getModelProviders } from "~/constants/llm-providers";
import { runBenchmarks, saveBenchmarkResults } from "~/server/benchmark/benchmark";
import { TEST_CASES } from "~/server/benchmark/test-cases";
import { type ModelBenchmark } from "~/types/model";
import { createTRPCRouter, publicProcedure } from "../trpc";

const CACHE_EXPIRATION_TIME = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

export const benchmarkRouter = createTRPCRouter({
    fetchRecentByProviders: publicProcedure
        .input(
            z.object({
                providerIds: z.array(z.string()),
                model: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const results = await ctx.db.providerBenchmarkResult.findMany({
                where: {
                    providerId: {
                        in: input.providerIds
                    },
                    model: input.model,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: input.providerIds.length * 2,
            });
            return results;
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

    fetchModelBenchmarks: publicProcedure
        .query(async ({ ctx }) => {
            try {
                // Get the latest cache entry
                const latestCache = await ctx.db.modelBenchmarkData.findFirst({
                    orderBy: {
                        createdAt: 'desc'
                    }
                });

                // Check if cache exists and is less than 3 days old
                if (latestCache && latestCache.createdAt > new Date(Date.now() - CACHE_EXPIRATION_TIME)) {
                    return JSON.parse(latestCache.cacheJson) as ModelBenchmark[];
                }

                // Fetch fresh data if cache is expired or doesn't exist
                const response = await fetch('https://llm-stats.com/api/models?metrics=true&justCanonicals=true');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                const modelBenchmarks = data.map((model: any) => ({
                    modelId: model.model_id,
                    name: model.name,
                    organization: model.organization,
                    params: model.params,
                    context: model.context,
                    releaseDate: model.release_date,
                    license: model.license,
                    price: model.price,
                    throughput: model.throughput,
                    latency: model.latency,
                    paperLink: model.paper_link,
                    multimodal: model.multimodal,
                    scorecardBlogLink: model.scorecard_blog_link,
                    pricePerInputToken: model.price_per_input_token,
                    pricePerOutputToken: model.price_per_output_token,
                    benchmarks: model.benchmarks.map((benchmark: any) => ({
                        datasetName: benchmark.dataset_name,
                        score: benchmark.score,
                        isSelfReported: benchmark.is_self_reported,
                        analysisMethod: benchmark.analysis_method,
                        dateRecorded: benchmark.date_recorded,
                        sourceLink: benchmark.source_link,
                    })),
                })) as ModelBenchmark[];

                // Save new cache
                await ctx.db.modelBenchmarkData.create({
                    data: {
                        cacheJson: JSON.stringify(modelBenchmarks)
                    }
                });

                return modelBenchmarks;
            } catch (error) {
                console.error('Error fetching model benchmarks:', error);
                throw error;
            }
        }),
});