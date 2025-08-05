import React from 'react';
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

  const rawHtml = marked.parse(combinedText) as string;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({ title: 'Copied!', description: 'Code has been copied to your clipboard.' });
    });
  };

  // A bit of a hack to add copy buttons to code blocks
  const htmlContent = rawHtml.replace(/<pre><code class="(.+?)">/g, (match, p1) => {
    const codeContent = match.replace(/<pre><code class="(.+?)">/, '').slice(0, -9); // remove tags
    const button = `<button class="copy-button absolute top-2 right-2 p-1.5 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-opacity"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button>`;
    return `<div class="code-block-wrapper relative group"><pre><code class="${p1}">`;
  }).replace(/<\/code><\/pre>/g, '</code></pre></div>');

  return (
    <div className={`flex items-start gap-4 p-4 ${isUser ? '' : 'bg-deepseek-bg-light'}`}>
      <Avatar className="h-8 w-8">
        <AvatarFallback className={isUser ? "bg-blue-500 text-white" : "bg-deepseek-accent text-white"}>
            {isUser ? <User size={20}/> : <Sparkles size={20}/>}
        </AvatarFallback>
      </Avatar>
      <div className="prose prose-invert prose-sm max-w-none text-white" 
           dangerouslySetInnerHTML={{ __html: htmlContent }}
           onClick={(e) => {
             const target = e.target as HTMLElement;
             const copyButton = target.closest('.copy-button');
             if (copyButton) {
               const code = copyButton.parentElement?.querySelector('code')?.innerText;
               if (code) {
                 handleCopy(code);
               }
             }
           }}
      />
    </div>
  );
}
