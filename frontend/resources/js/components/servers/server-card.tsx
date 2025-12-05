import { Link } from '@inertiajs/react';
import { Lock, Monitor, Package, Smartphone, Trophy, Unlock, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Server } from '@/types';

import { CategoryBadge } from './category-badge';
import { ServerBanner } from './server-banner';
import { TagChip } from './tag-chip';

// Server info badge component
function InfoBadge({ icon: Icon, label, variant = 'default' }: { icon: React.ElementType; label: string; variant?: 'default' | 'java' | 'bedrock' | 'crossplay' | 'modded' | 'cracked' | 'whitelist' }) {
    const variantClasses = {
        default: 'bg-muted/50 text-muted-foreground',
        java: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
        bedrock: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        crossplay: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
        modded: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        cracked: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        whitelist: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    };

    return (
        <span className={cn('inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium', variantClasses[variant])}>
            <Icon className="size-2.5" />
            {label}
        </span>
    );
}

interface ServerCardProps {
    server: Server;
    showCategory?: boolean;
}

export function ServerCard({ server, showCategory = true }: ServerCardProps) {
    return (
        <Link
            href={`/servers/${server.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/50 hover:bg-card hover:shadow-xl hover:shadow-violet-500/10"
        >
            {/* Banner */}
            <div className="relative overflow-hidden">
                <ServerBanner url={server.banner_url} config={server.banner_config} alt={server.name} />
                {/* Status indicator */}
                <div className="absolute right-3 top-3">
                    <div
                        className={cn(
                            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md',
                            server.is_online
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-zinc-500/20 text-zinc-400',
                        )}
                    >
                        <span
                            className={cn(
                                'size-1.5 rounded-full',
                                server.is_online ? 'bg-green-400 animate-pulse' : 'bg-zinc-400',
                            )}
                        />
                        {server.is_online ? 'Online' : 'Offline'}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-1 text-lg font-semibold tracking-tight transition-colors group-hover:text-violet-500">
                    {server.name}
                </h3>

                {showCategory && server.category && (
                    <div className="mt-2">
                        <CategoryBadge category={server.category} />
                    </div>
                )}

                {/* Server Info Badges */}
                <div className="mt-2 flex flex-wrap gap-1">
                    {/* Platform badge */}
                    {server.server_type === 'java' && (
                        <InfoBadge icon={Monitor} label="Java" variant="java" />
                    )}
                    {server.server_type === 'bedrock' && (
                        <InfoBadge icon={Smartphone} label="Bedrock" variant="bedrock" />
                    )}
                    {server.server_type === 'crossplay' && (
                        <InfoBadge icon={Users} label="Crossplay" variant="crossplay" />
                    )}
                    {/* Modded badge */}
                    {server.is_modded && (
                        <InfoBadge icon={Package} label="Modded" variant="modded" />
                    )}
                    {/* Cracked badge */}
                    {server.accepts_cracked && (
                        <InfoBadge icon={Unlock} label="Cracked" variant="cracked" />
                    )}
                    {/* Whitelist badge */}
                    {server.is_whitelisted && (
                        <InfoBadge icon={Lock} label="Whitelist" variant="whitelist" />
                    )}
                </div>

                {server.tags && server.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {server.tags.slice(0, 3).map((tag) => (
                            <TagChip key={tag.id} tag={tag} size="sm" />
                        ))}
                        {server.tags.length > 3 && (
                            <span className="flex items-center text-xs text-muted-foreground">
                                +{server.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {server.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{server.description}</p>
                )}

                {/* Stats */}
                <div className="mt-auto flex items-center gap-4 border-t border-border/50 pt-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Trophy className="size-4 text-violet-500" />
                        <span className="font-medium">{server.monthly_votes.toLocaleString()}</span>
                        <span className="text-xs">votes</span>
                    </div>
                    {server.current_players !== undefined && (
                        <div className="flex items-center gap-1.5">
                            <Users className="size-4 text-violet-500" />
                            <span className="font-medium">
                                {server.current_players}
                                {server.max_players && (
                                    <span className="text-muted-foreground/70">/{server.max_players}</span>
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
