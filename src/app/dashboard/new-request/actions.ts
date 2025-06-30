
"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { projectRequestSchema, type ProjectRequestInput } from "@/components/dashboard/ProjectRequestForm";

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
