
'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { notFound, useRouter } from "next/navigation";
import { getProjectRequestDetails, type ProjectRequest } from "@/app/dashboard/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, ListChecks, DollarSign, FileDown } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";
import DeleteRequestButton from './DeleteRequestButton';

export default function ClientRequestDetailsPage({ params }: { params: { id: string } }) {
    const { user, loading: authLoading } = useAuth();
    const [request, setRequest] = useState<ProjectRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchRequest = async () => {
            setLoading(true);
            const req = await getProjectRequestDetails(params.id, user.uid);
            if (!req) {
                notFound();
                return;
            }
            setRequest(req);
            setLoading(false);
        };

        fetchRequest();
    }, [params.id, user, authLoading, router]);

    const getBadgeVariant = (status: string) => {
        switch (status) {
            case 'completed': return 'default';
            case 'pending': return 'secondary';
            case 'approved': return 'outline';
            case 'in-progress': return 'outline';
            case 'rejected': return 'destructive';
            default: return 'outline';
        }
    };

    if (loading || authLoading || !request) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16 md:px-6 flex items-center justify-center min-h-[calc(100vh-20rem)]">
                <Loader text="Loading Request Details..." />
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16 md:px-6">
             <Button asChild variant="outline" className="mb-8">
                <Link href="/dashboard">
                    &larr; Back to Dashboard
                </Link>
            </Button>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{request.title}</span>
                                <Badge variant={getBadgeVariant(request.status)} className="capitalize text-base">
                                    {request.status}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                            Submitted on {request.submittedAt ? format(new Date(request.submittedAt), 'MMMM d, yyyy') : 'N/A'}
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
                            <CardTitle>Actions</CardTitle>
                            <CardDescription>Manage your project request.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <DeleteRequestButton requestId={request.id} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
