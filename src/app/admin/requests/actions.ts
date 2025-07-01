
'use server';

import { db, storage } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import type { User } from '../users/actions';
import type { ProjectRequest } from '@/app/dashboard/actions';
import { revalidatePath } from 'next/cache';

export interface ProjectRequestWithUser extends ProjectRequest {
    user?: User;
}

export async function getProjectRequests(): Promise<ProjectRequestWithUser[]> {
    try {
        const requestsCollectionRef = collection(db, 'projectRequests');
        const q = query(requestsCollectionRef, orderBy('submittedAt', 'desc'));
        const requestSnapshot = await getDocs(q);

        const requests = await Promise.all(requestSnapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data();
            const submittedAtTimestamp = data.submittedAt as Timestamp;
            const submittedAt = submittedAtTimestamp?.toDate ? submittedAtTimestamp.toDate().toISOString() : null;

            const requestData = { id: docSnapshot.id, ...data, submittedAt } as ProjectRequest;
            let user: User | undefined = undefined;

            if (requestData.userId) {
                const userDocRef = doc(db, 'users', requestData.userId);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    user = userDoc.data() as User;
                }
            }
            return { ...requestData, user };
        }));

        return requests;

    } catch (error) {
        console.error("Error fetching project requests with users: ", error);
        return [];
    }
}

export async function getProjectRequestDetails(id: string): Promise<ProjectRequestWithUser | null> {
    try {
        const requestDocRef = doc(db, 'projectRequests', id);
        const requestDoc = await getDoc(requestDocRef);

        if (!requestDoc.exists()) {
            return null;
        }

        const data = requestDoc.data();
        const submittedAtTimestamp = data.submittedAt as Timestamp;
        const submittedAt = submittedAtTimestamp?.toDate ? submittedAtTimestamp.toDate().toISOString() : null;
        const requestData = { id: requestDoc.id, ...data, submittedAt } as ProjectRequest;
        
        let user: User | undefined = undefined;

        if (requestData.userId) {
            const userDocRef = doc(db, 'users', requestData.userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                user = userDoc.data() as User;
            }
        }
        
        return { ...requestData, user };

    } catch (error) {
        console.error("Error fetching project request details: ", error);
        return null;
    }
}

export async function updateRequestStatus(requestId: string, status: ProjectRequest['status']) {
    try {
        const requestDocRef = doc(db, 'projectRequests', requestId);
        await updateDoc(requestDocRef, { status });

        revalidatePath('/admin/requests');
        revalidatePath(`/admin/requests/${requestId}`);
        revalidatePath('/dashboard');

        return { success: true };
    } catch (error) {
        console.error("Error updating request status: ", error);
        return { success: false, error: "Failed to update status." };
    }
}

export async function deleteProjectRequest(requestId: string) {
    try {
        const requestDocRef = doc(db, 'projectRequests', requestId);
        const requestDoc = await getDoc(requestDocRef);

        if (!requestDoc.exists()) {
            return { success: false, error: "Request not found." };
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
        
        revalidatePath('/admin/requests');
        revalidatePath('/dashboard');

        return { success: true };
    } catch (error) {
        console.error("Error deleting request: ", error);
        return { success: false, error: "Failed to delete request." };
    }
}
