import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronRight,
    Cloud,
    Flag,
    Gamepad2,
    Lock,
    Palette,
    Rocket,
    Scroll,
    Shield,
    Sparkles,
    Swords,
    Tent,
    Trophy,
    Users,
    Zap,
    type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import type { HomePageProps } from '@/types';

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
    tent: Tent,
    palette: Palette,
    swords: Swords,
    'gamepad-2': Gamepad2,
    cloud: Cloud,
    flag: Flag,
    lock: Lock,
    scroll: Scroll,
    shield: Shield,
    rocket: Rocket,
    trophy: Trophy,
    users: Users,
    zap: Zap,
    sparkles: Sparkles,
};

// Animated gradient background component
function GradientOrb({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'absolute rounded-full blur-3xl opacity-30 animate-pulse',
                className,
            )}
        />
    );
}

// Stats counter component
function StatCard({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <div className="text-4xl font-bold tracking-tight md:text-5xl">{value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{label}</div>
        </div>
    );
}

// Feature card component
function FeatureCard({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) {
    return (
        <div className="group relative rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-border hover:bg-card">
            <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-3">
                <Icon className="size-6 text-violet-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}

// Server row component for top servers
function ServerRow({
    rank,
    server,
}: {
    rank: number;
    server: { id: number; name: string; slug: string; monthly_votes: number; category?: { name: string } };
}) {
    return (
        <Link
            href={`/servers/${server.slug}`}
            className="group flex items-center gap-4 rounded-xl border border-transparent bg-card/50 p-4 transition-all hover:border-border/50 hover:bg-card"
        >
            <div
                className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                    rank === 1 && 'bg-gradient-to-br from-amber-400 to-orange-500 text-white',
                    rank === 2 && 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800',
                    rank === 3 && 'bg-gradient-to-br from-amber-600 to-amber-700 text-white',
                    rank > 3 && 'bg-muted text-muted-foreground',
                )}
            >
                {rank}
            </div>
            <div className="min-w-0 flex-1">
                <h4 className="truncate font-medium transition-colors group-hover:text-violet-500">{server.name}</h4>
                <p className="truncate text-sm text-muted-foreground">{server.category?.name || 'Server'}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="size-4" />
                <span className="font-medium">{server.monthly_votes.toLocaleString()}</span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
    );
}

// Category card component
function CategoryCard({
    category,
}: {
    category: { id: number; name: string; slug: string; icon?: string; servers_count?: number };
}) {
    const IconComponent = category.icon ? iconMap[category.icon.toLowerCase()] : null;

    return (
        <Link
            href={`/servers?category=${category.slug}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm transition-all hover:border-violet-500/50 hover:bg-card hover:shadow-lg hover:shadow-violet-500/5"
        >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 transition-transform group-hover:scale-110">
                {IconComponent ? (
                    <IconComponent className="size-7 text-violet-500" />
                ) : (
                    <Gamepad2 className="size-7 text-violet-500" />
                )}
            </div>
            <div>
                <h3 className="font-semibold transition-colors group-hover:text-violet-500">{category.name}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{category.servers_count || 0} servers</p>
            </div>
        </Link>
    );
}

// Recent vote item
function RecentVote({ vote }: { vote: { id: number; minecraft_username: string; server_name: string; server_slug: string; created_at: string } }) {
    return (
        <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50">
            <img
                src={`https://mc-heads.net/avatar/${vote.minecraft_username}/32`}
                alt={vote.minecraft_username}
                className="size-8 rounded-full"
            />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{vote.minecraft_username}</p>
                <Link
                    href={`/servers/${vote.server_slug}`}
                    className="truncate text-xs text-muted-foreground transition-colors hover:text-violet-500"
                >
                    {vote.server_name}
                </Link>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{vote.created_at}</span>
        </div>
    );
}

export default function Home({
    categories = [],
    featuredServers = [],
    topServers = [],
    recentVotes = [],
}: HomePageProps) {
    return (
        <PublicLayout>
            <Head title="Kaizen Votes - Minecraft Server List" />

            {/* Hero Section */}
            <section className="relative min-h-screen overflow-hidden pt-16">
                {/* Background Effects */}
                <div className="pointer-events-none absolute inset-0">
                    <GradientOrb className="left-1/4 top-1/4 size-96 bg-violet-500" />
                    <GradientOrb className="right-1/4 top-1/3 size-96 bg-purple-500" />
                    <GradientOrb className="bottom-1/4 left-1/3 size-96 bg-blue-500" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]" />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 lg:py-40">
                    <div className="mx-auto max-w-4xl text-center">
                        {/* Badge */}
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-sm backdrop-blur-sm">
                            <Sparkles className="size-4 text-violet-500" />
                            <span>The #1 Minecraft Server List</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Discover Your Next
                            <span className="mt-2 block bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
                                Minecraft Adventure
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                            Find, vote, and join the best Minecraft servers. Support your favorite communities and earn
                            exclusive rewards.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button
                                size="lg"
                                asChild
                                className="h-12 bg-gradient-to-r from-violet-500 to-purple-600 px-8 text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40"
                            >
                                <Link href="/servers">
                                    Explore Servers
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="h-12 px-8">
                                <Link href="/servers/create">Add Your Server</Link>
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="mt-20 grid grid-cols-3 gap-8 border-t border-border/50 pt-12">
                            <StatCard value="500+" label="Active Servers" />
                            <StatCard value="50K+" label="Monthly Votes" />
                            <StatCard value="10K+" label="Players" />
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-background/50 backdrop-blur-sm">
                        <ChevronRight className="size-4 rotate-90 text-muted-foreground" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="border-t border-border/50 bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why Choose Kaizen?</h2>
                        <p className="mt-4 text-muted-foreground">
                            Built for the modern Minecraft community with features that matter.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <FeatureCard
                            icon={Zap}
                            title="Real-time Voting"
                            description="Instant vote tracking with WebSocket updates. See votes as they happen."
                        />
                        <FeatureCard
                            icon={Trophy}
                            title="Leaderboards"
                            description="Compete for top positions with daily, weekly, and monthly rankings."
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Secure & Verified"
                            description="Anti-cheat protection and verified server listings you can trust."
                        />
                        <FeatureCard
                            icon={Rocket}
                            title="Plugin Ready"
                            description="Easy integration with our Minecraft plugin for automated rewards."
                        />
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            {categories.length > 0 && (
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="flex items-end justify-between">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
                                <p className="mt-2 text-muted-foreground">Find servers that match your playstyle</p>
                            </div>
                            <Button variant="ghost" asChild className="hidden sm:inline-flex">
                                <Link href="/servers">
                                    View all
                                    <ChevronRight className="ml-1 size-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {categories.slice(0, 8).map((category) => (
                                <CategoryCard key={category.id} category={category} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Top Servers & Recent Activity */}
            <section className="border-t border-border/50 bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-12 lg:grid-cols-5">
                        {/* Top Servers */}
                        <div className="lg:col-span-3">
                            <div className="flex items-end justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight">Top Servers</h2>
                                    <p className="mt-2 text-muted-foreground">Most voted this month</p>
                                </div>
                                <Button variant="ghost" asChild className="hidden sm:inline-flex">
                                    <Link href="/servers?sort=votes_month">
                                        View all
                                        <ChevronRight className="ml-1 size-4" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="mt-8 space-y-2">
                                {topServers.slice(0, 10).map((server, index) => (
                                    <ServerRow key={server.id} rank={index + 1} server={server} />
                                ))}
                                {topServers.length === 0 && (
                                    <div className="rounded-xl border border-dashed border-border/50 p-12 text-center">
                                        <p className="text-muted-foreground">No servers yet. Be the first to add one!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Votes */}
                        <div className="lg:col-span-2">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">Live Activity</h2>
                                <p className="mt-2 text-muted-foreground">Recent votes from players</p>
                            </div>

                            <div className="mt-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                                <div className="divide-y divide-border/50">
                                    {recentVotes.slice(0, 8).map((vote) => (
                                        <RecentVote key={vote.id} vote={vote} />
                                    ))}
                                    {recentVotes.length === 0 && (
                                        <div className="p-12 text-center">
                                            <Users className="mx-auto size-8 text-muted-foreground/50" />
                                            <p className="mt-4 text-sm text-muted-foreground">No recent votes yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden py-24">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

                <div className="relative mx-auto max-w-7xl px-6 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                        Ready to grow your server?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                        Join thousands of server owners using Kaizen to reach more players and build thriving
                        communities.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button
                            size="lg"
                            asChild
                            className="h-12 bg-white px-8 text-violet-600 shadow-lg hover:bg-white/90"
                        >
                            <Link href="/servers/create">
                                Add Your Server
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            asChild
                            className="h-12 border-white/30 bg-transparent px-8 text-white hover:bg-white/10"
                        >
                            <Link href="/register">Create Account</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
