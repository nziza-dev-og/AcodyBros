
"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { projectRequestSchema, type ProjectRequestInput } from "@/lib/schemas";

export async function submitProjectRequest(data: ProjectRequestInput) {
  const validatedFields = projectRequestSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error.flatten().fieldErrors);
    return {
      error: "Invalid data. Please check the form and try again.",
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
