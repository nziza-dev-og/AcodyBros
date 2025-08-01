'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import AcodyAISidebar from './Sidebar';
import { getAcodyResponse } from '@/app/admin/acody/actions';

interface Message {
  role: 'user' | 'model';
  content: { text: string }[];
}

export default function AcodyAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (userMessage: string) => {
    setIsLoading(true);

    const newUserMessage: Message = {
      role: 'user',
      content: [{ text: userMessage }],
    };
    
    const currentMessages: Message[] = [...messages, newUserMessage];
    setMessages(currentMessages);

    // Add a placeholder for the model's response
    setMessages((prev) => [...prev, { role: 'model', content: [{ text: '' }] }]);

    try {
      const stream = await getAcodyResponse(
        { history: currentMessages, message: userMessage }
      );
      
      for await (const chunk of stream) {
         if (chunk.content) {
            const content = chunk.content[0]?.text;
            if (content) {
                setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'model') {
                    lastMessage.content[0].text += content;
                }
                return newMessages;
                });
            }
        }
      }
    } catch(e) {
      console.error(e);
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'model') {
            lastMessage.content[0].text = "Sorry, I ran into an error.";
        }
        return newMessages;
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full bg-deepseek-bg-dark text-white">
      <AcodyAISidebar />
      <div className="flex flex-1 flex-col">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && messages[messages.length -1].role !== 'model' && (
             <div className="flex items-start gap-4 p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p>Thinking...</p>
             </div>
          )}
        </div>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
