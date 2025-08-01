
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Settings, HelpCircle, PanelLeftClose } from "lucide-react";

interface Message {
  role: 'user' | 'model';
  content: { text: string }[];
}

interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
}

interface AcodyAISidebarProps {
    chatHistory: ChatSession[];
    activeChatId: number | null;
    onNewChat: () => void;
    onSelectChat: (id: number) => void;
    onToggleSidebar: () => void;
}

export default function AcodyAISidebar({ chatHistory, activeChatId, onNewChat, onSelectChat, onToggleSidebar }: AcodyAISidebarProps) {
  return (
    <div className="w-64 bg-deepseek-bg-dark p-4 flex flex-col border-r border-deepseek-border transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Acody Ai</h1>
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-gray-400 hover:text-white">
          <PanelLeftClose />
        </Button>
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start" onClick={onNewChat}>
        <Plus className="mr-2 h-4 w-4" />
        New Chat
      </Button>
      <div className="mt-6 flex-1 overflow-y-auto">
        <h2 className="text-xs text-gray-400 font-semibold mb-2 px-2">Recent</h2>
        <div className="space-y-1">
            {chatHistory.map(chat => (
                 <Button 
                    key={chat.id} 
                    variant={activeChatId === chat.id ? "secondary" : "ghost"} 
                    className="w-full justify-start text-gray-300 hover:bg-deepseek-bg-light hover:text-white"
                    onClick={() => onSelectChat(chat.id)}
                >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span className="truncate">{chat.title}</span>
                </Button>
            ))}
        </div>
      </div>
      <div className="mt-auto space-y-2">
        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-deepseek-bg-light hover:text-white">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-deepseek-bg-light hover:text-white">
          <HelpCircle className="mr-2 h-4 w-4" />
          Help & FAQ
        </Button>
      </div>
    </div>
  );
}
