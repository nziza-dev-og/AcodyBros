
"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export const projectRequestSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(30, { message: "Description must be at least 30 characters." }),
  features: z.string().min(20, { message: "Please list the desired features (min. 20 characters)." }),
  budget: z.string().optional(),
  userId: z.string().min(1, { message: "User must be logged in." }),
});

export type ProjectRequestInput = z.infer<typeof projectRequestSchema>;

export async function submitProjectRequest(data: ProjectRequestInput) {
  const validatedFields = projectRequestSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Invalid data.",
    };
  }
  
  try {
    await addDoc(collection(db, "projectRequests"), {
      ...validatedFields.data,
      status: "pending",
      submittedAt: serverTimestamp(),
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin");

    return { success: "Project request submitted successfully!" };
  } catch (error) {
    console.error("Error submitting project request: ", error);
    return {
      error: "There was an error submitting your request. Please try again.",
    };
  }
}
