import * as dotenv from "dotenv";
import { join } from "path";
import { fileURLToPath } from "url";

// Get project root directory and load .env file
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "../..");
dotenv.config({ path: join(rootDir, ".env") });

import { runBenchmarks } from "~/server/benchmark/benchmark";
import { TEST_CASES } from "~/server/benchmark/test-cases";
import { getModelProviders } from "../constants/llm-providers";
async function main() {
    // Verify required environment variables
    const requiredEnvVars = [
        "DEEPSEEK_API_KEY",
        "ALIBABA_API_KEY",
        "SILICONFLOW_API_KEY",
        "VOLCENGINE_API_KEY",
        "VOLCENGINE_MODEL",
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
    }
}

// Run tests
main().catch((error) => {
    console.error("Error occurred during testing:", error);
    process.exit(1);
}); 