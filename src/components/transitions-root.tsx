/* eslint-disable */
"use client";

import { useQuery } from "@tanstack/react-query";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import initTranslations from "~/app/i18n";

const NAME_SPACES = ["default"];

interface TranslationsRootProps {
  children: React.ReactNode;
  locale: string;
}

const fetchTranslations = async (locale: string) => {
  const { resources } = await import("~/app/i18n").then((mod) =>
    mod.default(locale, NAME_SPACES),
  );
  return resources;
};

const TranslationsRoot = ({ children, locale }: TranslationsRootProps) => {
  const { data: resources } = useQuery({
    queryKey: ["translations", locale],
    queryFn: () => fetchTranslations(locale),
  });

  if (!resources) return null;

  return (
    <TranslationsProvider
      locale={locale}
      namespaces={NAME_SPACES}
      resources={resources}
    >
      {children}
    </TranslationsProvider>
  );
};

export default TranslationsRoot;

interface TranslationsProviderProps {
  children: React.ReactNode;
  locale: string | undefined;
  namespaces: string[];
  resources: any;
}

function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: TranslationsProviderProps) {
  const i18n = createInstance();
  initTranslations(locale, namespaces, i18n, resources);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
