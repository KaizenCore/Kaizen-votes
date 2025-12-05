import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    ownedServers?: Pick<Server, 'id' | 'name' | 'slug'>[];
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    is_admin?: boolean;
    created_at: string;
    updated_at: string;
    servers?: Server[];
    votes?: Vote[];
    [key: string]: unknown;
}

// Server voting system types

export type ServerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type RewardType = 'command' | 'item' | 'currency' | 'permission' | 'rank';
export type ServerType = 'java' | 'bedrock' | 'crossplay';
export type LauncherType = 'curseforge' | 'modrinth' | 'technic' | 'atlauncher' | 'ftb' | 'vanilla' | 'other';
export type ServerSoftware = 'vanilla' | 'paper' | 'spigot' | 'purpur' | 'fabric' | 'forge' | 'neoforge' | 'velocity' | 'bungeecord' | 'waterfall' | 'other';

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    sort_order: number;
    is_active: boolean;
    servers_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    color: string;
    created_at: string;
    updated_at: string;
}

export interface BannerConfig {
    text: string;
    subtitle?: string;
    gradient: string;
    pattern: string;
    patternColor?: string;
    textEffect: string;
    overlay: string;
    backgroundEffect: string;
    font: string;
    fontSize: number;
    subtitleSize: number;
    showSubtitle: boolean;
    particleCount: number;
    particleSpeed: number;
    textColor?: string;
    subtitleColor?: string;
    patternOpacity?: number;
    overlayOpacity?: number;
    animationOpacity?: number;
}

export interface Server {
    id: number;
    user_id: number;
    category_id: number;
    name: string;
    slug: string;
    description?: string;
    banner_url?: string;
    banner_config?: BannerConfig;
    ip_address: string;
    port: number;
    // Game info
    server_type: ServerType;
    bedrock_port?: number;
    is_modded: boolean;
    modpack_name?: string;
    modpack_url?: string;
    launcher?: LauncherType;
    minecraft_versions?: string[];
    // Server details
    server_software?: ServerSoftware;
    country?: string;
    language?: string;
    accepts_cracked: boolean;
    is_whitelisted: boolean;
    minimum_age?: number;
    founded_at?: string;
    // Links
    website_url?: string;
    discord_url?: string;
    discord_webhook_url?: string;
    status: ServerStatus;
    total_votes: number;
    monthly_votes: number;
    is_featured: boolean;
    is_online: boolean;
    current_players?: number;
    max_players?: number;
    last_ping_at?: string;
    approved_at?: string;
    created_at: string;
    updated_at: string;
    // Relations
    owner?: User;
    category?: Category;
    tags?: Tag[];
    votes?: Vote[];
    rewards?: Reward[];
    tokens?: ServerToken[];
    // Computed
    votes_count?: number;
}

export interface Vote {
    id: number;
    server_id: number;
    user_id: number;
    minecraft_username: string;
    minecraft_uuid?: string;
    ip_address?: string;
    claimed: boolean;
    claimed_at?: string;
    reward_ids?: number[];
    created_at: string;
    updated_at: string;
    // Relations
    server?: Server;
    user?: User;
}

export interface Reward {
    id: number;
    server_id: number;
    name: string;
    description?: string;
    reward_type: RewardType;
    commands?: string[];
    chance: number;
    is_active: boolean;
    min_votes?: number;
    daily_limit?: number;
    sort_order?: number;
    created_at: string;
    updated_at: string;
}

export interface ServerToken {
    id: number;
    server_id: number;
    token?: string;
    pairing_code?: string;
    pairing_expires_at?: string;
    is_paired: boolean;
    is_active: boolean;
    paired_at?: string;
    last_used_at?: string;
    created_at: string;
    updated_at: string;
}

// Page props interfaces

export interface ServerFilters {
    category?: string;
    tags?: string[] | string;
    search?: string;
    sort?: 'votes_24h' | 'votes_month' | 'votes_total' | 'newest' | 'alphabetical';
    server_type?: ServerType;
    is_modded?: string;
    accepts_cracked?: string;
    is_whitelisted?: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url?: string;
    prev_page_url?: string;
    path: string;
    links: PaginationLink[];
}

export interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

export interface TopVoter {
    minecraft_username: string;
    vote_count: number;
    rank: number;
}

export interface RecentVote {
    id: number;
    minecraft_username: string;
    server_name: string;
    server_slug: string;
    created_at: string;
}

// Page-specific props

export interface HomePageProps {
    categories: Category[];
    featuredServers: Server[];
    topServers: Server[];
    recentVotes: RecentVote[];
}

export interface ServersIndexPageProps {
    servers: PaginatedData<Server>;
    categories: Category[];
    tags: Tag[];
    filters: ServerFilters;
}

export interface ServerShowPageProps {
    server: Server;
    topVoters: TopVoter[];
    canVote: boolean;
    cooldownRemaining?: number;
    isFavorited: boolean;
}

export interface ProfileFavoritesPageProps {
    favorites: PaginatedData<Server>;
}

export interface VotePageProps {
    server: Pick<Server, 'id' | 'name' | 'slug' | 'banner_url' | 'banner_config'>;
    canVote: boolean;
    cooldownRemaining?: number;
    previousUsernames?: string[];
    savedMinecraftUsername?: string;
}

export interface VoteSuccessPageProps {
    server: Pick<Server, 'id' | 'name' | 'slug' | 'banner_url' | 'banner_config'>;
    vote: {
        id: number;
        minecraft_username: string;
        created_at: string;
    };
    rewards: Reward[];
}

export interface DashboardPageProps {
    ownedServers: Server[];
    recentVotes: Vote[];
}

export interface DashboardServersPageProps {
    servers: Server[];
}

export interface VoteAnalyticsDay {
    date: string;
    votes: number;
}

export interface DashboardTopVoter {
    minecraft_username: string;
    vote_count: number;
}

export interface DashboardServerStats {
    votesLast7Days: number;
    votesLast30Days: number;
    uniqueVotersMonth: number;
}

export interface DashboardServerShowPageProps {
    server: Server;
    analytics: VoteAnalyticsDay[];
    topVoters: DashboardTopVoter[];
    recentVotes: Vote[];
    stats: DashboardServerStats;
}

export interface RewardTypeOption {
    value: RewardType;
    label: string;
}

export interface DashboardServerRewardsPageProps {
    server: Pick<Server, 'id' | 'name' | 'slug'>;
    rewards: Reward[];
    rewardTypes: RewardTypeOption[];
}

export interface ProfileVoteStats {
    totalVotes: number;
    votesThisMonth: number;
    uniqueServers: number;
}

export interface ProfileTopServer {
    server_id: number;
    vote_count: number;
    server: Pick<Server, 'id' | 'name' | 'slug'>;
}

export interface ProfileMonthlyVote {
    month: string;
    votes: number;
}

export interface ProfileVotesPageProps {
    votes: PaginatedData<Vote>;
    stats: ProfileVoteStats;
    topServers: ProfileTopServer[];
    monthlyVotes: ProfileMonthlyVote[];
}
