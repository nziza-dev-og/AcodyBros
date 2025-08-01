import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Settings, HelpCircle, ChevronLeft } from "lucide-react";

export default function DeepSeekSidebar() {
  return (
    <div className="w-64 bg-deepseek-bg-dark p-4 flex flex-col border-r border-deepseek-border">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">DeepSeek</h1>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <ChevronLeft />
        </Button>
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start">
        <Plus className="mr-2 h-4 w-4" />
        New Chat
      </Button>
      <div className="mt-6 flex-1 overflow-y-auto">
        <h2 className="text-xs text-gray-400 font-semibold mb-2">Recent</h2>
        {/* Placeholder for recent chats */}
        <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-deepseek-bg-light hover:text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span className="truncate">Initial chat about project requirements</span>
            </Button>
             <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-deepseek-bg-light hover:text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                 <span className="truncate">Generating a Next.js component</span>
            </Button>
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
