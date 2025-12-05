import { Link } from '@inertiajs/react';
import { Clock, Vote } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface VoteButtonProps {
    serverSlug: string;
    canVote: boolean;
    cooldownRemaining?: number;
    size?: 'default' | 'sm' | 'lg';
    className?: string;
}

export function VoteButton({ serverSlug, canVote, cooldownRemaining, size = 'default', className }: VoteButtonProps) {
    if (!canVote && cooldownRemaining && cooldownRemaining > 0) {
        return <VoteCooldown cooldownRemaining={cooldownRemaining} size={size} className={className} />;
    }

    return (
        <Button asChild size={size} className={cn('gap-2', className)}>
            <Link href={`/servers/${serverSlug}/vote`}>
                <Vote className="size-4" />
                Vote Now
            </Link>
        </Button>
    );
}

interface VoteCooldownProps {
    cooldownRemaining: number;
    size?: 'default' | 'sm' | 'lg';
    showProgress?: boolean;
    className?: string;
}

export function VoteCooldown({ cooldownRemaining, size = 'default', showProgress = true, className }: VoteCooldownProps) {
    const hours = Math.floor(cooldownRemaining / 3600);
    const minutes = Math.floor((cooldownRemaining % 3600) / 60);
    const totalCooldown = 24 * 60 * 60; // 24 hours in seconds
    const progress = ((totalCooldown - cooldownRemaining) / totalCooldown) * 100;

    const formatTime = () => {
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <Button variant="outline" size={size} disabled className="gap-2">
                <Clock className="size-4" />
                {formatTime()} until next vote
            </Button>
            {showProgress && (
                <Progress value={progress} className="h-1" />
            )}
        </div>
    );
}
