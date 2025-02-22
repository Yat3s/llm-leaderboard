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
    <div className="space-y-4">
      <h1 className="text-4xl font-bold">{title}</h1>
      {(description || updatedAt) && (
        <p className="flex items-center text-sm text-muted-foreground">
          {description}
          {updatedAt && (
            <>
              <PulsingDot className="mx-2" />
              自动更新于 {updatedAt.toLocaleString()}
            </>
          )}
        </p>
      )}
    </div>
  );
}
