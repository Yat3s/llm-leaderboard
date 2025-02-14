export type ModelProvider = {
    id: string;
    name: string;
    apiKey: string;
    baseUrl: string;
    model: string;
};

export function getModelProviders(): ModelProvider[] {
    return [
        // {
        //     id: "deepseek-official",
        //     name: "DeepSeek 官方",
        //     apiKey: process.env.DEEPSEEK_API_KEY!,
        //     baseUrl: "https://api.deepseek.com",
        //     model: "deepseek-reasoner"
        // },
        // {
        //     id: "alibaba",
        //     name: "阿里云/百炼",
        //     apiKey: process.env.ALIBABA_API_KEY!,
        //     baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        //     model: "deepseek-r1"
        // },
        // {
        //     id: "siliconflow-pro",
        //     name: "硅基流动 Pro",
        //     apiKey: process.env.SILICONFLOW_API_KEY!,
        //     baseUrl: "https://api.siliconflow.cn/v1",
        //     model: "Pro/deepseek-ai/DeepSeek-R1"
        // },
        // {
        //     id: "volcengine",
        //     name: "火山引擎",
        //     apiKey: process.env.VOLCENGINE_API_KEY!,
        //     baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
        //     model: process.env.VOLCENGINE_MODEL!
        // },
        {
            id: "tencent",
            name: "腾讯云",
            apiKey: process.env.TENCENT_API_KEY!.trim(),
            baseUrl: "https://api.lkeap.cloud.tencent.com/v1",
            model: "deepseek-r1"
        }
    ];
}


