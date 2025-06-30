
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export interface User {
    uid: string;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'client';
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
