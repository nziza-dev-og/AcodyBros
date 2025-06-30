
import { getProjectRequestDetails } from "../actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UpdateRequestStatus from "./UpdateRequestStatus";
import { Briefcase, ListChecks, DollarSign, User, Mail, Phone, FileDown } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default async function RequestDetailsPage({ params }: { params: { id: string } }) {
    const request = await getProjectRequestDetails(params.id);

    if (!request) {
        notFound();
    }

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
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>{request.title}</span>
                             <Badge variant={getBadgeVariant(request.status)} className="capitalize text-base">
                                {request.status}
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                           Submitted on {request.submittedAt ? format(new Date(request.submittedAt.seconds * 1000), 'MMMM d, yyyy') : 'N/A'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary"/>Project Description</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap">{request.description}</p>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><ListChecks className="h-4 w-4 text-primary"/>Key Features</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap">{request.features}</p>
                        </div>
                        <Separator />
                         <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary"/>Budget Range</h3>
                            <p className="text-muted-foreground">{request.budget || 'Not specified'}</p>
                        </div>
                        {request.documentUrl && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><FileDown className="h-4 w-4 text-primary"/>Project Document</h3>
                                    <Button asChild>
                                        <Link href={request.documentUrl} target="_blank" download={request.documentName || true}>
                                            Download Document
                                        </Link>
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-2">{request.documentName}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" />Client Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {request.user ? (
                            <>
                                <div className="flex items-center gap-3">
                                   <User className="h-4 w-4 text-muted-foreground" />
                                   <span className="font-medium">{request.user.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                   <Mail className="h-4 w-4 text-muted-foreground" />
                                   <a href={`mailto:${request.user.email}`} className="text-muted-foreground hover:text-primary">{request.user.email}</a>
                                </div>
                                 <div className="flex items-center gap-3">
                                   <Phone className="h-4 w-4 text-muted-foreground" />
                                   <a href={`tel:${request.user.phone}`} className="text-muted-foreground hover:text-primary">{request.user.phone}</a>
                                </div>
                            </>
                        ) : (
                            <p className="text-muted-foreground">User details not available.</p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>Update the status of this request.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <UpdateRequestStatus requestId={request.id} currentStatus={request.status} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
