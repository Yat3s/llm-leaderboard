import OpenAI from "openai";
import { type ModelProvider } from "../constants/llm-providers";
import { countTokenLength } from "./tokenizer";

export interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

interface BenchmarkResult {
    provider: string;
    firstTokenTime: number | null;
    reasoningTokens: number;
    reasoningTime: number;
    contentTokens: number;
    contentTime: number;
    overallTokens: number;
    totalTime: number;
}

interface StreamingMetrics {
    reasoningTokens: number;
    contentTokens: number;
    overallTokens: number;
    reasoningText: string;
    contentText: string;
    firstTokenTime: number | null;
    reasoningTiming: { start: number | null; end: number | null };
    contentTiming: { start: number | null; end: number | null };
}

function initializeMetrics(startTime: number): StreamingMetrics {
    return {
        reasoningTokens: 0,
        contentTokens: 0,
        overallTokens: 0,
        reasoningText: "",
        contentText: "",
        firstTokenTime: null,
        reasoningTiming: { start: null, end: null },
        contentTiming: { start: null, end: null }
    };
}

function processStreamChunk(
    chunk: OpenAI.Chat.Completions.ChatCompletionChunk,
    metrics: StreamingMetrics,
    startTime: number
): void {
    const delta = chunk.choices[0]?.delta;
    const reasoningPiece = (delta as any).reasoning_content || "";
    const contentPiece = delta?.content || "";

    if (metrics.firstTokenTime === null && (reasoningPiece || contentPiece)) {
        metrics.firstTokenTime = Date.now() - startTime;
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

function calculateTimes(metrics: StreamingMetrics, startTime: number) {
    const totalTime = (Date.now() - startTime) / 1000;
    const reasoningTime = metrics.reasoningTiming.start && metrics.reasoningTiming.end
        ? (metrics.reasoningTiming.end - metrics.reasoningTiming.start) / 1000
        : 0;
    const contentTime = metrics.contentTiming.start && metrics.contentTiming.end
        ? (metrics.contentTiming.end - metrics.contentTiming.start) / 1000
        : 0;

    return { totalTime, reasoningTime, contentTime };
}

function logMetrics(provider: string, metrics: StreamingMetrics, times: { totalTime: number; reasoningTime: number; contentTime: number }) {
    console.log(`\n\n[${provider}]`);
    if (metrics.firstTokenTime !== null) {
        console.log(`First token response time: ${(metrics.firstTokenTime / 1000).toFixed(2)} seconds`);
    } else {
        console.log("No token response received.");
    }

    console.log(
        `Reasoning part: ${metrics.reasoningTokens} tokens, ` +
        `time: ${times.reasoningTime.toFixed(2)} seconds, ` +
        `generation speed: ${(times.reasoningTime > 0 ? metrics.reasoningTokens / times.reasoningTime : 0).toFixed(2)} tokens/s`
    );

    console.log(
        `Content part: ${metrics.contentTokens} tokens, ` +
        `time: ${times.contentTime.toFixed(2)} seconds, ` +
        `generation speed: ${(times.contentTime > 0 ? metrics.contentTokens / times.contentTime : 0).toFixed(2)} tokens/s`
    );

    console.log(
        `Overall generation: ${metrics.overallTokens} tokens, ` +
        `total time: ${times.totalTime.toFixed(2)} seconds, ` +
        `generation speed: ${(times.totalTime > 0 ? metrics.overallTokens / times.totalTime : 0).toFixed(2)} tokens/s`
    );
}

export async function testLlmProvider(
    provider: ModelProvider,
    messages: Message[]
): Promise<BenchmarkResult | null> {
    console.log("\n---------------------------");
    console.log(`Testing provider: ${provider.name}`);
    console.log("---------------------------\n");

    try {
        const client = new OpenAI({
            apiKey: provider.apiKey,
            baseURL: provider.baseUrl,
        });

        const startTime = Date.now();
        const metrics = initializeMetrics(startTime);

        const stream = await client.chat.completions.create({
            model: provider.model,
            messages,
            stream: true,
        });

        for await (const chunk of stream) {
            processStreamChunk(chunk, metrics, startTime);
        }

        const times = calculateTimes(metrics, startTime);
        logMetrics(provider.name, metrics, times);

        console.log("\n---------------------------\n");

        return {
            provider: provider.name,
            firstTokenTime: metrics.firstTokenTime ? metrics.firstTokenTime / 1000 : null,
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

export async function runBenchmarks(providers: ModelProvider[], messages: Message[]) {
    console.log(`Test started at: ${new Date().toLocaleString("en-US")}`);
    const results: (BenchmarkResult | null)[] = [];
    for (const provider of providers) {
        const result = await testLlmProvider(provider, messages);
        results.push(result);
    }

    return results;
}
