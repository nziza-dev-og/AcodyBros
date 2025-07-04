
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProjectRequests, type ProjectRequestWithUser } from "./actions";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";

export default async function RequestsPage() {
    const requests = await getProjectRequests();

    const getBadgeVariant = (status: string) => {
        switch (status) {
            case 'completed': return 'default';
            case 'pending': return 'secondary';
            case 'approved': return 'outline';
            case 'in-progress': return 'outline';
            case 'rejected': return 'destructive';
            default: return 'outline';
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Requests</CardTitle>
                <CardDescription>
                    Review and manage all client project requests.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Project Title</TableHead>
                            <TableHead className="hidden sm:table-cell">Client</TableHead>
                            <TableHead className="hidden md:table-cell">Submitted</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.length > 0 ? requests.map((request: ProjectRequestWithUser) => (
                            <TableRow key={request.id}>
                                <TableCell className="font-medium">{request.title}</TableCell>
                                <TableCell className="hidden sm:table-cell">{request.user?.name ?? 'Unknown User'}</TableCell>
                                <TableCell className="hidden md:table-cell">{request.submittedAt ? format(new Date(request.submittedAt), 'MMM d, yyyy') : 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge variant={getBadgeVariant(request.status)} className="capitalize">
                                        {request.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="ghost" size="icon">
                                        <Link href={`/admin/requests/${request.id}`}>
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">View Details</span>
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No project requests found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
