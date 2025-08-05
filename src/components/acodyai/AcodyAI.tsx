
'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import AcodyAISidebar from './Sidebar';
import { getAcodyResponse } from '@/app/admin/acody/actions';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen, Send, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DialogClose } from '../ui/dialog';
import type { Message } from '@/ai/types';
import { Loader } from '../ui/loader';

interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
}

interface AcodyAIProps {
  mode?: 'chat' | 'writer';
  initialPrompt?: string;
  onWriterSubmit?: (text: string) => void;
}

export default function AcodyAI({ mode = 'chat', initialPrompt, onWriterSubmit }: AcodyAIProps) {
  const [currentChat, setCurrentChat] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const isWriterMode = mode === 'writer';
  const showSidebar = !isWriterMode && isSidebarOpen;

  useEffect(() => {
    if (isWriterMode && initialPrompt && initialPrompt.trim().length > 10) {
      handleSendMessage(initialPrompt, true);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWriterMode, initialPrompt]);


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

  const handleSendMessage = async (userMessage: string, isInitial = false) => {
    if (isWriterMode && !isInitial) return;

    setIsLoading(true);

    const newUserMessage: Message = {
      role: 'user',
      content: [{ text: userMessage }],
    };
    
    let updatedChat: Message[];
    if (isWriterMode) {
      updatedChat = [newUserMessage];
    } else {
      updatedChat = [...currentChat, newUserMessage];
    }
    setCurrentChat(updatedChat);

    const placeholderMessage: Message = { role: 'model', content: [{ text: '' }] };
    setCurrentChat((prev) => [...prev, placeholderMessage]);

    try {
      const stream = await getAcodyResponse({
        history: updatedChat,
        message: userMessage,
        mode: isWriterMode ? 'writer' : 'chat',
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        if (chunk.content) {
          const content = chunk.content[0]?.text;
          if (content) {
            fullResponse += content;
            setCurrentChat((prev) => {
              const newMessages = [...prev];
              const lastMessageIndex = newMessages.length - 1;
              if (lastMessageIndex >= 0 && newMessages[lastMessageIndex].role === 'model') {
                newMessages[lastMessageIndex] = { role: 'model', content: [{ text: fullResponse }] };
                 return newMessages;
              }
              return prev;
            });
          }
        }
      }
      
      const finalMessages = [...updatedChat, { role: 'model', content: [{ text: fullResponse }] }];
      
      if (!isWriterMode) {
        if (activeChatId === null) {
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
          setChatHistory(prev => prev.map(chat =>
            chat.id === activeChatId ? { ...chat, messages: finalMessages } : chat
          ));
        }
      }

    } catch (e) {
      console.error(e);
      const errorMessage = "Sorry, I ran into an error.";
       setCurrentChat((prev) => {
        const newMessages = [...prev];
        const lastMessageIndex = newMessages.length - 1;
        if(lastMessageIndex >= 0 && newMessages[lastMessageIndex].role === 'model') {
          newMessages[lastMessageIndex].content = [{ text: errorMessage }];
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUseWriterResponse = () => {
    const lastMessage = currentChat[currentChat.length - 1];
    if (lastMessage && lastMessage.role === 'model' && onWriterSubmit) {
      onWriterSubmit(lastMessage.content.map(c => c.text).join(''));
    }
  };

  const handleRegenerate = () => {
    const lastUserMessage = currentChat.find(m => m.role === 'user');
    if (lastUserMessage) {
        handleSendMessage(lastUserMessage.content.map(c => c.text).join(''), true);
    }
  };


  return (
    <div className="flex w-full h-full bg-deepseek-bg-dark text-white rounded-md">
      {showSidebar && (
        <AcodyAISidebar 
          chatHistory={chatHistory}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onToggleSidebar={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="flex flex-1 flex-col">
         {!isWriterMode && (
          <header className="flex items-center justify-between p-2 border-b border-deepseek-border">
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
                {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
              </Button>
              <h1 className="text-lg font-semibold">
                {activeChatId ? chatHistory.find(c => c.id === activeChatId)?.title : 'New Chat'}
              </h1>
              <div className="w-8"></div>
          </header>
         )}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentChat.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Sparkles className="h-16 w-16 mb-4" />
                <h2 className="text-2xl font-semibold">How can I help you today?</h2>
            </div>
          )}
          {currentChat.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && currentChat[currentChat.length - 1]?.role !== 'model' && (
             <div className="flex items-start gap-4 p-4">
              <Loader text="Acody is thinking..."/>
            </div>
          )}
        </div>

        {!isWriterMode && (
           <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        )}
        
        {isWriterMode && (
          <div className="p-4 border-t border-deepseek-border flex justify-end gap-2">
            <Button variant="outline" onClick={handleRegenerate} disabled={isLoading || !initialPrompt}>
                <Sparkles className="mr-2 h-4 w-4" />
                Regenerate
            </Button>
            <Button onClick={handleUseWriterResponse} disabled={isLoading || currentChat.length < 2}>
              <Send className="mr-2 h-4 w-4" />
              Use this Draft
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
