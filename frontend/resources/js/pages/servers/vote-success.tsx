import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Flame, Gift, Home, Vote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ServerBanner } from '@/components/servers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Reward, VoteSuccessPageProps } from '@/types';

type ExtendedVoteSuccessProps = Omit<VoteSuccessPageProps, 'rewards'> & {
    earnedRewards: Reward[];
};

export default function VoteSuccess({ server, vote, earnedRewards }: ExtendedVoteSuccessProps) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('nav.servers'), href: '/servers' },
        { title: server.name, href: `/servers/${server.slug}` },
        { title: t('vote.success'), href: `/servers/${server.slug}/vote/${vote.id}/success` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('vote.success')} - ${server.name}`} />

            <div className="flex min-h-[80vh] items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        {server.banner_url && (
                            <div className="mx-auto mb-4 w-full overflow-hidden rounded-lg">
                                <ServerBanner url={server.banner_url} alt={server.name} aspectRatio="video" />
                            </div>
                        )}
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-500/10">
                            <CheckCircle2 className="size-10 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl">{t('vote.success')}</CardTitle>
                        <CardDescription>
                            {t('vote.thankYou', { server: server.name })}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {vote.streak > 1 && (
                            <div className="flex items-center justify-center gap-2 rounded-lg bg-orange-500/10 p-4">
                                <Flame className="size-6 text-orange-500" />
                                <span className="text-lg font-bold text-orange-500">
                                    {t('streak.dayStreak', { count: vote.streak })}
                                </span>
                            </div>
                        )}

                        <div className="rounded-lg bg-muted p-4">
                            <div className="mb-2 text-sm text-muted-foreground">{t('vote.voteDetails')}</div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">{t('vote.player')}</span>
                                    <span className="font-medium">{vote.minecraft_username}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">{t('vote.time')}</span>
                                    <span className="font-medium">{vote.created_at}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">{t('streak.title')}</span>
                                    <span className="flex items-center gap-1 font-medium">
                                        <Flame className="size-4 text-orange-500" />
                                        {vote.streak} {vote.streak === 1 ? t('streak.day') : t('streak.days')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {earnedRewards.length > 0 && (
                            <div>
                                <div className="mb-3 flex items-center gap-2">
                                    <Gift className="size-4 text-primary" />
                                    <span className="font-medium">{t('rewards.earned')}</span>
                                </div>
                                <div className="space-y-2">
                                    {earnedRewards.map((reward) => (
                                        <div
                                            key={reward.id}
                                            className="flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/5 p-3"
                                        >
                                            <div>
                                                <p className="font-medium">{reward.name}</p>
                                                {reward.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {reward.description}
                                                    </p>
                                                )}
                                            </div>
                                            <CheckCircle2 className="size-5 text-green-500" />
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-3 text-center text-sm text-muted-foreground">
                                    {t('rewards.claim')}
                                </p>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3">
                        <Button asChild className="w-full" size="lg">
                            <Link href={`/servers/${server.slug}`}>
                                <Vote className="mr-2 size-4" />
                                {t('vote.backToServer')}
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full">
                            <Link href="/servers">
                                <Home className="mr-2 size-4" />
                                {t('vote.browseMore')}
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
