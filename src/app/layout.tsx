import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { ThemeProvider } from "next-themes";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "LLM Leaderboard",
  description: "LLM Leaderboard, LLM Benchmarks, performance",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${GeistSans.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <TRPCReactProvider>
            <main className="flex min-h-screen flex-col items-center">
              {children}
            </main>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
