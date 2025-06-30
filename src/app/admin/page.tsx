
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Bot } from "lucide-react";
import { getDashboardStats } from "./actions";
import Link from 'next/link';

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Welcome, Admin!</h1>
            <p className="text-muted-foreground">Here's a quick overview of your platform.</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Registered users on the platform</p>
                    </CardContent>
                </Card>
                <Link href="/admin/requests" className="block hover:shadow-lg transition-shadow rounded-lg">
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Project Requests</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{stats.projectRequests}</div>
                            <p className="text-xs text-muted-foreground">New requests pending review</p>
                        </CardContent>
                    </Card>
                </Link>
                <Card className="md:col-span-2 lg:col-span-1">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Tools</CardTitle>
                        <Bot className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Estimator</div>
                         <Link href="/admin/estimator" className="text-xs text-primary hover:underline">
                            Generate a new project estimate
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
