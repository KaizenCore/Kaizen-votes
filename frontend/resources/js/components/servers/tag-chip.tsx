import { Link } from '@inertiajs/react';

import { cn } from '@/lib/utils';
import type { Tag } from '@/types';

interface TagChipProps {
    tag: Tag;
    asLink?: boolean;
    size?: 'sm' | 'md';
    className?: string;
}

export function TagChip({ tag, asLink = false, size = 'md', className }: TagChipProps) {
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-1 text-xs',
    };

    const chipContent = (
        <span
            className={cn(
                'inline-flex items-center rounded-full font-medium transition-all',
                sizeClasses[size],
                className,
            )}
            style={{
                backgroundColor: `${tag.color}15`,
                color: tag.color,
            }}
        >
            {tag.name}
        </span>
    );

    if (asLink) {
        return (
            <Link href={`/servers?tags=${tag.slug}`} className="transition-opacity hover:opacity-80">
                {chipContent}
            </Link>
        );
    }

    return chipContent;
}
