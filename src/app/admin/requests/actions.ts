
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, updateDoc } from 'firebase/firestore';
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
            const requestData = { id: docSnapshot.id, ...docSnapshot.data() } as ProjectRequest;
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

        const requestData = { id: requestDoc.id, ...requestDoc.data() } as ProjectRequest;
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
