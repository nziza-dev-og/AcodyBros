
'use server';

import { db, storage } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { revalidatePath } from 'next/cache';

export interface ProjectRequest {
    id: string;
    title: string;
    status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
    submittedAt: string;
    [key: string]: any;
}

export async function getProjectRequestsForUser(userId: string): Promise<ProjectRequest[]> {
    if (!userId) return [];

    try {
        const requestsCollectionRef = collection(db, 'projectRequests');
        const q = query(
            requestsCollectionRef, 
            where('userId', '==', userId)
        );
        const requestSnapshot = await getDocs(q);

        const requests = requestSnapshot.docs.map(doc => {
            const data = doc.data();
            const submittedAtTimestamp = data.submittedAt as Timestamp;
            return {
                id: doc.id,
                ...data,
                submittedAt: submittedAtTimestamp?.toDate ? submittedAtTimestamp.toDate().toISOString() : '',
            } as ProjectRequest;
        });

        // Sort by submittedAt descending.
        requests.sort((a, b) => {
            const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
            const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
            return timeB - timeA;
        });
        
        return requests;

    } catch (error) {
        console.error("Error fetching project requests: ", error);
        return [];
    }
}

export async function getProjectRequestDetails(requestId: string, userId: string): Promise<ProjectRequest | null> {
    if (!userId || !requestId) return null;

    try {
        const requestDocRef = doc(db, 'projectRequests', requestId);
        const requestDoc = await getDoc(requestDocRef);

        if (!requestDoc.exists() || requestDoc.data().userId !== userId) {
            return null;
        }

        const data = requestDoc.data();
        const submittedAtTimestamp = data.submittedAt as Timestamp;

        return { 
            id: requestDoc.id, 
            ...data, 
            submittedAt: submittedAtTimestamp?.toDate ? submittedAtTimestamp.toDate().toISOString() : '',
        } as ProjectRequest;

    } catch (error) {
        console.error("Error fetching project request details for user: ", error);
        return null;
    }
}


export async function deleteProjectRequestForUser(requestId: string, userId: string) {
    if (!userId || !requestId) {
        return { success: false, error: "Invalid input." };
    }

    try {
        const requestDocRef = doc(db, 'projectRequests', requestId);
        const requestDoc = await getDoc(requestDocRef);

        if (!requestDoc.exists() || requestDoc.data().userId !== userId) {
            return { success: false, error: "Request not found or you don't have permission to delete it." };
        }
        
        const requestData = requestDoc.data();

        if (requestData.documentUrl) {
            try {
                const fileRef = ref(storage, requestData.documentUrl);
                await deleteObject(fileRef);
            } catch (storageError: any) {
                 if (storageError.code !== 'storage/object-not-found') {
                    console.error("Error deleting file from storage: ", storageError);
                 }
            }
        }

        await deleteDoc(requestDocRef);
        
        revalidatePath('/dashboard');
        revalidatePath(`/dashboard/requests/${requestId}`);
        revalidatePath('/admin/requests');

        return { success: true };
    } catch (error) {
        console.error("Error deleting request: ", error);
        return { success: false, error: "Failed to delete request." };
    }
}
