"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  // Get the current locale
  const currentLocale = i18n.language;

  // Function to get the path for a different locale
  const getLocalizedPath = (locale: string) => {
    // Remove the current locale from the path
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "");
    return `/${locale}${pathWithoutLocale}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={getLocalizedPath("en")}
        className={cn(
          "text-sm font-medium transition-colors hover:text-foreground",
          currentLocale === "en" ? "text-foreground" : "text-muted-foreground",
        )}
      >
        EN
      </Link>
      <span className="text-muted-foreground">|</span>
      <Link
        href={getLocalizedPath("zh")}
        className={cn(
          "text-sm font-medium transition-colors hover:text-foreground",
          currentLocale === "zh" ? "text-foreground" : "text-muted-foreground",
        )}
      >
        中文
      </Link>
    </div>
  );
}
