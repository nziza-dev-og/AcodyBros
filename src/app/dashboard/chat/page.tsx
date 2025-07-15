
'use client';

import { useAuth } from "@/context/AuthContext";
import ChatUI from "@/components/chat/ChatUI";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function DashboardChatPage() {
    const { user, loading } = useAuth();

    if (loading || !user) {
        return (
            <div className="container mx-auto px-4 py-12 md:py-16 md:px-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48"/>
                        <Skeleton className="h-5 w-64 mt-2"/>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg h-[calc(100vh-20rem)] flex">
                            <div className="hidden md:flex flex-col w-full max-w-xs border-r p-2 space-y-2">
                                <Skeleton className="h-16 w-full" />
                            </div>
                            <div className="flex-1 p-4 flex flex-col">
                                <Skeleton className="h-full w-full" />
                            </div>
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
