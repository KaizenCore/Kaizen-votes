import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, CheckCircle2, ClipboardPaste, ExternalLink, Loader2, Server, Sparkles, Trash2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { CategoryIcon } from '@/components/category-icon';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnimatedBanner } from '@/components/animated-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BannerConfig, BreadcrumbItem, Category, LauncherType, Server as ServerType, ServerSoftware, ServerType as ServerTypeEnum, Tag } from '@/types';

interface EditServerPageProps {
    server: ServerType;
    categories: Category[];
    tags: Tag[];
}

interface FormData {
    name: string;
    category_id: string;
    description: string;
    ip_address: string;
    port: string;
    server_type: ServerTypeEnum;
    bedrock_port: string;
    is_modded: boolean;
    modpack_name: string;
    modpack_url: string;
    launcher: LauncherType | '';
    version_range: [number, number]; // [minIndex, maxIndex] in minecraftVersions array
    server_software: ServerSoftware | '';
    country: string;
    language: string;
    accepts_cracked: boolean;
    is_whitelisted: boolean;
    minimum_age: string;
    founded_at: string;
    banner_url: string;
    banner_config: BannerConfig | null;
    website_url: string;
    discord_url: string;
    discord_webhook_url: string;
    tags: number[];
}

const serverTypes: { value: ServerTypeEnum; label: string; description: string }[] = [
    { value: 'java', label: 'Java Edition', description: 'PC/Mac players only' },
    { value: 'bedrock', label: 'Bedrock Edition', description: 'Console, mobile & Windows 10' },
    { value: 'crossplay', label: 'Crossplay', description: 'Both Java & Bedrock players' },
];

const launchers: { value: LauncherType; label: string }[] = [
    { value: 'curseforge', label: 'CurseForge' },
    { value: 'modrinth', label: 'Modrinth' },
    { value: 'technic', label: 'Technic Launcher' },
    { value: 'atlauncher', label: 'ATLauncher' },
    { value: 'ftb', label: 'FTB App' },
    { value: 'vanilla', label: 'Vanilla (Manual mods)' },
    { value: 'other', label: 'Other' },
];

// Versions from oldest to newest for the slider
const minecraftVersions = [
    '1.7.10',
    '1.8.9',
    '1.9.4',
    '1.10.2',
    '1.11.2',
    '1.12.2',
    '1.13.2',
    '1.14.4',
    '1.15.2',
    '1.16', '1.16.1', '1.16.2', '1.16.3', '1.16.4', '1.16.5',
    '1.17', '1.17.1',
    '1.18', '1.18.1', '1.18.2',
    '1.19', '1.19.1', '1.19.2', '1.19.3', '1.19.4',
    '1.20', '1.20.1', '1.20.2', '1.20.3', '1.20.4', '1.20.5', '1.20.6',
    '1.21', '1.21.1', '1.21.2', '1.21.3', '1.21.4', '1.21.5', '1.21.6', '1.21.7', '1.21.8', '1.21.9', '1.21.10',
];

const serverSoftwareOptions: { value: ServerSoftware; label: string }[] = [
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'paper', label: 'Paper' },
    { value: 'spigot', label: 'Spigot' },
    { value: 'purpur', label: 'Purpur' },
    { value: 'fabric', label: 'Fabric' },
    { value: 'forge', label: 'Forge' },
    { value: 'neoforge', label: 'NeoForge' },
    { value: 'velocity', label: 'Velocity (Proxy)' },
    { value: 'bungeecord', label: 'BungeeCord (Proxy)' },
    { value: 'waterfall', label: 'Waterfall (Proxy)' },
    { value: 'other', label: 'Other' },
];

const countries = [
    { value: 'FR', label: '🇫🇷 France' },
    { value: 'US', label: '🇺🇸 United States' },
    { value: 'CA', label: '🇨🇦 Canada' },
    { value: 'GB', label: '🇬🇧 United Kingdom' },
    { value: 'DE', label: '🇩🇪 Germany' },
    { value: 'NL', label: '🇳🇱 Netherlands' },
    { value: 'BE', label: '🇧🇪 Belgium' },
    { value: 'CH', label: '🇨🇭 Switzerland' },
    { value: 'ES', label: '🇪🇸 Spain' },
    { value: 'IT', label: '🇮🇹 Italy' },
    { value: 'PT', label: '🇵🇹 Portugal' },
    { value: 'PL', label: '🇵🇱 Poland' },
    { value: 'RU', label: '🇷🇺 Russia' },
    { value: 'BR', label: '🇧🇷 Brazil' },
    { value: 'AU', label: '🇦🇺 Australia' },
    { value: 'JP', label: '🇯🇵 Japan' },
    { value: 'KR', label: '🇰🇷 South Korea' },
    { value: 'SG', label: '🇸🇬 Singapore' },
];

const languages = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
    { value: 'es', label: 'Español' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'nl', label: 'Nederlands' },
    { value: 'pl', label: 'Polski' },
    { value: 'ru', label: 'Русский' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
    { value: 'zh', label: '中文' },
    { value: 'multi', label: 'Multilingue' },
];

const ageOptions = [
    { value: '13', label: '13+' },
    { value: '16', label: '16+' },
    { value: '18', label: '18+' },
];

// Helper to convert versions array to range indices
const getVersionRangeFromArray = (versions: string[] | undefined): [number, number] => {
    if (!versions || versions.length === 0) {
        const maxIdx = minecraftVersions.length - 1;
        return [maxIdx - 4, maxIdx]; // Default to last 5 versions
    }
    const indices = versions.map((v) => minecraftVersions.indexOf(v)).filter((i) => i !== -1);
    if (indices.length === 0) {
        const maxIdx = minecraftVersions.length - 1;
        return [maxIdx - 4, maxIdx];
    }
    return [Math.min(...indices), Math.max(...indices)];
};

function InputError({ message, className }: { message?: string; className?: string }) {
    if (!message) return null;
    return (
        <p className={cn('text-sm text-destructive flex items-center gap-1', className)}>
            <AlertCircle className="size-3.5" />
            {message}
        </p>
    );
}

export default function EditServer({ server, categories, tags }: EditServerPageProps) {
    const { data, setData, patch, processing, errors, hasErrors, transform } = useForm<FormData>({
        name: server.name,
        category_id: server.category_id?.toString() || '',
        description: server.description || '',
        ip_address: server.ip_address,
        port: server.port?.toString() || '25565',
        server_type: server.server_type || 'java',
        bedrock_port: server.bedrock_port?.toString() || '19132',
        is_modded: server.is_modded || false,
        modpack_name: server.modpack_name || '',
        modpack_url: server.modpack_url || '',
        launcher: server.launcher || '',
        version_range: getVersionRangeFromArray(server.minecraft_versions),
        server_software: server.server_software || '',
        country: server.country || '',
        language: server.language || '',
        accepts_cracked: server.accepts_cracked || false,
        is_whitelisted: server.is_whitelisted || false,
        minimum_age: server.minimum_age?.toString() || '',
        founded_at: server.founded_at || '',
        banner_url: server.banner_url || '',
        banner_config: server.banner_config || null,
        website_url: server.website_url || '',
        discord_url: server.discord_url || '',
        discord_webhook_url: server.discord_webhook_url || '',
        tags: server.tags?.map((t) => t.id) || [],
    });

    // Transform version_range to minecraft_versions array before submission
    transform((formData) => ({
        ...formData,
        minecraft_versions: minecraftVersions.slice(formData.version_range[0], formData.version_range[1] + 1),
    }));

    // Get the selected versions from the range
    const selectedVersions = minecraftVersions.slice(data.version_range[0], data.version_range[1] + 1);
    const minVersion = minecraftVersions[data.version_range[0]];
    const maxVersion = minecraftVersions[data.version_range[1]];

    const pasteAnimatedConfig = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const config = JSON.parse(text) as BannerConfig;

            // Validate that it has required fields
            if (!config.text || !config.gradient) {
                throw new Error('Invalid config');
            }

            setData('banner_config', config);
            setData('banner_url', ''); // Clear static banner when using animated
            toast.success('Animated banner config applied!');
        } catch {
            toast.error('Invalid config', {
                description: 'Make sure you copied the config from the banner generator.',
            });
        }
    };

    const clearAnimatedBanner = () => {
        setData('banner_config', null);
        toast.success('Animated banner removed');
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Servers', href: '/dashboard/servers' },
        { title: server.name, href: `/dashboard/servers/${server.slug}` },
        { title: 'Edit', href: `/servers/${server.slug}/edit` },
    ];

    const toggleTag = (tagId: number) => {
        setData(
            'tags',
            data.tags.includes(tagId) ? data.tags.filter((id) => id !== tagId) : [...data.tags, tagId],
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        patch(`/servers/${server.slug}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Server updated successfully!', {
                    icon: <CheckCircle2 className="size-5" />,
                });
            },
            onError: (errors) => {
                const errorCount = Object.keys(errors).length;
                toast.error('Failed to update server', {
                    description: `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} in the form.`,
                });
            },
        });
    };

    const descriptionLength = data.description.length;
    const descriptionMinLength = 50;
    const descriptionMaxLength = 5000;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${server.name} - Kaizen Votes`} />

            <div className="mx-auto max-w-3xl p-4">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit(`/dashboard/servers/${server.slug}`)}
                    >
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Server
                    </Button>
                </div>

                {hasErrors && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="size-4" />
                        <AlertDescription>
                            Please fix the errors below before saving your changes.
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Server className="size-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Edit Server</CardTitle>
                                    <CardDescription>Update your server information</CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="font-semibold">Basic Information</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Server Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="My Awesome Server"
                                        aria-invalid={!!errors.name}
                                        className={cn(errors.name && 'border-destructive focus-visible:ring-destructive')}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category_id">Category *</Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) => setData('category_id', value)}
                                    >
                                        <SelectTrigger
                                            aria-invalid={!!errors.category_id}
                                            className={cn(errors.category_id && 'border-destructive focus-visible:ring-destructive')}
                                        >
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    <span className="flex items-center gap-2">
                                                        <CategoryIcon name={category.icon} className="size-4" />
                                                        {category.name}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Tell players about your server... (minimum 50 characters)"
                                        rows={4}
                                        aria-invalid={!!errors.description}
                                        className={cn(errors.description && 'border-destructive focus-visible:ring-destructive')}
                                    />
                                    <div className="flex items-center justify-between">
                                        <InputError message={errors.description} />
                                        <p
                                            className={cn(
                                                'text-xs text-muted-foreground ml-auto',
                                                descriptionLength < descriptionMinLength && 'text-amber-500',
                                                descriptionLength >= descriptionMinLength && descriptionLength <= descriptionMaxLength && 'text-green-500',
                                                descriptionLength > descriptionMaxLength && 'text-destructive',
                                            )}
                                        >
                                            {descriptionLength}/{descriptionMinLength} min characters
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Server Connection */}
                            <div className="space-y-4">
                                <h3 className="font-semibold">Server Connection</h3>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="ip_address">IP Address *</Label>
                                        <Input
                                            id="ip_address"
                                            value={data.ip_address}
                                            onChange={(e) => setData('ip_address', e.target.value)}
                                            placeholder="play.myserver.com"
                                            aria-invalid={!!errors.ip_address}
                                            className={cn(errors.ip_address && 'border-destructive focus-visible:ring-destructive')}
                                        />
                                        <InputError message={errors.ip_address} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="port">
                                            {data.server_type === 'bedrock' ? 'Bedrock Port' : 'Java Port'}
                                        </Label>
                                        <Input
                                            id="port"
                                            type="number"
                                            value={data.port}
                                            onChange={(e) => setData('port', e.target.value)}
                                            placeholder={data.server_type === 'bedrock' ? '19132' : '25565'}
                                            aria-invalid={!!errors.port}
                                            className={cn(errors.port && 'border-destructive focus-visible:ring-destructive')}
                                        />
                                        <InputError message={errors.port} />
                                    </div>
                                </div>

                                {/* Bedrock port for crossplay servers */}
                                {data.server_type === 'crossplay' && (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="bedrock_port">Bedrock Port</Label>
                                            <Input
                                                id="bedrock_port"
                                                type="number"
                                                value={data.bedrock_port}
                                                onChange={(e) => setData('bedrock_port', e.target.value)}
                                                placeholder="19132"
                                                aria-invalid={!!errors.bedrock_port}
                                                className={cn(errors.bedrock_port && 'border-destructive focus-visible:ring-destructive')}
                                            />
                                            <InputError message={errors.bedrock_port} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Game Type */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">Game Type</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Select the Minecraft edition your server supports
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    {serverTypes.map((type) => (
                                        <label
                                            key={type.value}
                                            className={cn(
                                                'flex cursor-pointer flex-col gap-1 rounded-lg border p-4 transition-colors hover:bg-accent',
                                                data.server_type === type.value && 'border-primary bg-primary/5',
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="server_type"
                                                    value={type.value}
                                                    checked={data.server_type === type.value}
                                                    onChange={(e) => setData('server_type', e.target.value as ServerTypeEnum)}
                                                    className="size-4"
                                                />
                                                <span className="font-medium">{type.label}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground pl-6">
                                                {type.description}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Minecraft Versions */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">Supported Versions</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Select the range of Minecraft versions your server supports
                                    </p>
                                </div>

                                <div className="space-y-6 rounded-lg border p-4 bg-accent/20">
                                    {/* Version display */}
                                    <div className="flex items-center justify-between">
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground mb-1">Min Version</p>
                                            <span className="inline-block rounded-md bg-primary/10 px-3 py-1.5 font-mono text-lg font-semibold text-primary">
                                                {minVersion}
                                            </span>
                                        </div>
                                        <div className="flex-1 flex items-center justify-center px-4">
                                            <div className="h-px flex-1 bg-border" />
                                            <span className="px-3 text-sm text-muted-foreground">
                                                {selectedVersions.length} version{selectedVersions.length > 1 ? 's' : ''}
                                            </span>
                                            <div className="h-px flex-1 bg-border" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground mb-1">Max Version</p>
                                            <span className="inline-block rounded-md bg-primary/10 px-3 py-1.5 font-mono text-lg font-semibold text-primary">
                                                {maxVersion}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Range slider */}
                                    <Slider
                                        value={data.version_range}
                                        onValueChange={(value) => setData('version_range', value as [number, number])}
                                        min={0}
                                        max={minecraftVersions.length - 1}
                                        step={1}
                                        className="w-full"
                                    />

                                    {/* Version markers */}
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>1.7.10</span>
                                        <span>1.12.2</span>
                                        <span>1.16.5</span>
                                        <span>1.19.4</span>
                                        <span>1.21.10</span>
                                    </div>
                                </div>
                            </div>

                            {/* Modded Server */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="is_modded"
                                        checked={data.is_modded}
                                        onCheckedChange={(checked) => setData('is_modded', checked === true)}
                                    />
                                    <div>
                                        <Label htmlFor="is_modded" className="cursor-pointer">Modded Server</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Check this if your server uses mods or modpacks
                                        </p>
                                    </div>
                                </div>

                                {data.is_modded && (
                                    <div className="space-y-4 rounded-lg border p-4 bg-accent/30">
                                        <div className="space-y-2">
                                            <Label htmlFor="launcher">Launcher / Platform</Label>
                                            <Select
                                                value={data.launcher}
                                                onValueChange={(value) => setData('launcher', value as LauncherType)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a launcher" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {launchers.map((launcher) => (
                                                        <SelectItem key={launcher.value} value={launcher.value}>
                                                            {launcher.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="modpack_name">Modpack Name</Label>
                                            <Input
                                                id="modpack_name"
                                                value={data.modpack_name}
                                                onChange={(e) => setData('modpack_name', e.target.value)}
                                                placeholder="e.g., All The Mods 9"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="modpack_url">Modpack URL</Label>
                                            <Input
                                                id="modpack_url"
                                                value={data.modpack_url}
                                                onChange={(e) => setData('modpack_url', e.target.value)}
                                                placeholder="https://www.curseforge.com/minecraft/modpacks/..."
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Link to the modpack page for players to download
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Server Details */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">Server Details</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Additional information about your server
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="server_software">Server Software</Label>
                                        <Select value={data.server_software} onValueChange={(value) => setData('server_software', value as ServerSoftware)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select software" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {serverSoftwareOptions.map((software) => (
                                                    <SelectItem key={software.value} value={software.value}>
                                                        {software.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Select value={data.country} onValueChange={(value) => setData('country', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countries.map((country) => (
                                                    <SelectItem key={country.value} value={country.value}>
                                                        {country.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="language">Language</Label>
                                        <Select value={data.language} onValueChange={(value) => setData('language', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {languages.map((lang) => (
                                                    <SelectItem key={lang.value} value={lang.value}>
                                                        {lang.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="minimum_age">Age Restriction</Label>
                                        <Select value={data.minimum_age || undefined} onValueChange={(value) => setData('minimum_age', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Aucune restriction" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ageOptions.map((age) => (
                                                    <SelectItem key={age.value} value={age.value}>
                                                        {age.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="founded_at">Server Founded</Label>
                                    <Input
                                        id="founded_at"
                                        type="date"
                                        value={data.founded_at}
                                        onChange={(e) => setData('founded_at', e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                    <p className="text-xs text-muted-foreground">When was your server created?</p>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="accepts_cracked"
                                            checked={data.accepts_cracked}
                                            onCheckedChange={(checked) => setData('accepts_cracked', checked === true)}
                                        />
                                        <div>
                                            <Label htmlFor="accepts_cracked" className="cursor-pointer">Accepts Cracked Players</Label>
                                            <p className="text-xs text-muted-foreground">Server allows non-premium accounts</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="is_whitelisted"
                                            checked={data.is_whitelisted}
                                            onCheckedChange={(checked) => setData('is_whitelisted', checked === true)}
                                        />
                                        <div>
                                            <Label htmlFor="is_whitelisted" className="cursor-pointer">Whitelisted Server</Label>
                                            <p className="text-xs text-muted-foreground">Players need to apply to join</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">Tags</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Select up to 5 tags that describe your server
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {tags.map((tag) => (
                                        <label
                                            key={tag.id}
                                            className={cn(
                                                'flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 transition-colors hover:bg-accent',
                                                data.tags.length >= 5 && !data.tags.includes(tag.id) && 'opacity-50 cursor-not-allowed',
                                            )}
                                            style={{
                                                borderColor: data.tags.includes(tag.id) ? tag.color : undefined,
                                                backgroundColor: data.tags.includes(tag.id) ? `${tag.color}10` : undefined,
                                            }}
                                        >
                                            <Checkbox
                                                checked={data.tags.includes(tag.id)}
                                                onCheckedChange={() => toggleTag(tag.id)}
                                                disabled={data.tags.length >= 5 && !data.tags.includes(tag.id)}
                                                className="size-4"
                                            />
                                            <span className="text-sm" style={{ color: tag.color }}>
                                                {tag.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {data.tags.length > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        {data.tags.length}/5 tags selected
                                    </p>
                                )}
                                <InputError message={errors.tags} />
                            </div>

                            {/* Banner */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">Server Banner</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Add a static image or an animated banner
                                    </p>
                                </div>

                                {/* Animated Banner Preview */}
                                {data.banner_config && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-violet-500 flex items-center gap-2">
                                                <Sparkles className="size-4" />
                                                Animated Banner Active
                                            </Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearAnimatedBanner}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="size-4 mr-1" />
                                                Remove
                                            </Button>
                                        </div>
                                        <div className="overflow-hidden rounded-xl border border-violet-500/50">
                                            <div className="aspect-[3/1] w-full">
                                                <AnimatedBanner config={data.banner_config} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Static Banner Preview */}
                                {!data.banner_config && data.banner_url && (
                                    <div className="overflow-hidden rounded-xl border border-border/50">
                                        <img
                                            src={data.banner_url}
                                            alt="Banner preview"
                                            className="aspect-[3/1] w-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {/* Static Banner URL */}
                                    {!data.banner_config && (
                                        <div className="space-y-2">
                                            <Label htmlFor="banner_url">Static Banner URL</Label>
                                            <Input
                                                id="banner_url"
                                                value={data.banner_url}
                                                onChange={(e) => setData('banner_url', e.target.value)}
                                                placeholder="https://example.com/banner.png"
                                                aria-invalid={!!errors.banner_url}
                                                className={cn(errors.banner_url && 'border-destructive focus-visible:ring-destructive')}
                                            />
                                            <InputError message={errors.banner_url} />
                                        </div>
                                    )}

                                    {/* Banner Actions */}
                                    <div className="flex flex-wrap items-center gap-3 pt-2">
                                        <Button type="button" variant="outline" size="sm" asChild className="gap-2">
                                            <Link href="/tools/banner-generator" target="_blank">
                                                <Sparkles className="size-4" />
                                                Open Banner Generator
                                                <ExternalLink className="size-3" />
                                            </Link>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={pasteAnimatedConfig}
                                            className="gap-2 border-violet-500/50 text-violet-500 hover:bg-violet-500/10"
                                        >
                                            <ClipboardPaste className="size-4" />
                                            Paste Animated Config
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Use the generator to create a banner, then copy the animated config and paste it here.
                                    </p>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">Links</h3>
                                    <p className="text-sm text-muted-foreground">Optional links to your server resources</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website_url">Website URL</Label>
                                    <Input
                                        id="website_url"
                                        value={data.website_url}
                                        onChange={(e) => setData('website_url', e.target.value)}
                                        placeholder="https://myserver.com"
                                        aria-invalid={!!errors.website_url}
                                        className={cn(errors.website_url && 'border-destructive focus-visible:ring-destructive')}
                                    />
                                    <InputError message={errors.website_url} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="discord_url">Discord Invite URL</Label>
                                    <Input
                                        id="discord_url"
                                        value={data.discord_url}
                                        onChange={(e) => setData('discord_url', e.target.value)}
                                        placeholder="https://discord.gg/abc123"
                                        aria-invalid={!!errors.discord_url}
                                        className={cn(errors.discord_url && 'border-destructive focus-visible:ring-destructive')}
                                    />
                                    <InputError message={errors.discord_url} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="discord_webhook_url">Discord Webhook URL</Label>
                                    <Input
                                        id="discord_webhook_url"
                                        value={data.discord_webhook_url}
                                        onChange={(e) => setData('discord_webhook_url', e.target.value)}
                                        placeholder="https://discord.com/api/webhooks/..."
                                        aria-invalid={!!errors.discord_webhook_url}
                                        className={cn(errors.discord_webhook_url && 'border-destructive focus-visible:ring-destructive')}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Receive vote notifications in your Discord server
                                    </p>
                                    <InputError message={errors.discord_webhook_url} />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between border-t pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit(`/dashboard/servers/${server.slug}`)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
