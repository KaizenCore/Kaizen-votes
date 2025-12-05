import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Clock, Gift, Vote } from 'lucide-react';
import * as React from 'react';

import { MinecraftUsernameInput, ServerBanner, VoteCooldown } from '@/components/servers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem, Reward, VotePageProps } from '@/types';

type ExtendedVotePageProps = VotePageProps & {
    availableRewards: Reward[];
};

const MINECRAFT_USERNAME_KEY = 'kaizen_minecraft_username';

export default function VotePage({ server, canVote, cooldownRemaining, availableRewards, savedMinecraftUsername, previousUsernames = [] }: ExtendedVotePageProps) {
    // Initialize from saved profile or localStorage
    const getInitialUsername = () => {
        if (savedMinecraftUsername) return savedMinecraftUsername;
        if (typeof window !== 'undefined') {
            return localStorage.getItem(MINECRAFT_USERNAME_KEY) || '';
        }
        return '';
    };

    const [minecraftUsername, setMinecraftUsername] = React.useState(getInitialUsername);
    const [error, setError] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Servers', href: '/servers' },
        { title: server.name, href: `/servers/${server.slug}` },
        { title: 'Vote', href: `/servers/${server.slug}/vote` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!minecraftUsername.trim()) {
            setError('Please enter your Minecraft username');
            return;
        }

        if (minecraftUsername.length < 3 || minecraftUsername.length > 16) {
            setError('Minecraft username must be between 3 and 16 characters');
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(minecraftUsername)) {
            setError('Minecraft username can only contain letters, numbers, and underscores');
            return;
        }

        setIsSubmitting(true);

        // Save to localStorage for future visits
        localStorage.setItem(MINECRAFT_USERNAME_KEY, minecraftUsername);

        router.post(`/servers/${server.slug}/vote`, {
            minecraft_username: minecraftUsername,
        }, {
            onError: (errors) => {
                setError(errors.minecraft_username || errors.cooldown || 'Failed to submit vote');
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Vote for ${server.name} - Kaizen Votes`} />

            <div className="flex min-h-[80vh] items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        {server.banner_url && (
                            <div className="mx-auto mb-4 w-full overflow-hidden rounded-lg">
                                <ServerBanner url={server.banner_url} alt={server.name} aspectRatio="video" />
                            </div>
                        )}
                        <CardTitle className="text-2xl">Vote for {server.name}</CardTitle>
                        <CardDescription>
                            {canVote
                                ? 'Enter your Minecraft username to vote'
                                : 'You have already voted recently'}
                        </CardDescription>
                    </CardHeader>

                    {canVote ? (
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <MinecraftUsernameInput
                                    id="minecraft_username"
                                    value={minecraftUsername}
                                    onChange={setMinecraftUsername}
                                    error={error}
                                    placeholder="Steve"
                                    suggestions={previousUsernames}
                                    autoFocus
                                />

                                {availableRewards && availableRewards.length > 0 && (
                                    <div className="rounded-lg border p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Gift className="size-4 text-primary" />
                                            <span className="font-medium">Available Rewards</span>
                                        </div>
                                        <div className="space-y-2">
                                            {availableRewards.map((reward) => (
                                                <div
                                                    key={reward.id}
                                                    className="flex items-center justify-between rounded-lg bg-muted/50 p-2"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium">{reward.name}</p>
                                                        {reward.description && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {reward.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {reward.chance < 100 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {reward.chance}%
                                                            </Badge>
                                                        )}
                                                        {reward.min_votes && reward.min_votes > 0 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                {reward.min_votes}+ votes
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Vote className="mr-2 size-4" />
                                            Submit Vote
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => router.visit(`/servers/${server.slug}`)}
                                >
                                    <ArrowLeft className="mr-2 size-4" />
                                    Back to Server
                                </Button>
                            </CardFooter>
                        </form>
                    ) : (
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                                    <Clock className="size-8 text-muted-foreground" />
                                </div>
                                <p className="text-center text-muted-foreground">
                                    You can vote again for this server once the cooldown expires.
                                </p>
                            </div>

                            {cooldownRemaining && cooldownRemaining > 0 && (
                                <VoteCooldown cooldownRemaining={cooldownRemaining} showProgress />
                            )}

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.visit(`/servers/${server.slug}`)}
                            >
                                <ArrowLeft className="mr-2 size-4" />
                                Back to Server
                            </Button>
                        </CardContent>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
