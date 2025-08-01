'use server';
/**
 * @fileOverview A streaming chat flow that uses Gemini to generate responses.
 *
 * - chat - A function that handles the streaming chat process.
 */

import { ai } from '@/ai/genkit';
import type { Part } from '@genkit-ai/googleai';
import type { ChatInput } from '@/ai/types';

export async function chat(
  input: ChatInput
) {
  const { history, message } = input;
  const historyGenkit: Part[] = history.map((msg) => ({
    role: msg.role,
    content: msg.content.map((c) => ({ text: c.text })),
  }));

  const { stream } = ai.generateStream({
    prompt: message,
    history: historyGenkit,
  });

  return stream;
}
