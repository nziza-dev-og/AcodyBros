'use client';
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Bot, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import blandLogo from "@/app/bland.png";

export default function AdminSidebar() {
    const pathname = usePathname();
    const navItems = [
        { href: "/admin", label: "Dashboard", icon: <LayoutDashboard />, exact: true },
        { href: "/admin/users", label: "Users", icon: <Users /> },
        { href: "/admin/requests", label: "Requests", icon: <FileText /> },
        { href: "/admin/chat", label: "Chat", icon: <MessageSquare /> },
        { href: "/admin/estimator", label: "AI Estimator", icon: <Bot /> },
    ];

    return (
        <Sidebar>
            <SidebarHeader>
                 <div className="flex items-center justify-center p-4 group-data-[collapsible=icon]:hidden">
                    <Link href="/">
                        <Image src={blandLogo} alt="Logo" width={120} height={120} />
                    </Link>
                </div>
            </SidebarHeader>
            <SidebarMenu>
                {navItems.map(item => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton 
                            asChild 
                            tooltip={item.label} 
                            isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
                        >
                            <Link href={item.href}>
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </Sidebar>
    )
}
