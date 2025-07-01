
'use client';

import { useAuth } from "@/context/AuthContext";
import ChatUI from "@/components/chat/ChatUI";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardChatPage() {
    const { user, loading } = useAuth();

    if (loading || !user) {
        return (
             <div className="container mx-auto px-4 py-12 md:py-16 md:px-6">
                 <div className="flex h-[calc(100vh-10rem)]">
                    <div className="hidden md:flex flex-col w-1/4 border-r p-4 space-y-2">
                        <Skeleton className="h-16 w-full" />
                    </div>
                    <div className="flex-1 p-4 flex flex-col">
                        <Skeleton className="h-full w-full" />
                    </div>
                </div>
             </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="border rounded-lg h-[calc(100vh-15rem)]">
                 <ChatUI currentUser={user} />
            </div>
        </div>
    );
}
