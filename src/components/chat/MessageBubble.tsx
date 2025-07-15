
'use client';

import React from 'react';
import type { User } from '@/context/AuthContext';
import type { Message, ParticipantInfo } from '@/lib/chat-actions';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  currentUser: User;
  participantInfo: ParticipantInfo;
}

const linkify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">
          {part}
        </a>
      );
    }
    return part;
  });
};

export default function MessageBubble({ message, currentUser, participantInfo }: MessageBubbleProps) {
  const isCurrentUser = message.senderId === currentUser.uid;
  const sender = participantInfo[message.senderId];

  if (!sender) return null;

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!isCurrentUser && (
         <Avatar className="h-8 w-8">
            <AvatarImage src={sender.photoURL || undefined} alt={sender.name} />
            <AvatarFallback>{sender.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn("flex flex-col max-w-sm md:max-w-md", isCurrentUser ? "items-end" : "items-start")}>
        {!isCurrentUser && (
            <p className="text-xs text-muted-foreground px-2 mb-1">{sender.name}</p>
        )}
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={cn(
                            "p-3 rounded-2xl",
                            isCurrentUser
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted rounded-bl-none"
                        )}
                    >
                        <p className="text-sm whitespace-pre-wrap break-words">{linkify(message.text)}</p>
                    </div>
                </TooltipTrigger>
                 <TooltipContent side={isCurrentUser ? 'left' : 'right'}>
                    <p>{message.createdAt ? format(new Date(message.createdAt), 'PPpp') : 'Sending...'}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>

       {isCurrentUser && (
         <Avatar className="h-8 w-8">
            <AvatarImage src={sender.photoURL || undefined} alt={sender.name} />
            <AvatarFallback>{sender.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
