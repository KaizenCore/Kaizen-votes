import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Globe, Heart, LayoutGrid, Plus, Server, Vote } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'My Servers',
        href: '/dashboard/servers',
        icon: Server,
    },
    {
        title: 'My Votes',
        href: '/profile/votes',
        icon: Vote,
    },
    {
        title: 'My Favorites',
        href: '/profile/favorites',
        icon: Heart,
    },
    {
        title: 'Browse Servers',
        href: '/servers',
        icon: Globe,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Kaizen Votes',
        href: '/',
        icon: Vote,
    },
    {
        title: 'Documentation',
        href: '/help',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { ownedServers } = usePage<SharedData>().props;
    const page = usePage();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                {/* My Servers */}
                {ownedServers && ownedServers.length > 0 && (
                    <SidebarGroup className="px-2 py-0">
                        <SidebarGroupLabel>My Servers</SidebarGroupLabel>
                        <SidebarMenu>
                            {ownedServers.map((server) => (
                                <SidebarMenuItem key={server.id}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={page.url.includes(`/servers/${server.slug}`)}
                                        tooltip={{ children: server.name }}
                                    >
                                        <Link href={`/dashboard/servers/${server.slug}`} prefetch>
                                            <Server className="size-4" />
                                            <span className="truncate">{server.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={{ children: 'Add Server' }}
                                >
                                    <Link href="/servers/create">
                                        <Plus className="size-4" />
                                        <span>Add Server</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
