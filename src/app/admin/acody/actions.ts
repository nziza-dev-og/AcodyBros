'use server';

import { chat, type ChatInput } from '@/ai/flows/acody-chat-flow';

export async function getAcodyResponse(
    input: ChatInput,
) {
    return await chat(input);
}
