import { Message } from "../lib/benchmark";

export const TEST_CASES = [
    {
        name: "Chinese Poetry",
        messages: [{
            role: "user",
            content: "给我写一首七言绝句，赞美祖国的大好河山，不要其他多余的解释",
        }] as Message[],
    },
];