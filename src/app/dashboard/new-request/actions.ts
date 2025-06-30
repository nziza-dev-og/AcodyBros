
"use server";

import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { revalidatePath } from "next/cache";
import { projectRequestSchema } from "@/lib/schemas";
import { z } from "zod";

export async function submitProjectRequest(formData: FormData) {
  try {
    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      features: formData.get("features"),
      budget: formData.get("budget"),
      userId: formData.get("userId"),
    };
    
    const validationSchema = projectRequestSchema.omit({ documentUrl: true, documentName: true });
    const validatedFields = validationSchema.safeParse(rawData);

    if (!validatedFields.success) {
      console.error("Validation failed:", validatedFields.error.flatten().fieldErrors);
      return {
        error: "Invalid data. Please check the form and try again.",
      };
    }

    const file = formData.get("file") as File | null;
    const fileUrl = formData.get("fileUrl") as string | null;

    let documentUrl: string | undefined = undefined;
    let documentName: string | undefined = undefined;

    if (file && file.size > 0) {
      const storageRef = ref(storage, `project-docs/${validatedFields.data.userId}/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      documentUrl = await getDownloadURL(snapshot.ref);
      documentName = file.name;
    } else if (fileUrl) {
      const urlValidation = z.string().url().safeParse(fileUrl);
      if (urlValidation.success) {
        documentUrl = urlValidation.data;
        documentName = "Document Link";
      } else {
        return { error: "The provided URL is not valid." };
      }
    }

    const dataToSave = {
      ...validatedFields.data,
      status: "pending",
      submittedAt: serverTimestamp(),
      ...(documentUrl && { documentUrl }),
      ...(documentName && { documentName }),
    };

    await addDoc(collection(db, "projectRequests"), dataToSave);

    revalidatePath("/dashboard");
    revalidatePath("/admin/requests");

    return { success: "Project request submitted successfully!" };
  } catch (error) {
    console.error("Error submitting project request: ", error);
    return {
      error: "There was an error submitting your request. Please try again.",
    };
  }
}
