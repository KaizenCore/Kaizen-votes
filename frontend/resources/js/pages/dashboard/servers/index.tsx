import { Head, Link } from '@inertiajs/react';
import { Plus, Server, Settings, Vote } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, DashboardServersPageProps, ServerStatus } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Servers', href: '/dashboard/servers' },
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

export default function DashboardServersIndex({ servers = [] }: DashboardServersPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Servers - Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">My Servers</h1>
                        <p className="text-muted-foreground">Manage your Minecraft servers</p>
                    </div>
                    <Button asChild>
                        <Link href="/servers/create">
                            <Plus className="mr-2 size-4" />
                            Add Server
                        </Link>
                    </Button>
                </div>

                {servers.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Server className="mb-4 size-16 text-muted-foreground" />
                            <h2 className="mb-2 text-xl font-semibold">No servers yet</h2>
                            <p className="mb-6 text-center text-muted-foreground">
                                Add your first Minecraft server to start receiving votes
                            </p>
                            <Button asChild>
                                <Link href="/servers/create">
                                    <Plus className="mr-2 size-4" />
                                    Add Your First Server
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>All Servers ({servers.length})</CardTitle>
                            <CardDescription>Click on a server to view details and manage it</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Server</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Votes</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {servers.map((server) => (
                                        <TableRow key={server.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                                                        <Server className="size-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={`/dashboard/servers/${server.slug}`}
                                                            className="font-medium hover:text-primary"
                                                        >
                                                            {server.name}
                                                        </Link>
                                                        <p className="text-sm text-muted-foreground">
                                                            {server.ip_address}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{server.category?.name || '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusColors[server.status]}>
                                                    {statusLabels[server.status]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Vote className="size-4 text-muted-foreground" />
                                                    {server.votes_count || server.monthly_votes}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/dashboard/servers/${server.slug}`}>
                                                        <Settings className="size-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
