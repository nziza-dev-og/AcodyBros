
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function getDashboardStats() {
    try {
        const usersCollectionRef = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollectionRef);
        const totalUsers = userSnapshot.size;

        const requestsCollectionRef = collection(db, 'projectRequests');
        const q = query(requestsCollectionRef, where('status', '==', 'pending'));
        const requestSnapshot = await getDocs(q);
        const projectRequests = requestSnapshot.size;
        
        // Placeholders for now
        const openProjects = 0;

        return {
            totalUsers,
            projectRequests,
            openProjects
        };
    } catch (error) {
        console.error("Error fetching dashboard stats: ", error);
        return {
            totalUsers: 0,
            projectRequests: 0,
            openProjects: 0
        };
    }
}
