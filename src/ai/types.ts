import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(z.object({ text: z.string() })),
});

export const ChatInputSchema = z.object({
  history: z.array(MessageSchema),
  message: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export type ChatOutput = any;

export const ProjectBrieferInputSchema = z.object({
  prompt: z.string().describe('The user\'s initial idea or prompt for the project.'),
});
export type ProjectBrieferInput = z.infer<typeof ProjectBrieferInputSchema>;

export const ProjectBrieferOutputSchema = z.object({
  title: z.string().describe('A concise and descriptive title for the project.'),
  description: z
    .string()
    .describe('A detailed description of the project, its goals, and target audience.'),
  keyFeatures: z
    .string()
    .describe(
      'A bulleted or numbered list of the key features required for the project.'
    ),
});
export type ProjectBrieferOutput = z.infer<typeof ProjectBrieferOutputSchema>;
