import { motion } from "framer-motion";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getModelProviders } from "~/constants/llm-providers";

export const ProviderPricingTable = () => {
  const providers = getModelProviders();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <div className="flex items-end gap-2">
        <h1 className="text-4xl font-bold">DeepSeek R1 价格</h1>
      </div>
      <div className="mt-6 rounded-lg border p-4 shadow-md shadow-muted/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>服务商</TableHead>
              <TableHead>输入价格 (每百万 Tokens)</TableHead>
              <TableHead>输出价格 (每百万 Tokens)</TableHead>
              <TableHead>免费额度</TableHead>
              <TableHead>价格详情</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell className="flex items-center gap-2">
                  <Image
                    src={provider.logo}
                    alt={provider.name}
                    width={24}
                    height={24}
                  />
                  {provider.name}
                </TableCell>
                <TableCell>
                  {provider.price?.input
                    ? `¥${provider.price.input}`
                    : "未公布"}
                </TableCell>
                <TableCell>
                  {provider.price?.output
                    ? `¥${provider.price.output}`
                    : "未公布"}
                </TableCell>
                <TableCell>
                  {provider.price?.trial?.toLocaleString() ?? "未公布"}
                </TableCell>
                <TableCell>
                  {provider.price?.docUrl ? (
                    <a
                      href={provider.price.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      查看详情
                    </a>
                  ) : (
                    "暂无"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};
