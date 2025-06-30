
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateRequestStatus } from '../actions';
import { useToast } from '@/hooks/use-toast';
import type { ProjectRequest } from '@/app/dashboard/actions';

interface UpdateRequestStatusProps {
    requestId: string;
    currentStatus: ProjectRequest['status'];
}

export default function UpdateRequestStatus({ requestId, currentStatus }: UpdateRequestStatusProps) {
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<ProjectRequest['status']>(currentStatus);
    const { toast } = useToast();

    const possibleStatuses: ProjectRequest['status'][] = ['pending', 'approved', 'in-progress', 'completed', 'rejected'];

    const handleUpdate = async () => {
        if (selectedStatus === currentStatus) {
            toast({
                variant: 'default',
                title: 'No Change',
                description: 'The status is already set to the selected value.',
            });
            return;
        }

        setLoading(true);
        const result = await updateRequestStatus(requestId, selectedStatus);
        setLoading(false);

        if (result.success) {
            toast({
                title: 'Status Updated',
                description: `Request status has been updated to ${selectedStatus}.`,
            });
            // The page will re-render due to revalidatePath in the server action
        } else {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: result.error,
            });
        }
    };

    return (
        <div className="flex flex-col space-y-4">
             <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as ProjectRequest['status'])}
                disabled={loading}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a new status" />
                </SelectTrigger>
                <SelectContent>
                    {possibleStatuses.map(status => (
                        <SelectItem key={status} value={status} className="capitalize">
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button onClick={handleUpdate} disabled={loading || selectedStatus === currentStatus}>
                {loading ? 'Updating...' : 'Update Status'}
            </Button>
        </div>
    );
}
