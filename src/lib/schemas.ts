
import { z } from "zod";

export const projectRequestSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(30, { message: "Description must be at least 30 characters." }),
  features: z.string().min(20, { message: "Please list the desired features (min. 20 characters)." }),
  budget: z.string().optional().default(""),
  userId: z.string().min(1, { message: "User must be logged in." }),
  documentUrl: z.string().url().optional(),
  documentName: z.string().optional(),
});

export type ProjectRequestInput = z.infer<typeof projectRequestSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  photoURL: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
});

export type ProfileInput = z.infer<typeof profileSchema>;
