
'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import AcodyAISidebar from './Sidebar';
import { getAcodyResponse } from '@/app/admin/acody/actions';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DialogClose } from '../ui/dialog';

interface Message {
  role: 'user' | 'model';
  content: { text: string }[];
}

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
    if (isWriterMode && initialPrompt) {
      setCurrentChat([{ role: 'user', content: [{ text: initialPrompt }] }]);
    }
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

  const handleSendMessage = async (userMessage: string) => {
    setIsLoading(true);

    const newUserMessage: Message = {
      role: 'user',
      content: [{ text: userMessage }],
    };
    
    const updatedChat = [...currentChat, newUserMessage];
    setCurrentChat(updatedChat);

    // Add a placeholder for the model's response
    const placeholderMessage: Message = { role: 'model', content: [{ text: '' }] };
    setCurrentChat((prev) => [...prev, placeholderMessage]);

    try {
      const stream = await getAcodyResponse({
        history: updatedChat.slice(0, -1), // Don't include the placeholder in history
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
                lastMessage.content = [{ text: fullResponse }];
              }
              return newMessages;
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
            messages: finalMessages.slice(0, -1), // Remove the placeholder
          };
          setChatHistory(prev => [newChatSession, ...prev]);
          setActiveChatId(newChatId);
          setNextId(prev => prev + 1);
        } else {
          setChatHistory(prev => prev.map(chat =>
            chat.id === activeChatId ? { ...chat, messages: finalMessages.slice(0, -1) } : chat
          ));
        }
      }

    } catch (e) {
      console.error(e);
      const errorMessage = "Sorry, I ran into an error.";
       setCurrentChat((prev) => {
        const newMessages = [...prev];
        const lastMessageIndex = newMessages.length - 1;
        if(newMessages[lastMessageIndex].role === 'model') {
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
       toast({
        title: "Description Added",
        description: "The generated description has been added to the form.",
      });
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
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} initialValue={isWriterMode ? initialPrompt : ''}/>

        {isWriterMode && (
          <div className="p-4 border-t border-deepseek-border flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
             <DialogClose asChild>
                <Button onClick={handleUseWriterResponse} disabled={isLoading || currentChat.length < 2}>
                  <Send className="mr-2 h-4 w-4" />
                  Use this Description
                </Button>
            </DialogClose>
          </div>
        )}
      </div>
    </div>
  );
}
