import { useTheme } from "next-themes";
import Image from "next/image";
import { cn } from "~/lib/utils";

interface OrgLogo {
  name: string;
  light: string;
  dark?: string;
}

const orgLogos: OrgLogo[] = [
  { name: "openai", light: "openai.svg", dark: "openai-dark.png" },
  { name: "anthropic", light: "anthropic.svg", dark: "anthropic-dark.png" },
  { name: "google", light: "google.svg" },
  { name: "meta", light: "meta.svg" },
  { name: "mistral", light: "mistral.svg" },
  { name: "deepseek", light: "deepseek.webp" },
  { name: "alibaba", light: "alibaba.png" },
  { name: "huggingface", light: "huggingface.svg" },
  { name: "cohere", light: "cohere.png" },
  { name: "amazon", light: "amazon.svg", dark: "amazon-dark.svg" },
  { name: "microsoft", light: "microsoft.svg" },
  { name: "nvidia", light: "nvidia.svg" },
  { name: "xai", light: "xai.svg", dark: "xai-dark.png" },
  { name: "qwen", light: "qwen.png" },
  { name: "ai21", light: "ai21.jpg" },
  { name: "moonshotai", light: "moonshotai.jpg" },
];

interface OrgLogoProps {
  org: string;
  className?: string;
}

export function OrgLogo({ org, className = "" }: OrgLogoProps) {
  const { theme } = useTheme();
  const logoConfig = orgLogos.find(
    (logo) => logo.name.toLowerCase() === org.toLowerCase(),
  );

  if (!logoConfig) {
    return null;
  }

  const logoPath =
    theme === "dark" && logoConfig.dark
      ? `/org-logos/${logoConfig.dark}`
      : `/org-logos/${logoConfig.light}`;

  return (
    <div className={cn("relative h-6 w-6 flex-shrink-0", className)}>
      <Image
        src={logoPath}
        alt={`${org} logo`}
        fill
        className="object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}
