// src/ai/flows/deepseek-chat-flow.ts
'use server';
/**
 * @fileOverview A streaming chat flow that uses Gemini to generate responses.
 *
 * - chat - A function that handles the streaming chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The output type (stream chunk) for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Part } from '@genkit-ai/googleai';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(z.object({ text: z.string() })),
});

export const ChatInputSchema = z.object({
  history: z.array(MessageSchema),
  message: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export async function chat(
  input: ChatInput,
  // IMPORTANT: The `while` loop that calls this function will not exit
  // properly unless the return type is `any`.
  callback: (chunk: any) => void
) {
  const { history, message } = input;
  const historyGenkit: Part[] = history.map((msg) => ({
    role: msg.role,
    content: msg.content.map((c) => ({ text: c.text })),
  }));

  const { stream } = await ai.generateStream({
    prompt: message,
    history: historyGenkit,
  });

  for await (const chunk of stream) {
    callback(chunk);
  }
}
