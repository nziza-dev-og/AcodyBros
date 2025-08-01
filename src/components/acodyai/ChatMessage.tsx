import React, { useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles, User, Copy } from 'lucide-react';
import { marked } from 'marked';
import { useToast } from '@/hooks/use-toast';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface ChatMessageProps {
  message: {
    role: 'user' | 'model';
    content: { text: string }[];
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { toast } = useToast();
  const isUser = message.role === 'user';
  const combinedText = message.content.map(c => c.text).join('');
  
  // Configure marked to use highlight.js
  marked.setOptions({
    highlight: function(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-',
  });

  const htmlContent = marked.parse(combinedText);

  useEffect(() => {
    // Add click listeners to copy buttons after the component renders
    const codeBlocks = document.querySelectorAll('.code-block-wrapper');
    codeBlocks.forEach(block => {
      const button = block.querySelector('.copy-button') as HTMLElement;
      const code = block.querySelector('code')?.innerText;
      if (button && code) {
        const clickHandler = () => {
          navigator.clipboard.writeText(code).then(() => {
            toast({ title: 'Copied!', description: 'Code has been copied to your clipboard.' });
          });
        };
        button.addEventListener('click', clickHandler);
        // Cleanup function to remove event listener
        return () => {
          button.removeEventListener('click', clickHandler);
        };
      }
    });
  }, [htmlContent, toast]);

  // We need to wrap pre tags to position the copy button correctly
  const wrappedHtmlContent = htmlContent.replace(/<pre>/g, '<div class="code-block-wrapper relative group"><pre>').replace(/<\/pre>/g, '</pre><button class="copy-button absolute top-2 right-2 p-1.5 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div>');

  return (
    <div className={`flex items-start gap-4 p-4 ${isUser ? '' : 'bg-deepseek-bg-light'}`}>
      <Avatar className="h-8 w-8">
        <AvatarFallback className={isUser ? "bg-blue-500 text-white" : "bg-deepseek-accent text-white"}>
            {isUser ? <User size={20}/> : <Sparkles size={20}/>}
        </AvatarFallback>
      </Avatar>
      <div className="prose prose-invert prose-sm max-w-none text-white" dangerouslySetInnerHTML={{ __html: wrappedHtmlContent }}/>
    </div>
  );
}
