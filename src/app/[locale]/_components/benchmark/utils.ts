
interface BenchmarkSummary {
    providerId: string;
    firstTokenTime: number;
    reasoningTokensPerSecond: number;
    contentTokensPerSecond: number;
    tokensPerSecond: number;
}

export const calculateAverageBenchmarks = (
    benchmarkResults: {
        providerId: string;
        firstTokenTime: number | null;
        reasoningTime: number;
        contentTime: number;
        totalTime: number;
        reasoningTokens: number;
        contentTokens: number;
        overallTokens: number;
    }[],
): BenchmarkSummary[] => {
    // Group results by providerId
    const resultsByProvider = benchmarkResults.reduce((map, result) => {
        const results = map.get(result.providerId) ?? [];
        results.push(result);
        map.set(result.providerId, results);
        return map;
    }, new Map<string, (typeof benchmarkResults)[number][]>());

    // Calculate averages for each provider
    const averages = Array.from(resultsByProvider.entries()).map(
        ([providerId, results]) => {
            const avgFirstTokenTime =
                results.reduce((sum, r) => sum + (r.firstTokenTime ?? 0), 0) /
                results.length;
            const avgReasoningTokensPerSecond =
                results.reduce(
                    (sum, r) => sum + r.reasoningTokens / (r.reasoningTime / 1000),
                    0,
                ) / results.length;
            const avgContentTokensPerSecond =
                results.reduce(
                    (sum, r) => sum + r.contentTokens / (r.contentTime / 1000),
                    0,
                ) / results.length;
            const avgTokensPerSecond =
                results.reduce(
                    (sum, r) => sum + r.overallTokens / (r.totalTime / 1000),
                    0,
                ) / results.length;

            return {
                providerId,
                firstTokenTime: avgFirstTokenTime,
                reasoningTokensPerSecond: avgReasoningTokensPerSecond,
                contentTokensPerSecond: avgContentTokensPerSecond,
                tokensPerSecond: avgTokensPerSecond,
            };
        },
    );

    // Sort by average tokens per second
    return averages.sort((a, b) => b.tokensPerSecond - a.tokensPerSecond);
};