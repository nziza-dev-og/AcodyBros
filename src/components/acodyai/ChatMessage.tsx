import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, User } from 'lucide-react';
import { marked } from 'marked';

interface ChatMessageProps {
  message: {
    role: 'user' | 'model';
    content: { text: string }[];
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const combinedText = message.content.map(c => c.text).join('');
  const htmlContent = marked.parse(combinedText);


  return (
    <div className={`flex items-start gap-4 p-4 ${isUser ? '' : 'bg-deepseek-bg-light'}`}>
      <Avatar className="h-8 w-8">
        <AvatarFallback className={isUser ? "bg-blue-500 text-white" : "bg-deepseek-accent text-white"}>
            {isUser ? <User size={20}/> : <Sparkles size={20}/>}
        </AvatarFallback>
      </Avatar>
      <div className="prose prose-invert prose-sm max-w-none text-white" dangerouslySetInnerHTML={{ __html: htmlContent }}/>
    </div>
  );
}
