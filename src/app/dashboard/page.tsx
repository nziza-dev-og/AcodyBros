
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getProjectRequestsForUser, type ProjectRequest } from './actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FilePlus2, ListTodo } from "lucide-react";
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      if (user) {
        setLoading(true);
        const userRequests = await getProjectRequestsForUser(user.uid);
        setRequests(userRequests);
        setLoading(false);
      }
    }
    if (user) {
        fetchRequests();
    }
  }, [user]);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Client Dashboard</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Manage your projects, submit new requests, and communicate with our team.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ListTodo/>Your Project Requests</CardTitle>
                    <CardDescription>
                        Here is a list of your submitted project requests and their current status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <>
                                    {[...Array(2)].map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-5 w-[150px]"/></TableCell>
                                            <TableCell><Skeleton className="h-5 w-[100px]"/></TableCell>
                                            <TableCell><Skeleton className="h-5 w-[70px]"/></TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            ) : requests.length > 0 ? requests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell className="font-medium">{request.title}</TableCell>
                                    <TableCell>{format(new Date(request.submittedAt.seconds * 1000), 'MMM d, yyyy')}</TableCell>
                                    <TableCell>
                                        <Badge variant={getBadgeVariant(request.status)} className="capitalize">
                                            {request.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        You haven't submitted any requests yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card className="bg-card sticky top-24">
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><FilePlus2/>Submit a New Project</CardTitle>
                <CardDescription>
                    Have a new idea? Let's get it started.
                </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                <Button asChild size="lg">
                    <Link href="/dashboard/new-request">Start a New Request</Link>
                </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
