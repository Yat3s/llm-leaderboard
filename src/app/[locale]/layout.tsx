import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import i18nConfig from "i18n.config";
import { dir } from "i18next";
import { ThemeProvider } from "next-themes";
import TranslationsRoot from "~/components/transitions-root";
import { TRPCReactProvider } from "~/trpc/react";
export const metadata: Metadata = {
  title: "LLM Leaderboard",
  description: "LLM Leaderboard, LLM Benchmarks, performance",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

type tParams = Promise<{ locale: string }>;

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: tParams }>) {
  const { locale } = await params;
  return (
    <html
      lang={locale}
      dir={dir(locale)}
      suppressHydrationWarning
      className={`${GeistSans.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <TRPCReactProvider>
            <TranslationsRoot locale={locale}>
              <main className="flex min-h-screen flex-col items-center">
                {children}
              </main>
            </TranslationsRoot>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
