
'use client';

import { useAuth } from "@/context/AuthContext";
import ChatUI from "@/components/chat/ChatUI";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AdminChatPage() {
    const { user, loading } = useAuth();

    if (loading || !user) {
        return (
             <Card className="h-[calc(100vh-8rem)]">
                 <div className="flex h-full">
                    <div className="hidden md:flex flex-col w-full max-w-xs border-r p-2 space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                    <div className="flex-1 p-4 hidden md:flex flex-col">
                        <Skeleton className="h-full w-full" />
                    </div>
                    <div className="flex-1 p-4 md:hidden flex flex-col items-center justify-center">
                        <p>Loading Chats...</p>
                    </div>
                </div>
             </Card>
        );
    }
    
    return (
        <Card className="h-[calc(100vh-8rem)]">
            <ChatUI currentUser={user} />
        </Card>
    );
}
