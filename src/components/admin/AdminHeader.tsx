
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function AdminHeader() {
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            toast({
                title: "Logged Out",
                description: "You have been successfully logged out.",
            });
            router.push('/login');
        } catch (error) {
            console.error("Logout error", error);
            toast({
                variant: "destructive",
                title: "Logout Failed",
                description: "An error occurred during logout.",
            });
        }
    };

    return (
        <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
            <div className="flex items-center gap-4">
                 <SidebarTrigger className="md:hidden" />
                 <h1 className="text-2xl font-bold hidden md:block">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <Home className="h-5 w-5" />
                        <span className="sr-only">Back to Site</span>
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Logout</span>
                </Button>
            </div>
        </header>
    );
}
