import { AnimatedBanner } from '@/components/animated-banner';
import { cn } from '@/lib/utils';
import type { BannerConfig } from '@/types';

interface ServerBannerProps {
    url?: string;
    config?: BannerConfig;
    alt: string;
    className?: string;
    aspectRatio?: 'video' | 'banner' | 'square';
}

export function ServerBanner({ url, config, alt, className, aspectRatio = 'banner' }: ServerBannerProps) {
    const aspectClasses = {
        video: 'aspect-video',
        banner: 'aspect-[3/1]',
        square: 'aspect-square',
    };

    // Animated banner if config exists
    if (config) {
        return (
            <div className={cn('overflow-hidden', aspectClasses[aspectRatio], className)}>
                <AnimatedBanner config={config} className="size-full" />
            </div>
        );
    }

    if (!url) {
        return (
            <div
                className={cn(
                    'flex items-center justify-center bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-violet-500/5',
                    aspectClasses[aspectRatio],
                    className,
                )}
            >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-violet-500/25">
                    {alt.charAt(0).toUpperCase()}
                </div>
            </div>
        );
    }

    return (
        <div className={cn('overflow-hidden', aspectClasses[aspectRatio], className)}>
            <img
                src={url}
                alt={alt}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<div class="flex size-full items-center justify-center bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-violet-500/5"><div class="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-violet-500/25">${alt.charAt(0).toUpperCase()}</div></div>`;
                }}
            />
        </div>
    );
}
