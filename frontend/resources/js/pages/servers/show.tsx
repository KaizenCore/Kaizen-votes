import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, Copy, ExternalLink, Globe, Languages, Lock, MapPin, MessageCircle, Monitor, Package, Shield, Unlock, Users } from 'lucide-react';
import * as React from 'react';

import { AnimatedBanner } from '@/components/animated-banner';
import { CategoryBadge, FavoriteButton, LeaderboardTable, ServerBanner, ServerStatusBadge, TagChip, VoteButton } from '@/components/servers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import type { ServerShowPageProps, SharedData } from '@/types';

const serverTypeLabels: Record<string, string> = {
    java: 'Java Edition',
    bedrock: 'Bedrock Edition',
    crossplay: 'Crossplay (Java & Bedrock)',
};

const serverSoftwareLabels: Record<string, string> = {
    vanilla: 'Vanilla',
    paper: 'Paper',
    spigot: 'Spigot',
    purpur: 'Purpur',
    fabric: 'Fabric',
    forge: 'Forge',
    neoforge: 'NeoForge',
    velocity: 'Velocity',
    bungeecord: 'BungeeCord',
    waterfall: 'Waterfall',
    other: 'Other',
};

const countryLabels: Record<string, string> = {
    FR: '🇫🇷 France',
    US: '🇺🇸 United States',
    CA: '🇨🇦 Canada',
    GB: '🇬🇧 United Kingdom',
    DE: '🇩🇪 Germany',
    NL: '🇳🇱 Netherlands',
    BE: '🇧🇪 Belgium',
    CH: '🇨🇭 Switzerland',
    ES: '🇪🇸 Spain',
    IT: '🇮🇹 Italy',
    PT: '🇵🇹 Portugal',
    PL: '🇵🇱 Poland',
    RU: '🇷🇺 Russia',
    BR: '🇧🇷 Brazil',
    AU: '🇦🇺 Australia',
    JP: '🇯🇵 Japan',
    KR: '🇰🇷 South Korea',
    SG: '🇸🇬 Singapore',
};

const languageLabels: Record<string, string> = {
    fr: 'Français',
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
    it: 'Italiano',
    pt: 'Português',
    nl: 'Nederlands',
    pl: 'Polski',
    ru: 'Русский',
    ja: '日本語',
    ko: '한국어',
    zh: '中文',
    multi: 'Multilingue',
};

export default function ServerShow({ server, topVoters, canVote, cooldownRemaining, isFavorited }: ServerShowPageProps) {
    const { auth } = usePage<SharedData>().props;
    const [copied, setCopied] = React.useState(false);

    const copyIp = async () => {
        const ip = server.port === 25565 ? server.ip_address : `${server.ip_address}:${server.port}`;
        await navigator.clipboard.writeText(ip);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <PublicLayout>
            <Head title={`${server.name} - Kaizen Votes`} />

            {/* Full-width Banner */}
            <div className="relative w-full pt-16">
                <div className="relative h-56 w-full overflow-hidden md:h-72 lg:h-80">
                    {server.banner_config ? (
                        <AnimatedBanner config={server.banner_config} className="size-full" />
                    ) : server.banner_url ? (
                        <img
                            src={server.banner_url}
                            alt={server.name}
                            className="size-full object-cover object-center"
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-violet-500/5">
                            <div className="flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 text-4xl font-bold text-white shadow-2xl shadow-violet-500/25">
                                {server.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{server.name}</h1>
                                    {server.owner && (
                                        <p className="mt-1 text-muted-foreground">by {server.owner.name}</p>
                                    )}
                                </div>
                                <ServerStatusBadge
                                    isOnline={server.is_online}
                                    playerCount={server.current_players}
                                    maxPlayers={server.max_players}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {server.category && <CategoryBadge category={server.category} asLink />}
                                {server.tags?.map((tag) => (
                                    <TagChip key={tag.id} tag={tag} asLink />
                                ))}
                            </div>
                        </div>

                        {/* IP Address */}
                        <div className="mb-6 rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Server IP</p>
                                    <p className="font-mono text-xl font-semibold">
                                        {server.ip_address}
                                        {server.port !== 25565 && `:${server.port}`}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={copyIp}
                                    className="rounded-xl"
                                >
                                    <Copy className="mr-2 size-4" />
                                    {copied ? 'Copied!' : 'Copy IP'}
                                </Button>
                            </div>
                        </div>

                        {/* Description */}
                        {server.description && (
                            <div className="mb-6 rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
                                <h2 className="mb-3 text-lg font-semibold">About</h2>
                                <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                                    {server.description}
                                </p>
                            </div>
                        )}

                        {/* Server Info */}
                        <div className="mb-6 rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
                            <h2 className="mb-4 text-lg font-semibold">Server Information</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* Server Type */}
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-violet-500/10">
                                        <Monitor className="size-4 text-violet-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Platform</p>
                                        <p className="font-medium">{serverTypeLabels[server.server_type] || 'Java Edition'}</p>
                                    </div>
                                </div>

                                {/* Server Software */}
                                {server.server_software && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10">
                                            <Package className="size-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Software</p>
                                            <p className="font-medium">{serverSoftwareLabels[server.server_software] || server.server_software}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Country */}
                                {server.country && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-green-500/10">
                                            <MapPin className="size-4 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Location</p>
                                            <p className="font-medium">{countryLabels[server.country] || server.country}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Language */}
                                {server.language && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
                                            <Languages className="size-4 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Language</p>
                                            <p className="font-medium">{languageLabels[server.language] || server.language}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Minecraft Versions */}
                                {server.minecraft_versions && server.minecraft_versions.length > 0 && (
                                    <div className="flex items-center gap-3 sm:col-span-2">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10">
                                            <Monitor className="size-4 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Versions</p>
                                            <p className="font-medium">
                                                {server.minecraft_versions.length === 1
                                                    ? server.minecraft_versions[0]
                                                    : `${server.minecraft_versions[0]} - ${server.minecraft_versions[server.minecraft_versions.length - 1]}`}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Modded Info */}
                                {server.is_modded && (
                                    <div className="flex items-center gap-3 sm:col-span-2">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-orange-500/10">
                                            <Package className="size-4 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Modpack</p>
                                            <p className="font-medium">
                                                {server.modpack_name || 'Modded Server'}
                                                {server.modpack_url && (
                                                    <a
                                                        href={server.modpack_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-2 inline-flex items-center text-violet-500 hover:underline"
                                                    >
                                                        <ExternalLink className="size-3" />
                                                    </a>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Founded Date */}
                                {server.founded_at && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-pink-500/10">
                                            <Calendar className="size-4 text-pink-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Founded</p>
                                            <p className="font-medium">
                                                {new Date(server.founded_at).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Age Restriction */}
                                {server.minimum_age && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-red-500/10">
                                            <Shield className="size-4 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Age</p>
                                            <p className="font-medium">{server.minimum_age}+</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Badges row */}
                            <div className="mt-4 flex flex-wrap gap-2 border-t border-border/50 pt-4">
                                {server.accepts_cracked && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                                        <Unlock className="size-3" />
                                        Cracked
                                    </span>
                                )}
                                {server.is_whitelisted && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                                        <Lock className="size-3" />
                                        Whitelist
                                    </span>
                                )}
                                {server.server_type === 'crossplay' && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                                        <Users className="size-3" />
                                        Crossplay
                                    </span>
                                )}
                                {server.is_modded && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-600 dark:text-orange-400">
                                        <Package className="size-3" />
                                        Modded
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Links */}
                        {(server.website_url || server.discord_url) && (
                            <div className="mb-6 flex flex-wrap gap-3">
                                {server.website_url && (
                                    <Button variant="outline" asChild className="rounded-xl">
                                        <a href={server.website_url} target="_blank" rel="noopener noreferrer">
                                            <Globe className="mr-2 size-4" />
                                            Website
                                            <ExternalLink className="ml-2 size-3" />
                                        </a>
                                    </Button>
                                )}
                                {server.discord_url && (
                                    <Button variant="outline" asChild className="rounded-xl">
                                        <a href={server.discord_url} target="_blank" rel="noopener noreferrer">
                                            <MessageCircle className="mr-2 size-4" />
                                            Discord
                                            <ExternalLink className="ml-2 size-3" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Leaderboard */}
                        <LeaderboardTable
                            voters={topVoters}
                            title="Top Voters This Month"
                            className="mb-6"
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Vote Card */}
                        <div className="rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
                            <h2 className="mb-4 text-lg font-semibold">Vote for this Server</h2>
                            {auth.user ? (
                                <div className="space-y-3">
                                    <VoteButton
                                        serverSlug={server.slug}
                                        canVote={canVote}
                                        cooldownRemaining={cooldownRemaining}
                                        size="lg"
                                        className="w-full rounded-xl"
                                    />
                                    <FavoriteButton
                                        serverSlug={server.slug}
                                        isFavorited={isFavorited}
                                        className="w-full rounded-xl"
                                    />
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        Log in to vote for this server
                                    </p>
                                    <Button asChild className="w-full rounded-xl">
                                        <Link href="/login">Log in to Vote</Link>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
                            <h2 className="mb-4 text-lg font-semibold">Statistics</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-violet-500">Monthly Votes</span>
                                    <span className="font-semibold">{server.monthly_votes?.toLocaleString() || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-violet-500">Total Votes</span>
                                    <span className="font-semibold">{server.total_votes?.toLocaleString() || 0}</span>
                                </div>
                                {server.current_players !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-violet-500">Players Online</span>
                                        <span className="font-semibold">
                                            {server.current_players}
                                            {server.max_players && ` / ${server.max_players}`}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
