import { Copy, RefreshCw } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PairingCodeProps {
    code: string;
    expiresAt: string;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    className?: string;
}

export function PairingCode({ code, expiresAt, onRefresh, isRefreshing, className }: PairingCodeProps) {
    const [copied, setCopied] = React.useState(false);
    const [timeLeft, setTimeLeft] = React.useState('');

    React.useEffect(() => {
        const updateTimeLeft = () => {
            const now = new Date();
            const expires = new Date(expiresAt);
            const diff = expires.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft('Expired');
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        };

        updateTimeLeft();
        const interval = setInterval(updateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isExpired = timeLeft === 'Expired';

    return (
        <div className={cn('rounded-lg border bg-card p-6', className)}>
            <div className="mb-4 text-center">
                <p className="mb-2 text-sm text-muted-foreground">Pairing Code</p>
                <div
                    className={cn(
                        'mx-auto flex items-center justify-center gap-2 font-mono text-4xl font-bold tracking-widest',
                        isExpired && 'text-muted-foreground line-through',
                    )}
                >
                    {code.split('').map((char, i) => (
                        <span
                            key={i}
                            className="flex size-12 items-center justify-center rounded-lg border bg-muted"
                        >
                            {char}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mb-4 text-center">
                <p className={cn('text-sm', isExpired ? 'text-destructive' : 'text-muted-foreground')}>
                    {isExpired ? 'Code expired' : `Expires in ${timeLeft}`}
                </p>
            </div>

            <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={isExpired}>
                    <Copy className="mr-2 size-4" />
                    {copied ? 'Copied!' : 'Copy'}
                </Button>
                {onRefresh && (
                    <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
                        <RefreshCw className={cn('mr-2 size-4', isRefreshing && 'animate-spin')} />
                        Generate New
                    </Button>
                )}
            </div>

            <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
                <p className="font-medium">How to pair:</p>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-muted-foreground">
                    <li>Install the Kaizen Votes plugin on your server</li>
                    <li>
                        Run <code className="rounded bg-background px-1">/kaizen pair {code}</code>
                    </li>
                    <li>Your server will be connected automatically</li>
                </ol>
            </div>
        </div>
    );
}
