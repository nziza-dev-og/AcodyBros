"use server";

import { 
  estimateProjectComplexity, 
  type ProjectEstimatorInput, 
  type ProjectEstimatorOutput 
} from '@/ai/flows/project-estimator';

export async function getProjectEstimate(input: ProjectEstimatorInput): Promise<ProjectEstimatorOutput> {
  try {
    const result = await estimateProjectComplexity(input);
    return result;
  } catch (error) {
    console.error("Error in getProjectEstimate server action:", error);
    throw new Error("Failed to get project estimate from the AI flow.");
  }
}
