import * as dotenv from "dotenv";
import fs from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";

// Get project root directory and load .env file
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "../..");
dotenv.config({ path: join(rootDir, ".env") });

import { runBenchmarks } from "~/server/benchmark/benchmark";
import { TEST_CASES } from "~/server/benchmark/test-cases";
import { getModelProviders } from "../lib/llm-providers";

const PROVIDER_BENCHMARKS_PATH = join(rootDir, "src/data/provider-benchmarks.json");

async function main() {
    // Verify required environment variables
    const requiredEnvVars = [
        "DEEPSEEK_API_KEY",
        "ALIYUN_API_KEY",
        "SILICONFLOW_API_KEY",
        "VOLCENGINE_API_KEY",
        "VOLCENGINE_API_ENDPOINT",
        "TENCENT_API_KEY",
    ];

    const missingEnvVars = requiredEnvVars.filter(
        (envVar) => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
        console.error("Missing required environment variables:", missingEnvVars.join(", "));
    }
    // print all env vars
    console.log("Environment variables:");
    for (const envVar of requiredEnvVars) {
        console.log(`${envVar}: ${process.env[envVar]}`);
    }

    console.log("Starting LLM Benchmark test...\n");

    const modelProviders = getModelProviders();
    const allResults = [];

    // Run each test case
    for (const testCase of TEST_CASES) {
        console.log(`\nExecuting test case: ${testCase.name}`);
        console.log("================================");

        const results = await runBenchmarks(modelProviders, testCase.prompt);

        // Print summary results
        console.log("\nTest Results Summary:");
        results.forEach((result) => {
            if (result) {
                console.log(`\n${result.providerId}:`);
                console.log(`- First token response time: ${result.firstTokenTime?.toFixed(2) ?? "N/A"} seconds`);
                console.log(`- Overall speed: ${(result.overallTokens / result.totalTime).toFixed(2)} tokens/s`);
            }
        });

        // Add results to allResults array with createdAt timestamp
        allResults.push(...results.map(result => ({
            ...result,
            createdAt: new Date().toISOString()
        })));
    }

    // Read existing results
    let existingResults = [];
    try {
        const content = await fs.readFile(PROVIDER_BENCHMARKS_PATH, 'utf-8');
        existingResults = JSON.parse(content);
    } catch (error) {
        console.log("No existing results found or error reading file");
    }

    // Combine existing and new results
    const combinedResults = [...existingResults, ...allResults];

    // Save to JSON file
    await fs.writeFile(
        PROVIDER_BENCHMARKS_PATH,
        JSON.stringify(combinedResults, null, 2)
    );

    console.log(`\nResults saved to ${PROVIDER_BENCHMARKS_PATH}`);
}

// Run tests
main().catch((error) => {
    console.error("Error occurred during testing:", error);
    process.exit(1);
}); 