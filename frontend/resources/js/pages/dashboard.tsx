import { Link } from '@inertiajs/react';
import { ArrowRight, Plus, Server, Vote } from 'lucide-react';
import { Head } from '@inertiajs/react';

import { ServerCard } from '@/components/servers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type DashboardPageProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ ownedServers = [], recentVotes = [] }: DashboardPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">My Servers</CardTitle>
                            <Server className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{ownedServers.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">My Votes</CardTitle>
                            <Vote className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{recentVotes.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button asChild size="sm" className="w-full">
                                <Link href="/servers/create">
                                    <Plus className="mr-2 size-4" />
                                    Add Server
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* My Servers */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>My Servers</CardTitle>
                            <CardDescription>Servers you own and manage</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard/servers">
                                View all
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {ownedServers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Server className="mb-4 size-12 text-muted-foreground" />
                                <p className="mb-2 font-medium">No servers yet</p>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Add your first Minecraft server to get started
                                </p>
                                <Button asChild>
                                    <Link href="/servers/create">
                                        <Plus className="mr-2 size-4" />
                                        Add Server
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {ownedServers.map((server) => (
                                    <ServerCard key={server.id} server={server} />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Votes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Votes</CardTitle>
                        <CardDescription>Your recent voting activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentVotes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Vote className="mb-4 size-12 text-muted-foreground" />
                                <p className="mb-2 font-medium">No votes yet</p>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Start voting for your favorite servers
                                </p>
                                <Button asChild>
                                    <Link href="/servers">Browse Servers</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentVotes.map((vote) => (
                                    <div
                                        key={vote.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div>
                                            <p className="font-medium">{vote.minecraft_username}</p>
                                            {vote.server && (
                                                <Link
                                                    href={`/servers/${vote.server.slug}`}
                                                    className="text-sm text-muted-foreground hover:text-primary"
                                                >
                                                    {vote.server.name}
                                                </Link>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(vote.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
