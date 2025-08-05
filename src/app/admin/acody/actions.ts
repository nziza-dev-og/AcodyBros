
'use server';

import { getAcodyResponse as getAcodyResponseStream, type ChatInput } from '@/ai/flows/acody-chat-flow';

export async function getAcodyResponse(
    input: ChatInput,
) {
    return await getAcodyResponseStream(input);
}
