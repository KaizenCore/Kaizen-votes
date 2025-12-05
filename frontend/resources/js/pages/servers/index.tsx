import { Head, router } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Lock, Monitor, Package, Search, SlidersHorizontal, Sparkles, Unlock, X } from 'lucide-react';
import * as React from 'react';

import { ServerCard } from '@/components/servers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import type { ServersIndexPageProps, ServerType } from '@/types';

const defaultServers = { data: [], total: 0, current_page: 1, last_page: 1, per_page: 12, from: 0, to: 0, first_page_url: '', last_page_url: '', path: '', links: [] };

export default function ServersIndex(props: ServersIndexPageProps) {
    // Safely extract props with defaults
    const servers = props?.servers || defaultServers;
    const categories = Array.isArray(props?.categories) ? props.categories : [];
    const tags = Array.isArray(props?.tags) ? props.tags : [];
    const filters = props?.filters && typeof props.filters === 'object' ? props.filters : {};

    const [search, setSearch] = React.useState(String(filters?.search || ''));
    const [selectedCategory, setSelectedCategory] = React.useState(String(filters?.category || 'all'));
    const [selectedTags, setSelectedTags] = React.useState<string[]>(() => {
        const rawTags = filters?.tags;
        if (!rawTags) return [];
        if (Array.isArray(rawTags)) return rawTags.map(String);
        if (typeof rawTags === 'string') return rawTags.split(',').filter(Boolean);
        return [];
    });
    const [sort, setSort] = React.useState(String(filters?.sort || 'votes_month'));

    // Advanced filters
    const [serverType, setServerType] = React.useState<string>(String(filters?.server_type || 'all'));
    const [isModded, setIsModded] = React.useState<string>(String(filters?.is_modded || 'all'));
    const [acceptsCracked, setAcceptsCracked] = React.useState<string>(String(filters?.accepts_cracked || 'all'));
    const [isWhitelisted, setIsWhitelisted] = React.useState<string>(String(filters?.is_whitelisted || 'all'));
    const [showAdvanced, setShowAdvanced] = React.useState(
        Boolean(filters?.server_type || filters?.is_modded || filters?.accepts_cracked || filters?.is_whitelisted)
    );

    const applyFilters = React.useCallback(() => {
        router.get('/servers', {
            search: search || undefined,
            category: selectedCategory && selectedCategory !== 'all' ? selectedCategory : undefined,
            tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
            sort,
            server_type: serverType && serverType !== 'all' ? serverType : undefined,
            is_modded: isModded && isModded !== 'all' ? isModded : undefined,
            accepts_cracked: acceptsCracked && acceptsCracked !== 'all' ? acceptsCracked : undefined,
            is_whitelisted: isWhitelisted && isWhitelisted !== 'all' ? isWhitelisted : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [search, selectedCategory, selectedTags, sort, serverType, isModded, acceptsCracked, isWhitelisted]);

    React.useEffect(() => {
        const timeout = setTimeout(applyFilters, 300);
        return () => clearTimeout(timeout);
    }, [selectedCategory, selectedTags, sort, serverType, isModded, acceptsCracked, isWhitelisted]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('all');
        setSelectedTags([]);
        setSort('votes_month');
        setServerType('all');
        setIsModded('all');
        setAcceptsCracked('all');
        setIsWhitelisted('all');
        router.get('/servers');
    };

    const toggleTag = (tagSlug: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagSlug)
                ? prev.filter((t) => t !== tagSlug)
                : [...prev, tagSlug]
        );
    };

    const hasActiveFilters = search ||
        (selectedCategory && selectedCategory !== 'all') ||
        selectedTags.length > 0 ||
        sort !== 'votes_month' ||
        (serverType && serverType !== 'all') ||
        (isModded && isModded !== 'all') ||
        (acceptsCracked && acceptsCracked !== 'all') ||
        (isWhitelisted && isWhitelisted !== 'all');

    const advancedFilterCount = [
        serverType !== 'all' ? 1 : 0,
        isModded !== 'all' ? 1 : 0,
        acceptsCracked !== 'all' ? 1 : 0,
        isWhitelisted !== 'all' ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    return (
        <PublicLayout>
            <Head title="Browse Servers - Kaizen Votes" />

            {/* Header Section */}
            <section className="border-b border-border/50 bg-gradient-to-b from-violet-500/5 to-transparent pt-24 pb-12">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                            <Sparkles className="size-6 text-violet-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Browse Servers</h1>
                            <p className="text-muted-foreground">
                                Discover {servers.total.toLocaleString()} Minecraft servers
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Filters */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <form onSubmit={handleSearchSubmit} className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search servers..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-11 rounded-xl border-border/50 bg-card/50 pl-11 backdrop-blur-sm transition-colors focus:border-violet-500/50"
                            />
                        </form>

                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="h-11 w-full rounded-xl border-border/50 bg-card/50 backdrop-blur-sm md:w-48">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.slug}>
                                        {category.icon && <span className="mr-2">{category.icon}</span>}
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger className="h-11 w-full rounded-xl border-border/50 bg-card/50 backdrop-blur-sm md:w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="votes_month">Top Monthly</SelectItem>
                                <SelectItem value="votes_24h">Top Today</SelectItem>
                                <SelectItem value="votes_total">Top All Time</SelectItem>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="alphabetical">A-Z</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Advanced Filters */}
                    <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                                <Filter className="size-4" />
                                Advanced Filters
                                {advancedFilterCount > 0 && (
                                    <Badge variant="secondary" className="ml-1 size-5 rounded-full p-0 text-xs">
                                        {advancedFilterCount}
                                    </Badge>
                                )}
                                <ChevronDown className={cn('size-4 transition-transform', showAdvanced && 'rotate-180')} />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4">
                            <div className="grid gap-4 rounded-xl border border-border/50 bg-card/30 p-4 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4">
                                {/* Server Type */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium">
                                        <Monitor className="size-4 text-muted-foreground" />
                                        Platform
                                    </label>
                                    <Select value={serverType} onValueChange={setServerType}>
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue placeholder="All Platforms" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Platforms</SelectItem>
                                            <SelectItem value="java">Java Edition</SelectItem>
                                            <SelectItem value="bedrock">Bedrock Edition</SelectItem>
                                            <SelectItem value="crossplay">Crossplay</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Modded */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium">
                                        <Package className="size-4 text-muted-foreground" />
                                        Server Type
                                    </label>
                                    <Select value={isModded} onValueChange={setIsModded}>
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue placeholder="All Types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="false">Vanilla Only</SelectItem>
                                            <SelectItem value="true">Modded Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Cracked */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium">
                                        <Unlock className="size-4 text-muted-foreground" />
                                        Account Type
                                    </label>
                                    <Select value={acceptsCracked} onValueChange={setAcceptsCracked}>
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue placeholder="All Accounts" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Accounts</SelectItem>
                                            <SelectItem value="false">Premium Only</SelectItem>
                                            <SelectItem value="true">Cracked Accepted</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Whitelist */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium">
                                        <Lock className="size-4 text-muted-foreground" />
                                        Access
                                    </label>
                                    <Select value={isWhitelisted} onValueChange={setIsWhitelisted}>
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue placeholder="All Servers" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Servers</SelectItem>
                                            <SelectItem value="false">Open Servers</SelectItem>
                                            <SelectItem value="true">Whitelisted</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <SlidersHorizontal className="size-4" />
                                <span>Tags:</span>
                            </div>
                            {tags.map((tag) => (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleTag(tag.slug)}
                                    className={cn(
                                        'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                                        selectedTags.includes(tag.slug)
                                            ? 'ring-2 ring-offset-2 ring-offset-background'
                                            : 'opacity-60 hover:opacity-100',
                                    )}
                                    style={{
                                        backgroundColor: `${tag.color}15`,
                                        color: tag.color,
                                        ...(selectedTags.includes(tag.slug) && { ringColor: tag.color }),
                                    }}
                                >
                                    {tag.name}
                                </button>
                            ))}
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="gap-1.5 rounded-full text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-3" />
                                    Clear All
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Results */}
                {servers.data.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border/50 bg-card/30 p-16 text-center backdrop-blur-sm">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted/50">
                            <Search className="size-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-lg font-semibold">No servers found</p>
                        <p className="mt-1 text-muted-foreground">
                            Try adjusting your filters or search query
                        </p>
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                className="mt-6 rounded-xl"
                                onClick={clearFilters}
                            >
                                Clear all filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {servers.data.map((server) => (
                                <ServerCard key={server.id} server={server} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {servers.last_page > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!servers.prev_page_url}
                                    onClick={() => servers.prev_page_url && router.get(servers.prev_page_url)}
                                    className="gap-2 rounded-xl"
                                >
                                    <ChevronLeft className="size-4" />
                                    Previous
                                </Button>
                                <div className="flex items-center gap-2 px-4">
                                    <span className="text-sm font-medium">{servers.current_page}</span>
                                    <span className="text-sm text-muted-foreground">/</span>
                                    <span className="text-sm text-muted-foreground">{servers.last_page}</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!servers.next_page_url}
                                    onClick={() => servers.next_page_url && router.get(servers.next_page_url)}
                                    className="gap-2 rounded-xl"
                                >
                                    Next
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PublicLayout>
    );
}
