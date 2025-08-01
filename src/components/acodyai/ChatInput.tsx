'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-deepseek-bg-light border-t border-deepseek-border">
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask me anything..."
          className="bg-deepseek-bg-dark border-deepseek-border rounded-xl pr-24 pl-12 py-3 text-white focus:ring-deepseek-accent"
          rows={1}
          disabled={isLoading}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-deepseek-accent hover:bg-deepseek-accent/90"
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
       <p className="text-xs text-center text-gray-500 mt-2">
        Acody Ai is powered by Gemini. Responses may be inaccurate.
      </p>
    </div>
  );
}
