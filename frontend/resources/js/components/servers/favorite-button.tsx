import { router, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';

interface FavoriteButtonProps {
    serverSlug: string;
    isFavorited: boolean;
    variant?: 'default' | 'icon';
    className?: string;
}

export function FavoriteButton({ serverSlug, isFavorited: initialFavorited, variant = 'default', className }: FavoriteButtonProps) {
    const { auth } = usePage<SharedData>().props;
    const [favorited, setFavorited] = React.useState(initialFavorited);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth?.user) {
            // Redirect to login
            router.visit('/login');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/servers/${serverSlug}/favorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFavorited(data.favorited);
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (variant === 'icon') {
        return (
            <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                disabled={isLoading}
                className={cn(
                    'size-9 rounded-full transition-all',
                    favorited && 'text-red-500 hover:text-red-600',
                    className
                )}
                title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
                <Heart className={cn('size-5 transition-all', favorited && 'fill-current')} />
            </Button>
        );
    }

    return (
        <Button
            variant={favorited ? 'default' : 'outline'}
            onClick={handleToggle}
            disabled={isLoading}
            className={cn(
                'gap-2 transition-all',
                favorited && 'bg-red-500 hover:bg-red-600 border-red-500',
                className
            )}
        >
            <Heart className={cn('size-4 transition-all', favorited && 'fill-current')} />
            {favorited ? 'Favorited' : 'Add to Favorites'}
        </Button>
    );
}
