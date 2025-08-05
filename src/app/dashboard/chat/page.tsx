
'use client';

import { useAuth } from "@/context/AuthContext";
import ChatUI from "@/components/chat/ChatUI";
import { Loader } from "@/components/ui/loader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function DashboardChatPage() {
    const { user, loading } = useAuth();

    if (loading || !user) {
        return (
            <div className="container mx-auto px-4 py-12 md:py-16 md:px-6">
                <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-6 w-6 text-primary"/>
                            Client Support Chat
                        </CardTitle>
                        <CardDescription>
                            Communicate directly with our team about your projects.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg h-[calc(100vh-20rem)] flex items-center justify-center">
                           <Loader text="Loading Chat..."/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-6 w-6 text-primary"/>
                        Client Support Chat
                    </CardTitle>
                    <CardDescription>
                        Communicate directly with our team about your projects.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg h-[calc(100vh-20rem)]">
                        <ChatUI currentUser={user} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
