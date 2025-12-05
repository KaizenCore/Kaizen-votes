import { Link } from '@inertiajs/react';
import { Gamepad2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryBadgeProps {
    category: Category;
    asLink?: boolean;
    className?: string;
}

export function CategoryBadge({ category, asLink = false, className }: CategoryBadgeProps) {
    const content = (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-500',
                className,
            )}
        >
            {category.icon ? (
                <span>{category.icon}</span>
            ) : (
                <Gamepad2 className="size-3" />
            )}
            {category.name}
        </span>
    );

    if (asLink) {
        return (
            <Link href={`/servers?category=${category.slug}`} className="transition-opacity hover:opacity-80">
                {content}
            </Link>
        );
    }

    return content;
}
