
'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import AcodyAISidebar from './Sidebar';
import { getAcodyResponse } from '@/app/admin/acody/actions';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  content: { text: string }[];
}

interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
}

export default function AcodyAI() {
  const [currentChat, setCurrentChat] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat]);
  
  const handleNewChat = () => {
    setCurrentChat([]);
    setActiveChatId(null);
  };

  const handleSelectChat = (chatId: number) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setActiveChatId(chat.id);
      setCurrentChat(chat.messages);
    }
  };

  const handleSendMessage = async (userMessage: string) => {
    setIsLoading(true);

    const newUserMessage: Message = {
      role: 'user',
      content: [{ text: userMessage }],
    };
    
    const updatedMessages = [...currentChat, newUserMessage];
    setCurrentChat(updatedMessages);

    // Add a placeholder for the model's response
    setCurrentChat((prev) => [...prev, { role: 'model', content: [{ text: '' }] }]);

    try {
      const stream = await getAcodyResponse({
        history: updatedMessages.slice(0, -1), // Exclude the placeholder
        message: userMessage,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        if (chunk.content) {
          const content = chunk.content[0]?.text;
          if (content) {
            fullResponse += content;
            setCurrentChat((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage.role === 'model') {
                lastMessage.content[0].text = fullResponse;
              }
              return newMessages;
            });
          }
        }
      }
      
      const finalMessages = [...updatedMessages, { role: 'model', content: [{ text: fullResponse }] }];
      
      if (activeChatId === null) {
        // This is a new chat, so create a new session in history
        const newChatId = nextId;
        const newChatSession: ChatSession = {
          id: newChatId,
          title: userMessage.substring(0, 40) + '...',
          messages: finalMessages,
        };
        setChatHistory(prev => [newChatSession, ...prev]);
        setActiveChatId(newChatId);
        setNextId(prev => prev + 1);
      } else {
        // Update the existing chat session in history
        setChatHistory(prev => prev.map(chat =>
          chat.id === activeChatId ? { ...chat, messages: finalMessages } : chat
        ));
      }

    } catch (e) {
      console.error(e);
      setCurrentChat((prev) => {
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
      {isSidebarOpen && (
        <AcodyAISidebar 
          chatHistory={chatHistory}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onToggleSidebar={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="flex flex-1 flex-col">
         <header className="flex items-center justify-between p-2 border-b border-deepseek-border">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
              {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
            </Button>
            <h1 className="text-lg font-semibold">
              {activeChatId ? chatHistory.find(c => c.id === activeChatId)?.title : 'New Chat'}
            </h1>
            <div className="w-8"></div>
        </header>
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentChat.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && currentChat[currentChat.length - 1].role !== 'model' && (
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
