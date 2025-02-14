// src/server/api/routers/benchmark.ts

import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const benchmarkRouter = createTRPCRouter({
    // 获取最新的基准测试结果
    getLatestResults: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(20),
                cursor: z.string().nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const results = await ctx.db.benchmarkResult.findMany({
                take: input.limit + 1,
                cursor: input.cursor ? { id: input.cursor } : undefined,
                orderBy: { createdAt: "desc" },
                include: {
                    provider: true,
                    model: true,
                    benchmark: true,
                },
            });

            let nextCursor: typeof input.cursor | undefined = undefined;
            if (results.length > input.limit) {
                const nextItem = results.pop();
                nextCursor = nextItem?.id;
            }

            return {
                items: results,
                nextCursor,
            };
        }),

    // 获取按提供商分组的最新结果
    getLatestByProvider: publicProcedure.query(async ({ ctx }) => {
        const results = await ctx.db.llmProvider.findMany({
            include: {
                models: {
                    include: {
                        results: {
                            orderBy: { createdAt: "desc" },
                            take: 1,
                            include: {
                                benchmark: true,
                            },
                        },
                    },
                },
            },
        });
        return results;
    }),

    // 运行基准测试(需要认证)
    runBenchmark: protectedProcedure
        .input(
            z.object({
                providerId: z.string(),
                modelId: z.string(),
                benchmarkId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.benchmarkResult.create({
                data: {
                    providerId: input.providerId,
                    modelId: input.modelId,
                    benchmarkId: input.benchmarkId,
                    // ... 其他测试结果数据
                },
            });
        }),
});