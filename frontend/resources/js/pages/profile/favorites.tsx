import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Heart, Server } from 'lucide-react';

import { ServerCard } from '@/components/servers';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, ProfileFavoritesPageProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Favorites', href: '/profile/favorites' },
];

export default function ProfileFavorites({ favorites }: ProfileFavoritesPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Favorites" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20">
                        <Heart className="size-6 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">My Favorites</h1>
                        <p className="text-muted-foreground">
                            {favorites.total} server{favorites.total !== 1 ? 's' : ''} in your favorites
                        </p>
                    </div>
                </div>

                {/* Content */}
                {favorites.data.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card/30 p-16 text-center">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted/50">
                            <Heart className="size-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-lg font-semibold">No favorites yet</p>
                        <p className="mt-1 text-muted-foreground">
                            Browse servers and click the heart to add them to your favorites
                        </p>
                        <Button asChild className="mt-6 rounded-xl">
                            <Link href="/servers">Browse Servers</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {favorites.data.map((server) => (
                                <ServerCard key={server.id} server={server} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {favorites.last_page > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!favorites.prev_page_url}
                                    onClick={() => favorites.prev_page_url && router.get(favorites.prev_page_url)}
                                    className="gap-2 rounded-xl"
                                >
                                    <ChevronLeft className="size-4" />
                                    Previous
                                </Button>
                                <div className="flex items-center gap-2 px-4">
                                    <span className="text-sm font-medium">{favorites.current_page}</span>
                                    <span className="text-sm text-muted-foreground">/</span>
                                    <span className="text-sm text-muted-foreground">{favorites.last_page}</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!favorites.next_page_url}
                                    onClick={() => favorites.next_page_url && router.get(favorites.next_page_url)}
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
        </AppLayout>
    );
}
