'use server';
/**
 * @fileOverview An AI-powered project briefer to assist clients in drafting project requests.
 *
 * - generateProjectBrief - A function that generates a project title, description, and key features.
 * - ProjectBrieferInput - The input type for the generateProjectBrief function.
 * - ProjectBrieferOutput - The return type for the generateProjectBrief function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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


const brieferPrompt = ai.definePrompt({
  name: 'projectBrieferPrompt',
  input: {schema: ProjectBrieferInputSchema},
  output: {schema: ProjectBrieferOutputSchema},
  prompt: `You are an expert project manager and business analyst. A user will provide a prompt with their idea for a project. Your task is to expand on this idea and generate a structured project brief.

Based on the user's prompt, create:
1.  A clear and concise project **title**.
2.  A detailed project **description** that covers the project's purpose, goals, and intended audience.
3.  A list of **key features** that would be essential for the project. Format this as a bulleted or numbered list.

User's Idea: {{{prompt}}}
`,
});

const projectBrieferFlow = ai.defineFlow(
  {
    name: 'projectBrieferFlow',
    inputSchema: ProjectBrieferInputSchema,
    outputSchema: ProjectBrieferOutputSchema,
  },
  async input => {
    const {output} = await brieferPrompt(input);
    return output!;
  }
);


export async function generateProjectBrief(
  input: ProjectBrieferInput
): Promise<ProjectBrieferOutput> {
  return projectBrieferFlow(input);
}
