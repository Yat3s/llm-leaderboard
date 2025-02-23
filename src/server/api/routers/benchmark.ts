/* eslint-disable */
import { ProviderBenchmarkResult } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { type ModelBenchmark } from "~/types/model";
import { createTRPCRouter, publicProcedure } from "../trpc";

const PROVIDER_BENCHMARKS_PATH = path.join(process.cwd(), "src/data/provider-benchmarks.json");
const MODEL_BENCHMARKS_PATH = path.join(process.cwd(), "src/data/model-benchmarks.json");

export const benchmarkRouter = createTRPCRouter({
    fetchProviderBenchmarks: publicProcedure
        .input(
            z.object({
                providerIds: z.array(z.string()),
                model: z.string(),
            })
        )
        .query(async ({ input }): Promise<ProviderBenchmarkResult[]> => {
            const content = await fs.readFile(PROVIDER_BENCHMARKS_PATH, 'utf-8');
            const rawResults = JSON.parse(content);

            // Transform the raw results to ensure createdAt is a Date object
            const results = rawResults.map((result: any) => ({
                ...result,
                createdAt: new Date(result.createdAt)
            }));

            return results
                .filter((result: ProviderBenchmarkResult) =>
                    input.providerIds.includes(result.providerId) &&
                    result.model === input.model
                )
                .sort((a: ProviderBenchmarkResult, b: ProviderBenchmarkResult) =>
                    b.createdAt.getTime() - a.createdAt.getTime()
                )
                .slice(0, input.providerIds.length * 2);
        }),

    fetchModelBenchmarks: publicProcedure
        .query(async () => {
            try {
                const content = await fs.readFile(MODEL_BENCHMARKS_PATH, 'utf-8');
                const rawData = JSON.parse(content);

                const modelBenchmarks = rawData.modelBenchmarks.map((model: any) => ({
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
                return {
                    modelBenchmarks,
                    updatedAt: rawData.updatedAt,
                };
            } catch (error) {
                console.error('Error reading model benchmarks file:', error);
            }
        }),
});