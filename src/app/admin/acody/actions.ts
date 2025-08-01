'use server';

import { chat, type ChatInput, type ChatOutput } from '@/ai/flows/acody-chat-flow';

export async function getAcodyResponse(
    input: ChatInput,
    callback: (chunk: ChatOutput) => void
) {
    await chat(input, callback);
}
