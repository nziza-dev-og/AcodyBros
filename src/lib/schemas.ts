import { z } from "zod";

export const projectRequestSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(30, { message: "Description must be at least 30 characters." }),
  features: z.string().min(20, { message: "Please list the desired features (min. 20 characters)." }),
  budget: z.string().optional(),
  userId: z.string().min(1, { message: "User must be logged in." }),
});

export type ProjectRequestInput = z.infer<typeof projectRequestSchema>;
