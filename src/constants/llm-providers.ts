export type ModelProvider = {
    id: string;
    name: string;
    logo: string;
    apiKey: string | undefined;
    baseUrl: string;
    endpoint: string;
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
        {
            id: "siliconflow",
            name: "硅基流动",
            logo: "https://framerusercontent.com/images/4li2PjWxZJmoGkzXRMJWU1rJmI.svg",
            apiKey: process.env.SILICONFLOW_API_KEY, // https://cloud.siliconflow.cn/account/ak
            baseUrl: "https://api.siliconflow.cn/v1",
            endpoint: "deepseek-ai/DeepSeek-R1",
            model: "deepseek-r1"
        },
        {
            id: "siliconflow-pro",
            name: "硅基流动 Pro",
            logo: "https://framerusercontent.com/images/4li2PjWxZJmoGkzXRMJWU1rJmI.svg",
            apiKey: process.env.SILICONFLOW_API_KEY, // https://cloud.siliconflow.cn/account/ak
            baseUrl: "https://api.siliconflow.cn/v1",
            endpoint: "Pro/deepseek-ai/DeepSeek-R1",
            model: "deepseek-r1"
        },
        {
            id: "aliyun",
            name: "阿里云百炼",
            logo: "https://portal.volccdn.com/obj/volcfe/bee_prod/biz_950/tos_af0d0ca8b1a6c9d1b74baf3ff7292238.svg",
            apiKey: process.env.ALIYUN_API_KEY, // https://bailian.console.aliyun.com/?apiKey=1#/api-key
            baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
            endpoint: "deepseek-r1",
            model: "deepseek-r1",
        },
        {
            id: "volcengine",
            name: "火山方舟/火山引擎",
            logo: "https://portal.volccdn.com/obj/volcfe/bee_prod/biz_950/tos_af0d0ca8b1a6c9d1b74baf3ff7292238.svg",
            apiKey: process.env.VOLCENGINE_API_KEY, // https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey?apikey=%7B%7D
            baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
            endpoint: process.env.VOLCENGINE_API_ENDPOINT!,
            model: "deepseek-r1",
        },
        {
            id: "tencentcloud",
            name: "腾讯云",
            logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Tencent_Cloud_Logo.svg",
            apiKey: process.env.TENCENT_API_KEY, // https://console.cloud.tencent.com/lkeap
            baseUrl: "https://api.lkeap.cloud.tencent.com/v1",
            endpoint: "deepseek-r1",
            model: "deepseek-r1",
        }
    ];
}


