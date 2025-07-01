
'use server';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import type { User } from '@/context/AuthContext';

export interface ParticipantInfo {
    [uid: string]: {
        name: string;
        photoURL?: string;
    }
}

export interface Chat {
    id: string;
    participantIds: string[];
    participantInfo: ParticipantInfo;
    lastMessage?: string;
    lastMessageAt?: Date;
    isGroupChat: boolean;
    groupName?: string;
    groupAvatar?: string;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: Date;
}

interface SendMessageInput {
    chatId: string;
    senderId: string;
    text: string;
    participantInfo: ParticipantInfo;
}

export async function sendMessage({ chatId, senderId, text, participantInfo }: SendMessageInput): Promise<void> {
    if (!chatId || !senderId || !text) {
        throw new Error("Missing required fields for sending message.");
    }

    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const chatRef = doc(db, 'chats', chatId);

    const senderName = participantInfo[senderId]?.name || 'Unknown User';
    const messageText = `${senderName}: ${text}`;

    await addDoc(messagesRef, {
        senderId,
        text,
        createdAt: serverTimestamp(),
    });

    await updateDoc(chatRef, {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
    });
}

export async function getOrCreateClientChat(clientId: string): Promise<Chat | null> {
    const chatsRef = collection(db, 'chats');

    const q = query(
        chatsRef,
        where('isGroupChat', '==', false),
        where('participantIds', 'array-contains', clientId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const chatDoc = querySnapshot.docs[0];
        return { id: chatDoc.id, ...chatDoc.data() } as Chat;
    }

    // Create a new chat
    const clientDoc = await getDoc(doc(db, 'users', clientId));
    if (!clientDoc.exists()) throw new Error("Client user not found");
    const clientUser = clientDoc.data() as User;
    
    // Get all admins
    const usersRef = collection(db, 'users');
    const adminQuery = query(usersRef, where('role', '==', 'admin'));
    const adminSnapshot = await getDocs(adminQuery);
    const admins = adminSnapshot.docs.map(doc => doc.data() as User);

    if (admins.length === 0) {
        throw new Error("No admin users found to create a chat with.");
    }
    
    const participantIds = [clientId, ...admins.map(a => a.uid)];
    const participantInfo: ParticipantInfo = {
        [clientId]: { name: clientUser.name, photoURL: clientUser.photoURL || '' },
    };
    admins.forEach(admin => {
        participantInfo[admin.uid] = { name: admin.name, photoURL: admin.photoURL || '' };
    });

    const newChatRef = await addDoc(chatsRef, {
        isGroupChat: false,
        participantIds,
        participantInfo,
        lastMessage: "Chat created",
        lastMessageAt: serverTimestamp(),
    });

    const newChatDoc = await getDoc(newChatRef);
    return { id: newChatDoc.id, ...newChatDoc.data() } as Chat;
}

export async function getOrCreateAdminGroupChat(): Promise<Chat | null> {
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('isGroupChat', '==', true));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const chatDoc = querySnapshot.docs[0];
        const data = chatDoc.data();
        return {
            id: chatDoc.id,
            ...data,
            lastMessageAt: (data.lastMessageAt as Timestamp)?.toDate(),
        } as Chat;
    }

    // Create a new group chat
    const usersRef = collection(db, 'users');
    const adminQuery = query(usersRef, where('role', '==', 'admin'));
    const adminSnapshot = await getDocs(adminQuery);
    const admins = adminSnapshot.docs.map(doc => doc.data() as User);

    if (admins.length === 0) {
      throw new Error("No admin users found to create a group chat.");
    }

    const participantIds = admins.map(a => a.uid);
    const participantInfo: ParticipantInfo = {};
    admins.forEach(admin => {
        participantInfo[admin.uid] = { name: admin.name, photoURL: admin.photoURL || '' };
    });
    
    const newChatData = {
        isGroupChat: true,
        groupName: "Admin Team",
        groupAvatar: "", // Can add a default group avatar URL
        participantIds,
        participantInfo,
        lastMessage: "Admin group created",
        lastMessageAt: serverTimestamp(),
    };

    const newChatRef = await addDoc(chatsRef, newChatData);
    const newChatDoc = await getDoc(newChatRef);
    const data = newChatDoc.data();

    return { 
        id: newChatDoc.id,
        ...data,
        lastMessageAt: (data?.lastMessageAt as Timestamp)?.toDate(),
    } as Chat;
}
