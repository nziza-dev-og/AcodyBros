'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { User } from '@/context/AuthContext';

export async function getAdminTeamMembers(): Promise<User[]> {
    try {
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('role', '==', 'admin'));
        const userSnapshot = await getDocs(q);

        if (userSnapshot.empty) {
            return [];
        }

        const admins = userSnapshot.docs.map(doc => doc.data() as User);
        
        // Sort by name alphabetically
        admins.sort((a, b) => a.name.localeCompare(b.name));

        return admins;
    } catch (error) {
        console.error("Error fetching admin team members: ", error);
        return [];
    }
}
