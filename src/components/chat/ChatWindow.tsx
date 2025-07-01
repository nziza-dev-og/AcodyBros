
'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { User } from '@/context/AuthContext';
import { sendMessage, type Chat, type Message } from '@/lib/chat-actions';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageSquare, Users } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  chat: Chat | null;
  currentUser: User;
}

export default function ChatWindow({ chat, currentUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chat) return;

    const messagesRef = collection(db, `chats/${chat.id}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      } as Message));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chat]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollableViewport = scrollAreaRef.current.children[1] as HTMLDivElement;
        if(scrollableViewport) {
            scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !chat) return;

    await sendMessage({
      chatId: chat.id,
      senderId: currentUser.uid,
      text: newMessage,
      participantInfo: chat.participantInfo
    });
    setNewMessage('');
  };

  const getChatPartner = (chat: Chat) => {
    if (chat.isGroupChat) {
      return { name: chat.groupName, photoURL: chat.groupAvatar, isGroup: true };
    }
    const partnerId = chat.participantIds.find(id => id !== currentUser.uid);
    const partnerInfo = partnerId ? chat.participantInfo[partnerId] : null;
    return { name: partnerInfo?.name, photoURL: partnerInfo?.photoURL, isGroup: false };
  };
  
  const partner = chat ? getChatPartner(chat) : null;

  if (!chat) {
    return (
      <div className="flex-1 flex-col items-center justify-center h-full hidden md:flex">
        <div className="text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Select a chat</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Choose a conversation from the sidebar to start messaging.
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-1 flex-col h-full", !chat && "hidden md:flex")}>
      <div className="flex items-center p-4 border-b">
         <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src={partner?.photoURL} alt={partner?.name}/>
            <AvatarFallback>
                {partner?.isGroup ? <Users/> : partner?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">{partner?.name}</h2>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
            {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} currentUser={currentUser} participantInfo={chat.participantInfo} />
            ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
