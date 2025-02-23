# LLM Leaderboard

A comprehensive platform for benchmarking and comparing Large Language Models (LLMs) across different providers. This project helps developers and researchers evaluate LLM performance, costs, and capabilities.

![screenshot](https://github.com/user-attachments/assets/8e20bc22-41fe-4316-8363-5fe06978b4d7)

## Features

- Real-time benchmarking of LLM providers
- Performance metrics tracking (latency, tokens/sec)
- Provider comparison dashboard
- Historical performance data
- Authentication for running custom benchmarks

## Tech Stack

- [Next.js](https://nextjs.org) - React framework for web applications
- [NextAuth.js](https://next-auth.js.org) - Authentication solution
- [Prisma](https://prisma.io) - Type-safe database ORM
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [tRPC](https://trpc.io) - End-to-end typesafe APIs
- [OpenAI SDK](https://github.com/openai/openai-node) - For LLM API interactions

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up your environment variables:

```bash
cp .env.example .env
```

Required environment variables:

- `DATABASE_URL`
- `DEEPSEEK_API_KEY`
- `ALIBABA_API_KEY`
- `SILICONFLOW_API_KEY`
- `VOLCENGINE_API_KEY`
- `TENCENT_API_KEY`

4. Run the development server:

```bash
pnpm dev
```

## Running Benchmarks Locally

To run benchmarks against supported LLM providers:

```bash
pnpm benchmark
```

This will execute the test suite and output performance metrics for each provider.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.
