"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

interface TabsProps {
  tabs: { href: string; label: string }[];
}

export function Tabs({ tabs }: TabsProps) {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium",
              pathname === tab.href
                ? "border-primary text-primary"
                : "text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground border-transparent",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
