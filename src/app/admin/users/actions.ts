
'use server';

import { db, storage } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, deleteDoc, where } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { revalidatePath } from 'next/cache';

export interface User {
    uid: string;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'client';
    photoURL?: string;
    description?: string;
}

export async function getUsers(): Promise<User[]> {
    try {
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, orderBy('name'));
        const userSnapshot = await getDocs(q);

        const users = userSnapshot.docs.map(doc => ({
            ...doc.data(),
        })) as User[];
        
        return users;

    } catch (error) {
        console.error("Error fetching users: ", error);
        return [];
    }
}


export async function deleteUser(userId: string) {
    if (!userId) {
        return { success: false, error: "User ID is required." };
    }
    
    try {
        // Step 1: Delete user's project requests and associated files
        const requestsCollectionRef = collection(db, 'projectRequests');
        const q = query(requestsCollectionRef, where('userId', '==', userId));
        const requestSnapshot = await getDocs(q);

        const deletionPromises = requestSnapshot.docs.map(async (docSnapshot) => {
            const requestData = docSnapshot.data();
            // Delete associated file from storage
            if (requestData.documentUrl) {
                try {
                    const fileRef = ref(storage, requestData.documentUrl);
                    await deleteObject(fileRef);
                } catch (storageError: any) {
                     if (storageError.code !== 'storage/object-not-found') {
                        console.error(`Failed to delete file for request ${docSnapshot.id}:`, storageError);
                     }
                }
            }
            // Delete the request document
            return deleteDoc(docSnapshot.ref);
        });
        
        await Promise.all(deletionPromises);

        // Step 2: Delete user document from Firestore
        const userDocRef = doc(db, 'users', userId);
        await deleteDoc(userDocRef);

        revalidatePath('/admin/users');
        revalidatePath('/admin/requests');
        revalidatePath('/dashboard');

        return { success: true };

    } catch (error) {
        console.error("Error deleting user and their data:", error);
        return { success: false, error: "An error occurred while deleting the user." };
    }
}
