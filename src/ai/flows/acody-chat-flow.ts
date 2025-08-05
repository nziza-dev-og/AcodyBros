
'use server';
/**
 * @fileOverview A streaming chat flow that uses Gemini to generate responses.
 *
 * - chat - A function that handles the streaming chat process.
 */

import { ai } from '@/ai/genkit';
import type { Part } from '@genkit-ai/googleai';
import type { ChatInput, Message } from '@/ai/types';

export async function getAcodyResponse(
  input: ChatInput
) {
  const { history, message, mode } = input;
  
  if (mode === 'writer') {
    const { stream } = ai.generateStream({
      prompt: `You are an expert project manager and business analyst. A user will provide a prompt with their idea for a project. Your task is to expand on this idea and generate a structured project brief.

      Based on the user's prompt, create:
      1.  A clear and concise project **title**.
      2.  A detailed project **description** that covers the project's purpose, goals, and intended audience.
      3.  A list of **key features** that would be essential for the project. Format this as a bulleted or numbered list.
      
      User's Idea: ${message}
      
      Provide your response as a single, raw JSON object string that can be parsed with JSON.parse(). The JSON object must conform to the following structure: { "title": "...", "description": "...", "keyFeatures": "..." }. Do not wrap the JSON in markdown backticks or any other formatting.`,
      model: 'googleai/gemini-1.5-flash-latest',
      config: {
        temperature: 0.5,
      }
    });
    return stream;
  }

  // Regular chat mode
  const historyGenkit: Part[] = history.map((msg: Message) => ({
    role: msg.role,
    content: msg.content.map((c: { text: string }) => ({ text: c.text })),
  }));

  const { stream } = ai.generateStream({
    prompt: message,
    history: historyGenkit,
    model: 'googleai/gemini-1.5-flash-latest',
  });

  return stream;
}
