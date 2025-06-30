
'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export interface ProjectRequest {
    id: string;
    title: string;
    status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
    submittedAt: {
        seconds: number;
        nanoseconds: number;
    };
    [key: string]: any;
}

export async function getProjectRequestsForUser(userId: string): Promise<ProjectRequest[]> {
    if (!userId) return [];

    try {
        const requestsCollectionRef = collection(db, 'projectRequests');
        const q = query(
            requestsCollectionRef, 
            where('userId', '==', userId), 
            orderBy('submittedAt', 'desc')
        );
        const requestSnapshot = await getDocs(q);

        const requests = requestSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as ProjectRequest[];
        
        return requests;

    } catch (error) {
        console.error("Error fetching project requests: ", error);
        return [];
    }
}
