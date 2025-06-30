// src/ai/flows/project-estimator.ts
'use server';
/**
 * @fileOverview An AI-powered project complexity estimator for providing preliminary quotes to clients.
 *
 * - estimateProjectComplexity - A function that estimates project complexity and provides a preliminary quote.
 * - ProjectEstimatorInput - The input type for the estimateProjectComplexity function.
 * - ProjectEstimatorOutput - The return type for the estimateProjectComplexity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectEstimatorInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('A detailed description of the project requirements and scope.'),
  desiredFeatures: z.string().describe('List of desired features for the project.'),
  complexityLevel: z
    .enum(['low', 'medium', 'high'])
    .describe('The anticipated complexity level of the project.'),
});
export type ProjectEstimatorInput = z.infer<typeof ProjectEstimatorInputSchema>;

const ProjectEstimatorOutputSchema = z.object({
  estimatedComplexity: z
    .string()
    .describe('AI analysis of the project complexity based on the input.'),
  preliminaryQuote: z
    .string()
    .describe('A preliminary cost estimate for the project, taking into account complexity and features.'),
  estimatedTimeline: z
    .string()
    .describe('An estimated timeline for completing the project.'),
});
export type ProjectEstimatorOutput = z.infer<typeof ProjectEstimatorOutputSchema>;

export async function estimateProjectComplexity(
  input: ProjectEstimatorInput
): Promise<ProjectEstimatorOutput> {
  return projectEstimatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectEstimatorPrompt',
  input: {schema: ProjectEstimatorInputSchema},
  output: {schema: ProjectEstimatorOutputSchema},
  prompt: `You are an expert project manager specializing in software development projects.

You will use the project description, desired features, and complexity level to estimate the project's overall complexity, provide a preliminary quote, and estimate a timeline for completion.

Project Description: {{{projectDescription}}}
Desired Features: {{{desiredFeatures}}}
Complexity Level: {{{complexityLevel}}}

Consider all these factors when generating the complexity estimation, quote, and timeline.
`,
});

const projectEstimatorFlow = ai.defineFlow(
  {
    name: 'projectEstimatorFlow',
    inputSchema: ProjectEstimatorInputSchema,
    outputSchema: ProjectEstimatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
