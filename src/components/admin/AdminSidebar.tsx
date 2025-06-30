
'use client';
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Bot, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
    const pathname = usePathname();
    const navItems = [
        { href: "/admin", label: "Dashboard", icon: <LayoutDashboard />, exact: true },
        { href: "/admin/users", label: "Users", icon: <Users /> },
        { href: "/admin/estimator", label: "AI Estimator", icon: <Bot /> },
    ];

    return (
        <Sidebar>
            <SidebarHeader>
                <h2 className="text-xl font-bold p-2 text-center group-data-[collapsible=icon]:hidden">AcodyBros</h2>
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
