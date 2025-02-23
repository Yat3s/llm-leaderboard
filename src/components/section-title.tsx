import { PulsingDot } from "./ui/pulsing-dot";

interface SectionTitleProps {
  title: string;
  description?: string;
  updatedAt?: Date;
}

export function SectionTitle({
  title,
  description,
  updatedAt,
}: SectionTitleProps) {
  return (
    <div className="space-y-2 px-4 md:space-y-4 md:px-0">
      <h1 className="text-2xl font-bold md:text-4xl">{title}</h1>
      {(description ?? updatedAt) && (
        <div className="flex flex-col gap-1 text-xs text-muted-foreground md:flex-row md:items-center md:gap-0 md:text-sm">
          <p>{description}</p>
          {updatedAt && (
            <div className="flex items-center md:ml-2">
              <PulsingDot className="mt-0.5 md:mt-0" />
              <span className="ml-2">
                自动更新于 {updatedAt.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
