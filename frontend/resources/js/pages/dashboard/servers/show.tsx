import { Head, Link, router } from '@inertiajs/react';
import { BarChart3, Calendar, Copy, Edit, ExternalLink, Gift, Link2, Settings, TrendingUp, Trash2, Users, Vote } from 'lucide-react';
import * as React from 'react';

import { CategoryBadge, PairingCode, ServerBanner, ServerStatusBadge, TagChip } from '@/components/servers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, DashboardServerShowPageProps, ServerStatus } from '@/types';

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

// Simple bar chart component
function VoteChart({ data }: { data: { date: string; votes: number }[] }) {
    const maxVotes = Math.max(...data.map((d) => d.votes), 1);
    const last7Days = data.slice(-7);
    const last30Days = data;

    const [view, setView] = React.useState<'7' | '30'>('7');
    const displayData = view === '7' ? last7Days : last30Days;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Vote Trends</p>
                <div className="flex gap-1">
                    <Button
                        variant={view === '7' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setView('7')}
                    >
                        7 days
                    </Button>
                    <Button
                        variant={view === '30' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setView('30')}
                    >
                        30 days
                    </Button>
                </div>
            </div>
            <div className="flex h-40 items-end gap-1">
                {displayData.map((day, i) => {
                    const height = maxVotes > 0 ? (day.votes / maxVotes) * 100 : 0;
                    const date = new Date(day.date);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    return (
                        <div
                            key={day.date}
                            className="group relative flex flex-1 flex-col items-center"
                        >
                            <div
                                className={`w-full rounded-t transition-colors ${
                                    isWeekend ? 'bg-violet-400/50' : 'bg-violet-500'
                                } group-hover:bg-violet-600`}
                                style={{ height: `${Math.max(height, 2)}%` }}
                            />
                            {/* Tooltip */}
                            <div className="absolute -top-10 left-1/2 z-10 hidden -translate-x-1/2 rounded bg-popover px-2 py-1 text-xs shadow-lg group-hover:block">
                                <p className="font-medium">{day.votes} votes</p>
                                <p className="text-muted-foreground">
                                    {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                    {new Date(displayData[0]?.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
                <span>
                    {new Date(displayData[displayData.length - 1]?.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
            </div>
        </div>
    );
}

export default function DashboardServerShow({ server, analytics, topVoters, recentVotes, stats }: DashboardServerShowPageProps) {
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Servers', href: '/dashboard/servers' },
        { title: server.name, href: `/dashboard/servers/${server.slug}` },
    ];

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(`/servers/${server.slug}`, {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteOpen(false);
            },
        });
    };

    const handleGeneratePairingCode = () => {
        setIsGenerating(true);
        router.post(`/dashboard/servers/${server.slug}/tokens`, {}, {
            onFinish: () => setIsGenerating(false),
        });
    };

    const handleRefreshPairingCode = () => {
        setIsRefreshing(true);
        router.post(`/dashboard/servers/${server.slug}/tokens/refresh`, {}, {
            onFinish: () => setIsRefreshing(false),
        });
    };

    const activeToken = server.tokens?.find((t) => t.is_active && t.is_paired);
    const pendingToken = server.tokens?.find((t) => t.is_active && !t.is_paired && t.pairing_code);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${server.name} - Dashboard`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="size-16 overflow-hidden rounded-lg">
                            <ServerBanner url={server.banner_url} config={server.banner_config} alt={server.name} aspectRatio="square" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">{server.name}</h1>
                                <Badge variant={statusColors[server.status]}>
                                    {statusLabels[server.status]}
                                </Badge>
                            </div>
                            <p className="font-mono text-muted-foreground">
                                {server.ip_address}:{server.port}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/servers/${server.slug}`}>
                                <ExternalLink className="mr-2 size-4" />
                                View Public Page
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/servers/${server.slug}/edit`}>
                                <Edit className="mr-2 size-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ServerStatusBadge
                                isOnline={server.is_online}
                                playerCount={server.current_players}
                                maxPlayers={server.max_players}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
                            <TrendingUp className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.votesLast7Days ?? 0}</div>
                            <p className="text-xs text-muted-foreground">votes this week</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Votes</CardTitle>
                            <Vote className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{server.monthly_votes}</div>
                            <p className="text-xs text-muted-foreground">{stats?.uniqueVotersMonth ?? 0} unique voters</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
                            <BarChart3 className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{server.total_votes}</div>
                            <p className="text-xs text-muted-foreground">all time</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="analytics" className="flex-1">
                    <TabsList>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="rewards">Rewards</TabsTrigger>
                        <TabsTrigger value="link">Link Plugin</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="analytics" className="mt-6">
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Vote Chart */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="size-5" />
                                        Vote Analytics
                                    </CardTitle>
                                    <CardDescription>
                                        Track your server's voting performance over time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {analytics && analytics.length > 0 ? (
                                        <VoteChart data={analytics} />
                                    ) : (
                                        <div className="flex h-40 items-center justify-center text-muted-foreground">
                                            No vote data available yet
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Top Voters */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="size-5" />
                                        Top Voters
                                    </CardTitle>
                                    <CardDescription>This month's most active voters</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {topVoters && topVoters.length > 0 ? (
                                        <div className="space-y-3">
                                            {topVoters.map((voter, index) => (
                                                <div key={voter.minecraft_username} className="flex items-center gap-3">
                                                    <div className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                                                        index === 0 ? 'bg-amber-500 text-white' :
                                                        index === 1 ? 'bg-gray-400 text-white' :
                                                        index === 2 ? 'bg-amber-700 text-white' :
                                                        'bg-muted text-muted-foreground'
                                                    }`}>
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1 truncate">
                                                        <p className="truncate font-medium">{voter.minecraft_username}</p>
                                                    </div>
                                                    <Badge variant="secondary">{voter.vote_count}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-sm text-muted-foreground py-4">
                                            No voters yet this month
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent Votes */}
                            <Card className="lg:col-span-3">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="size-5" />
                                        Recent Votes
                                    </CardTitle>
                                    <CardDescription>Latest voting activity on your server</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {recentVotes && recentVotes.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b text-left text-sm text-muted-foreground">
                                                        <th className="pb-3 font-medium">Player</th>
                                                        <th className="pb-3 font-medium">Account</th>
                                                        <th className="pb-3 font-medium">Date</th>
                                                        <th className="pb-3 font-medium">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    {recentVotes.map((vote) => (
                                                        <tr key={vote.id} className="border-b last:border-0">
                                                            <td className="py-3 font-medium">{vote.minecraft_username}</td>
                                                            <td className="py-3 text-muted-foreground">
                                                                {vote.user?.name || 'Anonymous'}
                                                            </td>
                                                            <td className="py-3 text-muted-foreground">
                                                                {new Date(vote.created_at).toLocaleDateString('fr-FR', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </td>
                                                            <td className="py-3">
                                                                <Badge variant={vote.claimed ? 'default' : 'secondary'}>
                                                                    {vote.claimed ? 'Claimed' : 'Pending'}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-center text-sm text-muted-foreground py-8">
                                            No votes yet. Share your server to get started!
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="overview" className="mt-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Server Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {server.category && (
                                        <div>
                                            <p className="mb-1 text-sm text-muted-foreground">Category</p>
                                            <CategoryBadge category={server.category} />
                                        </div>
                                    )}
                                    {server.tags && server.tags.length > 0 && (
                                        <div>
                                            <p className="mb-1 text-sm text-muted-foreground">Tags</p>
                                            <div className="flex flex-wrap gap-1">
                                                {server.tags.map((tag) => (
                                                    <TagChip key={tag.id} tag={tag} size="sm" />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {server.description && (
                                        <div>
                                            <p className="mb-1 text-sm text-muted-foreground">Description</p>
                                            <p className="text-sm">{server.description}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>External Links</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {server.website_url && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Website</span>
                                            <a
                                                href={server.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                {server.website_url}
                                            </a>
                                        </div>
                                    )}
                                    {server.discord_url && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Discord</span>
                                            <a
                                                href={server.discord_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                {server.discord_url}
                                            </a>
                                        </div>
                                    )}
                                    {server.discord_webhook_url && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Discord Webhook</span>
                                            <Badge variant="outline">Configured</Badge>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Plugin Status</span>
                                        <Badge variant={activeToken ? 'default' : 'secondary'}>
                                            {activeToken ? 'Connected' : 'Not Connected'}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="rewards" className="mt-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Gift className="size-5" />
                                        Vote Rewards
                                    </CardTitle>
                                    <CardDescription>
                                        Configure rewards players receive when they vote for your server
                                    </CardDescription>
                                </div>
                                <Button asChild>
                                    <Link href={`/dashboard/servers/${server.slug}/rewards`}>
                                        <Settings className="mr-2 size-4" />
                                        Manage Rewards
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {server.rewards && server.rewards.length > 0 ? (
                                    <div className="space-y-3">
                                        {server.rewards.map((reward) => (
                                            <div
                                                key={reward.id}
                                                className="flex items-center justify-between rounded-lg border p-4"
                                            >
                                                <div>
                                                    <p className="font-medium">{reward.name}</p>
                                                    {reward.description && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {reward.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">{reward.chance}% chance</Badge>
                                                    <Badge variant={reward.is_active ? 'default' : 'secondary'}>
                                                        {reward.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <Gift className="mb-4 size-12 text-muted-foreground" />
                                        <p className="mb-2 font-medium">No rewards configured</p>
                                        <p className="mb-4 text-sm text-muted-foreground">
                                            Add rewards to incentivize players to vote for your server
                                        </p>
                                        <Button asChild>
                                            <Link href={`/dashboard/servers/${server.slug}/rewards`}>
                                                Configure Rewards
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="link" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Link2 className="size-5" />
                                    Link Minecraft Plugin
                                </CardTitle>
                                <CardDescription>
                                    Connect your Minecraft server to receive vote notifications and deliver rewards
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {activeToken ? (
                                    <div className="space-y-4">
                                        <div className="rounded-lg bg-green-500/10 p-4 text-green-600 dark:text-green-400">
                                            <p className="font-medium">Plugin Connected</p>
                                            <p className="text-sm">
                                                Your server is connected and ready to receive votes
                                            </p>
                                        </div>
                                        <div className="rounded-lg border p-4">
                                            <p className="mb-2 text-sm text-muted-foreground">API Token</p>
                                            <code className="rounded bg-muted px-2 py-1 text-sm">
                                                {activeToken.token?.slice(0, 20)}...
                                            </code>
                                        </div>
                                    </div>
                                ) : pendingToken ? (
                                    <PairingCode
                                        code={pendingToken.pairing_code || ''}
                                        expiresAt={pendingToken.pairing_expires_at || ''}
                                        onRefresh={handleRefreshPairingCode}
                                        isRefreshing={isRefreshing}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <Link2 className="mb-4 size-12 text-muted-foreground" />
                                        <p className="mb-2 font-medium">Generate a pairing code</p>
                                        <p className="mb-4 text-sm text-muted-foreground">
                                            Generate a code to link your Minecraft plugin
                                        </p>
                                        <Button onClick={handleGeneratePairingCode} disabled={isGenerating}>
                                            {isGenerating ? 'Generating...' : 'Generate Pairing Code'}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="size-5" />
                                    Server Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="font-medium">Edit Server</p>
                                        <p className="text-sm text-muted-foreground">
                                            Update server information, banner, and links
                                        </p>
                                    </div>
                                    <Button variant="outline" asChild>
                                        <Link href={`/servers/${server.slug}/edit`}>
                                            <Edit className="mr-2 size-4" />
                                            Edit
                                        </Link>
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                                    <div>
                                        <p className="font-medium text-destructive">Delete Server</p>
                                        <p className="text-sm text-muted-foreground">
                                            Permanently remove this server and all its data
                                        </p>
                                    </div>
                                    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive">
                                                <Trash2 className="mr-2 size-4" />
                                                Delete
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Delete Server</DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to delete {server.name}? This action cannot be
                                                    undone and will remove all associated votes, rewards, and data.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleDelete}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? 'Deleting...' : 'Delete Server'}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
