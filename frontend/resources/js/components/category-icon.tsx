import {
    Box,
    Cloud,
    Flag,
    Gamepad2,
    Lock,
    Palette,
    Puzzle,
    Scroll,
    Swords,
    Tent,
    type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    tent: Tent,
    palette: Palette,
    swords: Swords,
    'gamepad-2': Gamepad2,
    gamepad2: Gamepad2,
    cloud: Cloud,
    flag: Flag,
    lock: Lock,
    scroll: Scroll,
    puzzle: Puzzle,
    box: Box,
};

interface CategoryIconProps {
    name?: string;
    className?: string;
}

export function CategoryIcon({ name, className }: CategoryIconProps) {
    if (!name) return null;

    const Icon = iconMap[name.toLowerCase()];
    if (!Icon) return null;

    return <Icon className={className} />;
}
