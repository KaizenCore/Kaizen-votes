import { Wifi, WifiOff } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ServerStatusIndicatorProps {
    isOnline: boolean;
    showLabel?: boolean;
    className?: string;
}

export function ServerStatusIndicator({ isOnline, showLabel = true, className }: ServerStatusIndicatorProps) {
    return (
        <div className={cn('flex items-center gap-1.5', className)}>
            <span
                className={cn(
                    'relative flex size-2.5 shrink-0',
                    isOnline && 'animate-pulse',
                )}
            >
                <span
                    className={cn(
                        'absolute inline-flex size-full rounded-full opacity-75',
                        isOnline ? 'bg-green-500' : 'bg-gray-400',
                    )}
                />
                <span
                    className={cn(
                        'relative inline-flex size-2.5 rounded-full',
                        isOnline ? 'bg-green-500' : 'bg-gray-400',
                    )}
                />
            </span>
            {showLabel && (
                <span className={cn('text-sm', isOnline ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground')}>
                    {isOnline ? 'Online' : 'Offline'}
                </span>
            )}
        </div>
    );
}

export function ServerStatusBadge({ isOnline, playerCount, maxPlayers }: { isOnline: boolean; playerCount?: number; maxPlayers?: number }) {
    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium',
                isOnline
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
            )}
        >
            {isOnline ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
            {isOnline && playerCount !== undefined && (
                <span className="text-muted-foreground">
                    ({playerCount}{maxPlayers && `/${maxPlayers}`})
                </span>
            )}
        </div>
    );
}
