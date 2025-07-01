
'use client';

import { useAuth } from "@/context/AuthContext";
import ChatUI from "@/components/chat/ChatUI";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminChatPage() {
    const { user, loading } = useAuth();

    if (loading || !user) {
        return (
             <div className="flex h-[calc(100vh-4rem)]">
                <div className="hidden md:flex flex-col w-1/4 border-r p-4 space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
                <div className="flex-1 p-4 flex flex-col">
                    <Skeleton className="h-full w-full" />
                </div>
            </div>
        );
    }
    
    return <ChatUI currentUser={user} />;
}
