
'use client';

import { useAuth } from "@/context/AuthContext";
import ChatUI from "@/components/chat/ChatUI";
import { Loader } from "@/components/ui/loader";
import { Card } from "@/components/ui/card";

export default function AdminChatPage() {
    const { user, loading } = useAuth();

    if (loading || !user) {
        return (
             <Card className="h-[calc(100vh-8rem)] flex items-center justify-center">
                <Loader text="Loading Chat Interface..."/>
             </Card>
        );
    }
    
    return (
        <Card className="h-[calc(100vh-8rem)]">
            <ChatUI currentUser={user} />
        </Card>
    );
}
