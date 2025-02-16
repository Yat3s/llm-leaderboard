export type ModelProvider = {
    id: string;
    name: string;
    logo: string;
    platform: {
        apiKey: string | undefined;
        baseUrl: string;
        endpoint: string;
        model: string;
        developerPortal: string;
    }
    price?: {
        input: number; // per million tokens
        output: number; // per million tokens
        trial: string;
        docUrl: string;
    }
};

export function getModelProviders(): ModelProvider[] {
    return [
        {
            id: "baidu",
            name: "百度千帆",
            logo: "https://bce.bdstatic.com/img/favicon.ico",
            platform: {
                apiKey: process.env.BAIDU_API_KEY,
                baseUrl: "https://qianfan.baidubce.com/v2",
                endpoint: "deepseek-r1",
                model: "deepseek-r1",
                developerPortal: "https://console.bce.baidu.com/qianfan/ais/console/onlineService"
            },
            price: {
                input: 2,
                output: 8,
                trial: "目前免费调用",
                docUrl: "https://console.bce.baidu.com/qianfan/ais/console/onlineService"
            }
        },
        {
            id: "ctyun",
            name: "天翼云",
            logo: "https://www.ctyun.cn/favicon.ico",
            platform: {
                apiKey: process.env.CTYUN_API_KEY,
                baseUrl: "https://wishub-x1.ctyun.cn/v1",
                endpoint: "7ba7726dad4c4ea4ab7f39c7741aea68",
                model: "deepseek-r1",
                developerPortal: "https://huiju.ctyun.cn/modelSquare/?regionId=200000001852"
            },
            price: {
                input: 0,
                output: 0,
                trial: "目前免费调用",
                docUrl: "https://huiju.ctyun.cn/modelSquare/?regionId=200000001852"
            }
        },
        {
            id: "deepseek-official",
            name: "DeepSeek 官方",
            logo: "https://custom.typingmind.com/assets/models/deepseek.png",
            platform: {
                apiKey: process.env.DEEPSEEK_API_KEY,
                baseUrl: "https://api.deepseek.com",
                endpoint: "deepseek-reasoner",
                model: "deepseek-r1",
                developerPortal: "https://platform.deepseek.com/api_keys"
            },
            price: {
                input: 3.6,
                output: 16,
                trial: "0",
                docUrl: "https://platform.deepseek.com/api_keys"
            }
        },
        {
            id: "siliconflow",
            name: "硅基流动",
            logo: "https://framerusercontent.com/images/4li2PjWxZJmoGkzXRMJWU1rJmI.svg",
            platform: {
                apiKey: process.env.SILICONFLOW_API_KEY,
                baseUrl: "https://api.siliconflow.cn/v1",
                endpoint: "deepseek-ai/DeepSeek-R1",
                model: "deepseek-r1",
                developerPortal: "https://cloud.siliconflow.cn/account/ak"
            },
            price: {
                input: 4,
                output: 16,
                trial: "注册赠送 14 元",
                docUrl: "https://cloud.siliconflow.cn/account/ak"
            }
        },
        // {
        //     id: "siliconflow-pro",
        //     name: "硅基流动 Pro",
        //     logo: "https://framerusercontent.com/images/4li2PjWxZJmoGkzXRMJWU1rJmI.svg",
        //     platform: {
        //         apiKey: process.env.SILICONFLOW_API_KEY,
        //         baseUrl: "https://api.siliconflow.cn/v1",
        //         endpoint: "Pro/deepseek-ai/DeepSeek-R1",
        //         model: "deepseek-r1",
        //         developerPortal: "https://cloud.siliconflow.cn/account/ak"
        //     },
        // price: {
        //     input: 4,
        //     output: 16,
        //     trialTokens: 1000000,
        //     docUrl: "https://cloud.siliconflow.cn/account/ak"
        // }
        // },
        {
            id: "aliyun",
            name: "阿里云百炼",
            logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/alibabacloud-color.png",
            platform: {
                apiKey: process.env.ALIYUN_API_KEY,
                baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
                endpoint: "deepseek-r1",
                model: "deepseek-r1",
                developerPortal: "https://bailian.console.aliyun.com/?apiKey=1#/api-key"
            },
            price: {
                input: 2,
                output: 8,
                trial: "1,000,000 tokens",
                docUrl: "https://bailian.console.aliyun.com/#/model-market/detail/deepseek-r1"
            }
        },
        {
            id: "volcengine",
            name: "火山方舟/火山引擎",
            logo: "https://portal.volccdn.com/obj/volcfe/bee_prod/biz_950/tos_af0d0ca8b1a6c9d1b74baf3ff7292238.svg",
            platform: {
                apiKey: process.env.VOLCENGINE_API_KEY,
                baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
                endpoint: process.env.VOLCENGINE_API_ENDPOINT!,
                model: "deepseek-r1",
                developerPortal: "https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey?apikey=%7B%7D"
            },
            price: {
                input: 2,
                output: 8,
                trial: "500,000 tokens",
                docUrl: "https://console.volcengine.com/ark/region:ark+cn-beijing/openManagement?LLM=%7B%7D&OpenTokenDrawer=false"
            }
        },
        {
            id: "tencentcloud",
            name: "腾讯云",
            logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Tencent_Cloud_Logo.svg",
            platform: {
                apiKey: process.env.TENCENT_API_KEY,
                baseUrl: "https://api.lkeap.cloud.tencent.com/v1",
                endpoint: "deepseek-r1",
                model: "deepseek-r1",
                developerPortal: "https://console.cloud.tencent.com/lkeap"
            },
            price: {
                input: 26,
                output: 75,
                trial: "500,000 tokens",
                docUrl: "https://cloud.tencent.com/document/product/1759/106152",
            }
        }
    ];
}


