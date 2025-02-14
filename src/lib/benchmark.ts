import OpenAI from "openai";
import { db } from "~/server/db";
import { type ModelProvider } from "../constants/llm-providers";
import { calculateTimes, logMetrics, StreamingMetrics } from "./metric";
import { countTokenLength } from "./tokenizer";

export interface BenchmarkResult {
    model: string;
    provider: string;
    testPrompt: string;
    firstTokenTime: number | null;
    reasoningTokens: number;
    reasoningTime: number;
    contentTokens: number;
    contentTime: number;
    overallTokens: number;
    totalTime: number;
}

function processStreamChunk(
    chunk: OpenAI.Chat.Completions.ChatCompletionChunk,
    metrics: StreamingMetrics,
): void {
    const delta = chunk.choices[0]?.delta;
    const reasoningPiece = (delta as any).reasoning_content || "";
    const contentPiece = delta?.content || "";

    if (metrics.firstTokenTime === null && (reasoningPiece || contentPiece)) {
        metrics.firstTokenTime = Date.now() - metrics.requestStartTime;
    }

    if (reasoningPiece) {
        if (metrics.reasoningTiming.start === null) {
            metrics.reasoningTiming.start = Date.now();
        }
        metrics.reasoningText += reasoningPiece;
        const tokens = countTokenLength(reasoningPiece);
        metrics.reasoningTokens += tokens;
        metrics.overallTokens += tokens;
        metrics.reasoningTiming.end = Date.now();
        process.stdout.write(reasoningPiece);
    } else if (contentPiece) {
        if (metrics.contentTiming.start === null) {
            metrics.contentTiming.start = Date.now();
        }
        metrics.contentText += contentPiece;
        const tokens = countTokenLength(contentPiece);
        metrics.contentTokens += tokens;
        metrics.overallTokens += tokens;
        metrics.contentTiming.end = Date.now();
        process.stdout.write(contentPiece);
    }
}

async function benchmarkLlmProvider(
    provider: ModelProvider,
    prompt: string
): Promise<BenchmarkResult | null> {
    console.log("\n---------------------------");
    console.log(`Testing provider: ${provider.name}`);
    console.log("---------------------------\n");

    try {
        const client = new OpenAI({
            apiKey: provider.apiKey,
            baseURL: provider.baseUrl,
        });

        const metrics = {
            requestStartTime: Date.now(),
            reasoningTokens: 0,
            contentTokens: 0,
            overallTokens: 0,
            reasoningText: "",
            contentText: "",
            firstTokenTime: null,
            reasoningTiming: { start: null, end: null },
            contentTiming: { start: null, end: null }
        };

        const stream = await client.chat.completions.create({
            model: provider.model,
            messages: [{ role: "user", content: prompt }],
            stream: true,
        });

        for await (const chunk of stream) {
            processStreamChunk(chunk, metrics);
        }

        const times = calculateTimes(metrics);
        logMetrics(provider.name, metrics, times);

        console.log("\n---------------------------\n");

        return {
            model: provider.model,
            provider: provider.name,
            testPrompt: prompt,
            firstTokenTime: metrics.firstTokenTime ? metrics.firstTokenTime : null,
            reasoningTokens: metrics.reasoningTokens,
            reasoningTime: times.reasoningTime,
            contentTokens: metrics.contentTokens,
            contentTime: times.contentTime,
            overallTokens: metrics.overallTokens,
            totalTime: times.totalTime,
        };

    } catch (error) {
        console.error(`Error occurred while testing provider ${provider.name}:`, error);
        console.log("\n---------------------------\n");
        return null;
    }
}

export async function runBenchmarks(providers: ModelProvider[], prompt: string) {
    const results: BenchmarkResult[] = [];
    for (const provider of providers) {
        const result = await benchmarkLlmProvider(provider, prompt);
        if (result) {
            results.push(result);
        }
    }

    return results;
}

export async function saveBenchmarkResults(results: BenchmarkResult[]) {
    await db.providerBenchmarkResult.createMany({
        data: results.map((result) => ({
            providerId: result.provider,
            model: result.model,
            testPrompt: result.testPrompt,
            firstTokenTime: result.firstTokenTime,
            reasoningTokens: result.reasoningTokens,
            reasoningTime: result.reasoningTime,
            contentTokens: result.contentTokens,
            contentTime: result.contentTime,
            overallTokens: result.overallTokens,
            totalTime: result.totalTime,
        })),
    });
}
