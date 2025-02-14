export interface StreamingMetrics {
    requestStartTime: number;

    // Timing metrics
    firstTokenTime: number | null;
    reasoningTiming: { start: number | null; end: number | null };
    contentTiming: { start: number | null; end: number | null };

    // Token metrics
    reasoningTokens: number;
    contentTokens: number;
    overallTokens: number;

    // Text metrics
    reasoningText: string;
    contentText: string;
}

export function calculateTimes(metrics: StreamingMetrics) {
    const totalTime = (Date.now() - metrics.requestStartTime);
    const reasoningTime = metrics.reasoningTiming.start && metrics.reasoningTiming.end
        ? (metrics.reasoningTiming.end - metrics.reasoningTiming.start)
        : 0;
    const contentTime = metrics.contentTiming.start && metrics.contentTiming.end
        ? (metrics.contentTiming.end - metrics.contentTiming.start)
        : 0;

    return { totalTime, reasoningTime, contentTime };
}


export function logMetrics(provider: string, metrics: StreamingMetrics, times: { totalTime: number; reasoningTime: number; contentTime: number }) {
    console.log(`\n\n[${provider}]`);
    if (metrics.firstTokenTime !== null) {
        console.log(`First token response time: ${(metrics.firstTokenTime / 1000).toFixed(2)} seconds`);
    } else {
        console.log("No token response received.");
    }

    console.log(
        `Reasoning part: ${metrics.reasoningTokens} tokens, ` +
        `time: ${times.reasoningTime} ms, ` +
        `generation speed: ${(times.reasoningTime > 0 ? metrics.reasoningTokens / times.reasoningTime / 1000 : 0)} tokens/s`
    );

    console.log(
        `Content part: ${metrics.contentTokens} tokens, ` +
        `time: ${times.contentTime} ms, ` +
        `generation speed: ${(times.contentTime > 0 ? metrics.contentTokens / times.contentTime / 1000 : 0)} tokens/s`
    );

    console.log(
        `Overall generation: ${metrics.overallTokens} tokens, ` +
        `total time: ${times.totalTime} ms, ` +
        `generation speed: ${(times.totalTime > 0 ? metrics.overallTokens / times.totalTime / 1000 : 0)} tokens/s`
    );
}