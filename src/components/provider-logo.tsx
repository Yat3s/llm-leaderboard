import { useTheme } from "next-themes";
import Image from "next/image";
import { cn } from "~/lib/utils";

interface ProviderLogo {
  name: string;
  light: string;
  dark?: string;
}

const providerLogos: ProviderLogo[] = [
  { name: "baidu", light: "baidu.ico" },
  { name: "ctyun", light: "ctyun.ico" },
  { name: "deepseek-official", light: "deepseek.webp" },
  { name: "siliconflow", light: "siliconflow.svg" },
  { name: "aliyun", light: "aliyun.webp" },
  { name: "volcengine", light: "volcengine.svg" },
  { name: "tencentcloud", light: "tencentcloud.svg" },
];

interface ProviderLogoProps {
  provider: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ProviderLogo({
  provider,
  className = "",
  width = 24,
  height = 24,
}: ProviderLogoProps) {
  const { theme } = useTheme();
  const logoConfig = providerLogos.find(
    (logo) => logo.name.toLowerCase() === provider.toLowerCase(),
  );

  if (!logoConfig) {
    return null;
  }

  const logoPath =
    theme === "dark" && logoConfig.dark
      ? `/provider-logos/${logoConfig.dark}`
      : `/provider-logos/${logoConfig.light}`;

  return (
    <div className={cn("relative flex-shrink-0", className)}>
      <Image
        src={logoPath}
        alt={`${provider} logo`}
        width={width}
        height={height}
        className="object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}
