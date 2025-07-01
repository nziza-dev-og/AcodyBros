
'use client';

import React from 'react';
import type { User } from '@/context/AuthContext';
import type { Chat } from '@/lib/chat-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Users, User as UserIcon } from 'lucide-react';

interface ChatSidebarProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  currentUser: User;
  onCreateAdminGroupChat: () => void;
}

export default function ChatSidebar({
  chats,
  selectedChat,
  onSelectChat,
  currentUser,
  onCreateAdminGroupChat,
}: ChatSidebarProps) {

  const getChatPartner = (chat: Chat) => {
    if (chat.isGroupChat) {
      return { name: chat.groupName, photoURL: chat.groupAvatar };
    }
    const partnerId = chat.participantIds.find(id => id !== currentUser.uid);
    return partnerId ? chat.participantInfo[partnerId] : { name: 'Unknown', photoURL: '' };
  };

  return (
    <div className={cn(
        "flex flex-col border-r h-full transition-all duration-300",
        selectedChat ? "w-0 md:w-full md:max-w-xs" : "w-full",
    )}>
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">Chats</h2>
      </div>
      
      {currentUser.role === 'admin' && (
        <div className="p-2">
            <Button variant="outline" className="w-full" onClick={onCreateAdminGroupChat}>
                <Users className="mr-2 h-4 w-4" />
                Admin Group
            </Button>
        </div>
      )}

      <ScrollArea className="flex-1">
        {chats.length > 0 ? (
          <div className="p-2 space-y-1">
            {chats.map(chat => {
              const partner = getChatPartner(chat);
              if (!partner) return null;

              return (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat)}
                  className={cn(
                    "flex items-center w-full p-3 rounded-lg text-left transition-colors",
                    selectedChat?.id === chat.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={partner.photoURL} alt={partner.name}/>
                    <AvatarFallback>
                        {chat.isGroupChat ? <Users/> : partner.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold truncate">{partner.name}</h3>
                        {chat.lastMessageAt && (
                           <p className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: true })}
                            </p>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No chats yet.
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
