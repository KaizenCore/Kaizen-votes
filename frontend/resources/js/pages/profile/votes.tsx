import { Head, Link } from '@inertiajs/react';
import { BarChart3, Calendar, ExternalLink, Server, Trophy, Vote } from 'lucide-react';

import { ServerBanner } from '@/components/servers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, ProfileVotesPageProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Votes', href: '/profile/votes' },
];

// Simple bar chart for monthly votes
function MonthlyChart({ data }: { data: { month: string; votes: number }[] }) {
    const maxVotes = Math.max(...data.map((d) => d.votes), 1);

    return (
        <div className="space-y-4">
            <div className="flex h-32 items-end gap-2">
                {data.map((item) => {
                    const height = maxVotes > 0 ? (item.votes / maxVotes) * 100 : 0;
                    return (
                        <div key={item.month} className="group relative flex flex-1 flex-col items-center">
                            <div
                                className="w-full rounded-t bg-violet-500 transition-colors group-hover:bg-violet-600"
                                style={{ height: `${Math.max(height, 4)}%` }}
                            />
                            {/* Tooltip */}
                            <div className="absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs shadow-lg group-hover:block">
                                {item.votes} votes
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
                {data.map((item) => (
                    <span key={item.month} className="flex-1 text-center">
                        {item.month.split(' ')[0]}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function ProfileVotes({ votes, stats, topServers, monthlyVotes }: ProfileVotesPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Votes" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">My Voting History</h1>
                    <p className="text-muted-foreground">Track your votes and support for Minecraft servers</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
                            <Vote className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalVotes}</div>
                            <p className="text-xs text-muted-foreground">all time</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Month</CardTitle>
                            <Calendar className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.votesThisMonth}</div>
                            <p className="text-xs text-muted-foreground">votes this month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Servers Supported</CardTitle>
                            <Server className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.uniqueServers}</div>
                            <p className="text-xs text-muted-foreground">unique servers</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Monthly Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="size-5" />
                                Voting Activity
                            </CardTitle>
                            <CardDescription>Your votes over the last 6 months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {monthlyVotes && monthlyVotes.length > 0 ? (
                                <MonthlyChart data={monthlyVotes} />
                            ) : (
                                <div className="flex h-32 items-center justify-center text-muted-foreground">
                                    No voting data yet
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Top Servers */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="size-5" />
                                Most Voted
                            </CardTitle>
                            <CardDescription>Servers you support the most</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {topServers && topServers.length > 0 ? (
                                <div className="space-y-3">
                                    {topServers.map((item, index) => (
                                        <Link
                                            key={item.server_id}
                                            href={`/servers/${item.server?.slug}`}
                                            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                                        >
                                            <div className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                                                index === 0 ? 'bg-amber-500 text-white' :
                                                index === 1 ? 'bg-gray-400 text-white' :
                                                index === 2 ? 'bg-amber-700 text-white' :
                                                'bg-muted text-muted-foreground'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 truncate">
                                                <p className="truncate font-medium">{item.server?.name}</p>
                                            </div>
                                            <Badge variant="secondary">{item.vote_count}</Badge>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-sm text-muted-foreground py-4">
                                    No votes yet
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Vote History Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="size-5" />
                            Vote History
                        </CardTitle>
                        <CardDescription>All your votes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {votes.data && votes.data.length > 0 ? (
                            <div className="space-y-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b text-left text-sm text-muted-foreground">
                                                <th className="pb-3 font-medium">Server</th>
                                                <th className="pb-3 font-medium">Username</th>
                                                <th className="pb-3 font-medium">Date</th>
                                                <th className="pb-3 font-medium">Rewards</th>
                                                <th className="pb-3 font-medium"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {votes.data.map((vote) => (
                                                <tr key={vote.id} className="border-b last:border-0">
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-8 overflow-hidden rounded">
                                                                <ServerBanner
                                                                    url={vote.server?.banner_url}
                                                                    config={vote.server?.banner_config}
                                                                    alt={vote.server?.name || ''}
                                                                    aspectRatio="square"
                                                                />
                                                            </div>
                                                            <span className="font-medium">{vote.server?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 font-mono text-muted-foreground">
                                                        {vote.minecraft_username}
                                                    </td>
                                                    <td className="py-3 text-muted-foreground">
                                                        {new Date(vote.created_at).toLocaleDateString('fr-FR', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge variant={vote.claimed ? 'default' : 'secondary'}>
                                                            {vote.claimed ? 'Claimed' : 'Pending'}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3">
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/servers/${vote.server?.slug}`}>
                                                                <ExternalLink className="size-4" />
                                                            </Link>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {votes.last_page > 1 && (
                                    <div className="flex items-center justify-center gap-2 pt-4">
                                        {votes.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                asChild={!!link.url}
                                            >
                                                {link.url ? (
                                                    <Link href={link.url} preserveScroll>
                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                    </Link>
                                                ) : (
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                )}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Vote className="mb-4 size-12 text-muted-foreground" />
                                <p className="mb-2 font-medium">No votes yet</p>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Start voting for your favorite servers to see your history here
                                </p>
                                <Button asChild>
                                    <Link href="/servers">Browse Servers</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
