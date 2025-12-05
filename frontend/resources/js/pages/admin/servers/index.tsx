import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, Eye, Server, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, Server as ServerType, ServerStatus } from '@/types';

interface AdminServersPageProps {
    servers: PaginatedData<ServerType & { owner?: { id: number; name: string; email: string } }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/servers' },
    { title: 'Servers', href: '/admin/servers' },
];

const statusColors: Record<ServerStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    approved: 'default',
    rejected: 'destructive',
    suspended: 'destructive',
};

const statusLabels: Record<ServerStatus, string> = {
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    suspended: 'Suspended',
};

export default function AdminServersIndex({ servers }: AdminServersPageProps) {
    const handleApprove = (serverId: number) => {
        router.post(`/admin/servers/${serverId}/approve`);
    };

    const handleReject = (serverId: number) => {
        router.post(`/admin/servers/${serverId}/reject`);
    };

    const handleSuspend = (serverId: number) => {
        router.post(`/admin/servers/${serverId}/suspend`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Servers" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Server Management</h1>
                    <p className="text-muted-foreground">Review and manage all servers</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Servers ({servers.total})</CardTitle>
                        <CardDescription>Approve, reject, or suspend servers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {servers.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Server className="mb-4 size-16 text-muted-foreground" />
                                <p className="text-lg font-medium">No servers yet</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Server</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Votes</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {servers.data.map((server) => (
                                        <TableRow key={server.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                                                        <Server className="size-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{server.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {server.ip_address}:{server.port}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{server.owner?.name}</p>
                                                    <p className="text-sm text-muted-foreground">{server.owner?.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{server.category?.name || '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusColors[server.status]}>
                                                    {statusLabels[server.status]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">{server.votes_count ?? 0}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/servers/${server.slug}`}>
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    {server.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-green-600 hover:bg-green-50 hover:text-green-700"
                                                                onClick={() => handleApprove(server.id)}
                                                            >
                                                                <CheckCircle className="mr-1 size-4" />
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                onClick={() => handleReject(server.id)}
                                                            >
                                                                <XCircle className="mr-1 size-4" />
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                    {server.status === 'approved' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                                                            onClick={() => handleSuspend(server.id)}
                                                        >
                                                            Suspend
                                                        </Button>
                                                    )}
                                                    {(server.status === 'rejected' || server.status === 'suspended') && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-green-600 hover:bg-green-50 hover:text-green-700"
                                                            onClick={() => handleApprove(server.id)}
                                                        >
                                                            <CheckCircle className="mr-1 size-4" />
                                                            Approve
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
