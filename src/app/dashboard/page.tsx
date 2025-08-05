
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getProjectRequestsForUser, type ProjectRequest } from './actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ListTodo, Eye, PlusCircle } from "lucide-react";
import { format } from 'date-fns';
import { Loader } from "@/components/ui/loader";

export default function DashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      if (user?.uid) {
        setLoading(true);
        try {
            const userRequests = await getProjectRequestsForUser(user.uid);
            setRequests(userRequests);
        } catch (error) {
            console.error("Failed to fetch project requests:", error);
            setRequests([]); // Clear requests on error
        } finally {
            setLoading(false);
        }
      } else {
        // Handle user logout or initial state where user is not yet available
        setRequests([]);
        setLoading(false);
      }
    }
    fetchRequests();
  }, [user]);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'in-progress': return 'outline';
      case 'approved': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
        <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Client Dashboard</h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-2">
                Manage your project requests and view their status.
            </p>
        </div>
        <Button asChild size="lg">
            <Link href="/dashboard/new-request">
                <PlusCircle className="mr-2 h-5 w-5"/>
                New Project Request
            </Link>
        </Button>
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><ListTodo/>Your Project Requests</CardTitle>
              <CardDescription>
                  Here is a list of your submitted project requests. Click view to see details.
              </CardDescription>
          </CardHeader>
          <CardContent>
             {loading ? (
                <div className="flex items-center justify-center h-48">
                    <Loader text="Loading your requests..."/>
                </div>
             ) : (
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead className="hidden sm:table-cell">Submitted</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {requests.length > 0 ? requests.map((request) => (
                          <TableRow key={request.id}>
                              <TableCell className="font-medium">{request.title}</TableCell>
                              <TableCell className="hidden sm:table-cell">{request.submittedAt ? format(new Date(request.submittedAt), 'MMM d, yyyy') : 'Pending...'}</TableCell>
                              <TableCell>
                                  <Badge variant={getBadgeVariant(request.status)} className="capitalize">
                                      {request.status}
                                  </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                  <Button asChild variant="outline" size="sm">
                                      <Link href={`/dashboard/requests/${request.id}`}>
                                          <Eye className="mr-0 md:mr-2 h-4 w-4"/> 
                                          <span className="hidden md:inline">View</span>
                                      </Link>
                                  </Button>
                              </TableCell>
                          </TableRow>
                      )) : (
                          <TableRow>
                              <TableCell colSpan={4} className="h-24 text-center">
                                  You haven't submitted any requests yet.
                              </TableCell>
                          </TableRow>
                      )}
                  </TableBody>
              </Table>
             )}
          </CardContent>
      </Card>
    </div>
  );
}
