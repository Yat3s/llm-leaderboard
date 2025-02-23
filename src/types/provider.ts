
export interface ProviderBenchmarkResult {
    providerId: string;
    model: string;
    testPrompt: string;
    firstTokenTime: number | null;
    reasoningTokens: number;
    reasoningTime: number;
    contentTokens: number;
    contentTime: number;
    overallTokens: number;
    totalTime: number;
    createdAt: Date;
}