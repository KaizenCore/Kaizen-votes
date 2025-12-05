import { Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { TopVoter } from '@/types';

interface LeaderboardTableProps {
    voters: TopVoter[];
    title?: string;
    showRank?: boolean;
    showAvatar?: boolean;
    className?: string;
}

function getMinecraftAvatarUrl(username: string): string {
    return `https://mc-heads.net/avatar/${username}/32`;
}

export function LeaderboardTable({ voters, title, showRank = true, showAvatar = true, className }: LeaderboardTableProps) {
    const { t } = useTranslation();
    const displayTitle = title ?? t('leaderboard.topVoters');

    if (voters.length === 0) {
        return (
            <div className={cn('rounded-lg border p-6 text-center text-muted-foreground', className)}>
                <Trophy className="mx-auto mb-2 size-8 opacity-50" />
                <p>{t('leaderboard.noVotesYet')}</p>
            </div>
        );
    }

    return (
        <div className={cn('rounded-lg border', className)}>
            {displayTitle && (
                <div className="flex items-center gap-2 border-b px-4 py-3">
                    <Trophy className="size-4 text-yellow-500" />
                    <h3 className="font-semibold">{displayTitle}</h3>
                </div>
            )}
            <Table>
                <TableHeader>
                    <TableRow>
                        {showRank && <TableHead className="w-12">#</TableHead>}
                        <TableHead>{t('leaderboard.player')}</TableHead>
                        <TableHead className="text-right">{t('leaderboard.votes')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {voters.map((voter) => (
                        <TableRow key={voter.minecraft_username}>
                            {showRank && (
                                <TableCell className="font-medium">
                                    <RankBadge rank={voter.rank} />
                                </TableCell>
                            )}
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {showAvatar && (
                                        <Avatar className="size-6">
                                            <AvatarImage
                                                src={getMinecraftAvatarUrl(voter.minecraft_username)}
                                                alt={voter.minecraft_username}
                                            />
                                            <AvatarFallback className="text-xs">
                                                {voter.minecraft_username.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <span className="font-medium">{voter.minecraft_username}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">{voter.vote_count}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) {
        return <span className="text-yellow-500">🥇</span>;
    }
    if (rank === 2) {
        return <span className="text-gray-400">🥈</span>;
    }
    if (rank === 3) {
        return <span className="text-amber-600">🥉</span>;
    }
    return <span className="text-muted-foreground">{rank}</span>;
}
