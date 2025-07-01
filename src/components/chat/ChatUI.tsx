
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { getOrCreateAdminGroupChat, getOrCreateClientChat, type Chat } from '@/lib/chat-actions';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { MessageSquarePlus } from 'lucide-react';

interface ChatUIProps {
  currentUser: User;
}

export default function ChatUI({ currentUser }: ChatUIProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser.uid) return;
    
    setLoading(true);
    const chatsRef = collection(db, 'chats');
    const q = query(
        chatsRef, 
        where('participantIds', 'array-contains', currentUser.uid),
        orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats: Chat[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastMessageAt: doc.data().lastMessageAt?.toDate(),
      } as Chat));
      setChats(fetchedChats);
      
      // If it's a client, automatically select or create their chat
      if (currentUser.role === 'client' && fetchedChats.length > 0) {
        setSelectedChat(fetchedChats[0]);
      } else if(currentUser.role !== 'client' && selectedChat) {
        // an admin might be viewing a chat that gets updated
        const updatedSelectedChat = fetchedChats.find(c => c.id === selectedChat.id);
        if(updatedSelectedChat) setSelectedChat(updatedSelectedChat);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching chats:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser.uid, currentUser.role, selectedChat?.id]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };
  
  const handleCreateAdminGroupChat = async () => {
    setLoading(true);
    try {
        const adminChat = await getOrCreateAdminGroupChat();
        if(adminChat) {
            setSelectedChat(adminChat);
        }
    } catch (error) {
        console.error("Error creating admin group chat:", error);
    } finally {
        setLoading(false);
    }
  };

  const handleCreateClientChat = useCallback(async () => {
      if (currentUser.role !== 'client' || chats.length > 0) return;
      setLoading(true);
      try {
          const clientChat = await getOrCreateClientChat(currentUser.uid);
          if (clientChat) {
              setChats([clientChat]);
              setSelectedChat(clientChat);
          }
      } catch (error) {
          console.error("Error creating client chat:", error);
      } finally {
          setLoading(false);
      }
  }, [currentUser, chats.length]);

  useEffect(() => {
      if (!loading && currentUser.role === 'client' && chats.length === 0) {
          handleCreateClientChat();
      }
  }, [loading, currentUser.role, chats.length, handleCreateClientChat]);

  if (loading && chats.length === 0) {
     return (
        <div className="flex h-full">
            <div className="hidden md:flex flex-col w-full max-w-xs border-r p-2 space-y-2">
                {currentUser.role === 'admin' && <Skeleton className="h-10 w-full" />}
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
            <div className="flex-1 p-4 hidden md:flex flex-col">
                <Skeleton className="h-full w-full" />
            </div>
            <div className="flex-1 p-4 md:hidden flex flex-col items-center justify-center">
                <p>Loading Chats...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex h-full">
      <ChatSidebar
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        currentUser={currentUser}
        onCreateAdminGroupChat={handleCreateAdminGroupChat}
      />
      <ChatWindow
        chat={selectedChat}
        currentUser={currentUser}
      />
    </div>
  );
}
