import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, Menu, X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header
                className={cn(
                    'fixed top-0 z-50 w-full transition-all duration-300',
                    scrolled
                        ? 'border-b border-border/40 bg-background/80 backdrop-blur-xl'
                        : 'bg-transparent',
                )}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                            <span className="text-sm font-bold text-white">K</span>
                        </div>
                        <span className="text-lg font-semibold tracking-tight">Kaizen</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-8 md:flex">
                        <Link
                            href="/servers"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Servers
                        </Link>
                        <Link
                            href="/servers?sort=votes_month"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Top Voted
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="gap-2">
                                        <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-xs font-medium text-white">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="hidden sm:inline">{auth.user.name}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings/profile">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/logout" method="post" as="button" className="w-full">
                                            Log out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="hidden items-center gap-2 sm:flex">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">Log in</Link>
                                </Button>
                                <Button
                                    size="sm"
                                    asChild
                                    className="bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                                >
                                    <Link href="/register">Get Started</Link>
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
                        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
                            <Link
                                href="/servers"
                                className="rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Servers
                            </Link>
                            <Link
                                href="/servers?sort=votes_month"
                                className="rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Top Voted
                            </Link>
                            {!auth.user && (
                                <div className="mt-4 flex flex-col gap-2 border-t border-border/40 pt-4">
                                    <Button variant="outline" asChild>
                                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                            Log in
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        className="bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                                    >
                                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                            Get Started
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t border-border/40 bg-muted/30">
                <div className="mx-auto max-w-7xl px-6 py-16">
                    <div className="grid gap-12 md:grid-cols-4">
                        {/* Brand */}
                        <div className="md:col-span-2">
                            <Link href="/" className="flex items-center gap-2.5">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                                    <span className="text-sm font-bold text-white">K</span>
                                </div>
                                <span className="text-lg font-semibold tracking-tight">Kaizen</span>
                            </Link>
                            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                                The modern platform for discovering and voting for the best Minecraft servers. Built for
                                players, by players.
                            </p>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="mb-4 text-sm font-semibold">Platform</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="/servers"
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Browse Servers
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/servers/create"
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Add Your Server
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/tools/banner-generator"
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Banner Generator
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 text-sm font-semibold">Account</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="/login"
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Log in
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/register"
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Create Account
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 md:flex-row">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Kaizen Votes. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link
                                href="#"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Privacy
                            </Link>
                            <Link
                                href="#"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
