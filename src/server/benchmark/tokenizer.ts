import { encodingForModel, TiktokenModel } from "js-tiktoken";

/**
 * Count tokens in text. Uses tiktoken for OpenAI models if available,
 * falls back to simple counting if tiktoken fails.
 * 
 * Since most of models has same tokenizer, so here we use gpt-4o as default model.
 */
export function countTokenLength(
    text: string,
    options: {
        model?: TiktokenModel;
    } = {}
): number {
    const {
        model = 'gpt-4o',
    } = options;

    try {
        const enc = encodingForModel(model);
        const tokens = enc.encode(text);
        const count = tokens.length;
        return count;
    } catch (error) {
        // Fallback to simple counting for other providers
        console.warn('Token counting error, falling back to simple counting:', error);
        return text.trim().split(/\s+/).filter(Boolean).length;
    }
}
