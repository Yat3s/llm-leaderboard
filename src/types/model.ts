export interface ModelBenchmark {
    modelId: string;
    name: string;
    organization: string;
    params: number | null;
    context: number;
    releaseDate: string;
    license: string;
    price: number;
    throughput: number;
    latency: number;
    paperLink: string | null;
    multimodal: number;
    scorecardBlogLink: string | null;
    pricePerInputToken: number | null;
    pricePerOutputToken: number | null;
    benchmarks: BenchmarkScore[];
}

export interface BenchmarkScore {
    datasetName: string;
    score: number;
    isSelfReported: number;
    analysisMethod: string;
    dateRecorded: string;
    sourceLink: string;
}