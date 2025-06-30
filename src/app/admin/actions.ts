
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function getDashboardStats() {
    try {
        const usersCollectionRef = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollectionRef);
        const totalUsers = userSnapshot.size;

        // Placeholders for now
        const projectRequests = 0;
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
