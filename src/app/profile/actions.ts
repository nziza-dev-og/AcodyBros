
'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { profileSchema } from '@/lib/schemas';

type ProfileData = z.infer<typeof profileSchema>;

export async function updateUserProfile(userId: string, data: ProfileData) {
    try {
        if (!userId) {
            return { success: false, error: "User not authenticated." };
        }

        const validatedFields = profileSchema.safeParse(data);

        if (!validatedFields.success) {
            return { success: false, error: "Invalid data provided." };
        }

        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, validatedFields.data);

        revalidatePath('/profile');
        revalidatePath('/admin/users');
        revalidatePath('/about');

        return { success: true, message: "Profile updated successfully." };
    } catch (error) {
        console.error("Error updating profile: ", error);
        return { success: false, error: "Failed to update profile." };
    }
}
