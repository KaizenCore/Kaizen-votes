import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, CheckCircle2, ExternalLink, Loader2, Server, Sparkles } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { CategoryIcon } from '@/components/category-icon';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem, Category, LauncherType, ServerSoftware, ServerType, Tag } from '@/types';

interface CreateServerPageProps {
    categories: Category[];
    tags: Tag[];
}

interface FormData {
    name: string;
    category_id: string;
    description: string;
    ip_address: string;
    port: string;
    server_type: ServerType;
    bedrock_port: string;
    is_modded: boolean;
    modpack_name: string;
    modpack_url: string;
    launcher: LauncherType | '';
    version_range: [number, number];
    server_software: ServerSoftware | '';
    country: string;
    language: string;
    accepts_cracked: boolean;
    is_whitelisted: boolean;
    minimum_age: string;
    founded_at: string;
    banner_url: string;
    website_url: string;
    discord_url: string;
    discord_webhook_url: string;
    tags: number[];
}

const serverTypes: { value: ServerType; label: string; description: string }[] = [
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

const minecraftVersions = [
    '1.7.10', '1.8.9', '1.9.4', '1.10.2', '1.11.2', '1.12.2', '1.13.2', '1.14.4', '1.15.2',
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Add Server', href: '/servers/create' },
];

function InputError({ message, className }: { message?: string; className?: string }) {
    if (!message) return null;
    return (
        <p className={cn('text-sm text-destructive flex items-center gap-1', className)}>
            <AlertCircle className="size-3.5" />
            {message}
        </p>
    );
}

function RequiredLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
    return (
        <Label htmlFor={htmlFor}>
            {children} <span className="text-destructive">*</span>
        </Label>
    );
}

export default function CreateServer({ categories, tags }: CreateServerPageProps) {
    const defaultMaxIndex = minecraftVersions.length - 1;
    const defaultMinIndex = defaultMaxIndex - 4;

    const { data, setData, post, processing, errors, hasErrors, reset, transform } = useForm<FormData>({
        name: '',
        category_id: '',
        description: '',
        ip_address: '',
        port: '25565',
        server_type: 'java',
        bedrock_port: '19132',
        is_modded: false,
        modpack_name: '',
        modpack_url: '',
        launcher: '',
        version_range: [defaultMinIndex, defaultMaxIndex],
        server_software: '',
        country: '',
        language: '',
        accepts_cracked: false,
        is_whitelisted: false,
        minimum_age: '',
        founded_at: '',
        banner_url: '',
        website_url: '',
        discord_url: '',
        discord_webhook_url: '',
        tags: [],
    });

    transform((formData) => ({
        ...formData,
        minecraft_versions: minecraftVersions.slice(formData.version_range[0], formData.version_range[1] + 1),
    }));

    const selectedVersions = minecraftVersions.slice(data.version_range[0], data.version_range[1] + 1);
    const minVersion = minecraftVersions[data.version_range[0]];
    const maxVersion = minecraftVersions[data.version_range[1]];

    const toggleTag = (tagId: number) => {
        setData('tags', data.tags.includes(tagId) ? data.tags.filter((id) => id !== tagId) : [...data.tags, tagId]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/servers', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Server submitted successfully!', {
                    description: 'Your server is now pending review.',
                    icon: <CheckCircle2 className="size-5" />,
                });
                reset();
            },
            onError: (errors) => {
                toast.error('Failed to submit server', {
                    description: `Please fix ${Object.keys(errors).length} error(s) in the form.`,
                });
                document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            },
        });
    };

    const descriptionLength = data.description.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Server - Kaizen Votes" />

            <div className="mx-auto w-full p-4 lg:px-8 xl:px-12">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" onClick={() => router.visit('/dashboard')}>
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Dashboard
                    </Button>
                </div>

                {hasErrors && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="size-4" />
                        <AlertDescription>Please fix the errors below before submitting your server.</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="mb-8 flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10">
                            <Server className="size-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Add Your Server</h1>
                            <p className="text-muted-foreground">Fill in the details below to add your Minecraft server</p>
                        </div>
                    </div>

                    {/* Main Grid Layout */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <RequiredLabel htmlFor="name">Server Name</RequiredLabel>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="My Awesome Server"
                                            aria-invalid={!!errors.name}
                                            className={cn(errors.name && 'border-destructive')}
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <RequiredLabel htmlFor="category_id">Category</RequiredLabel>
                                        <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                            <SelectTrigger aria-invalid={!!errors.category_id} className={cn(errors.category_id && 'border-destructive')}>
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
                                        <RequiredLabel htmlFor="description">Description</RequiredLabel>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Tell players about your server... (minimum 50 characters)"
                                            rows={4}
                                            aria-invalid={!!errors.description}
                                            className={cn(errors.description && 'border-destructive')}
                                        />
                                        <div className="flex items-center justify-between">
                                            <InputError message={errors.description} />
                                            <p className={cn('text-xs ml-auto', descriptionLength < 50 ? 'text-amber-500' : 'text-green-500')}>
                                                {descriptionLength}/50 min
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Server Connection */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">Server Connection</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <RequiredLabel htmlFor="ip_address">IP Address</RequiredLabel>
                                            <Input
                                                id="ip_address"
                                                value={data.ip_address}
                                                onChange={(e) => setData('ip_address', e.target.value)}
                                                placeholder="play.myserver.com"
                                                aria-invalid={!!errors.ip_address}
                                                className={cn(errors.ip_address && 'border-destructive')}
                                            />
                                            <InputError message={errors.ip_address} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="port">{data.server_type === 'bedrock' ? 'Bedrock Port' : 'Java Port'}</Label>
                                            <Input
                                                id="port"
                                                type="number"
                                                value={data.port}
                                                onChange={(e) => setData('port', e.target.value)}
                                                placeholder={data.server_type === 'bedrock' ? '19132' : '25565'}
                                            />
                                        </div>
                                    </div>
                                    {data.server_type === 'crossplay' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="bedrock_port">Bedrock Port</Label>
                                            <Input
                                                id="bedrock_port"
                                                type="number"
                                                value={data.bedrock_port}
                                                onChange={(e) => setData('bedrock_port', e.target.value)}
                                                placeholder="19132"
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Game Type */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">Game Type</CardTitle>
                                    <p className="text-sm text-muted-foreground">Select the Minecraft edition your server supports</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        {serverTypes.map((type) => (
                                            <label
                                                key={type.value}
                                                className={cn(
                                                    'flex cursor-pointer flex-col gap-1 rounded-lg border p-3 transition-colors hover:bg-accent',
                                                    data.server_type === type.value && 'border-primary bg-primary/5',
                                                )}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="server_type"
                                                        value={type.value}
                                                        checked={data.server_type === type.value}
                                                        onChange={(e) => setData('server_type', e.target.value as ServerType)}
                                                        className="size-4"
                                                    />
                                                    <span className="font-medium text-sm">{type.label}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground pl-6">{type.description}</span>
                                            </label>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Versions */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">Supported Versions</CardTitle>
                                    <p className="text-sm text-muted-foreground">Select the range of versions your server supports</p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground mb-1">Min</p>
                                            <span className="inline-block rounded-md bg-primary/10 px-3 py-1.5 font-mono font-semibold text-primary">
                                                {minVersion}
                                            </span>
                                        </div>
                                        <div className="flex-1 flex items-center justify-center px-4">
                                            <div className="h-px flex-1 bg-border" />
                                            <span className="px-3 text-sm text-muted-foreground">{selectedVersions.length} versions</span>
                                            <div className="h-px flex-1 bg-border" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground mb-1">Max</p>
                                            <span className="inline-block rounded-md bg-primary/10 px-3 py-1.5 font-mono font-semibold text-primary">
                                                {maxVersion}
                                            </span>
                                        </div>
                                    </div>
                                    <Slider
                                        value={data.version_range}
                                        onValueChange={(value) => setData('version_range', value as [number, number])}
                                        min={0}
                                        max={minecraftVersions.length - 1}
                                        step={1}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>1.7.10</span>
                                        <span>1.12.2</span>
                                        <span>1.16.5</span>
                                        <span>1.19.4</span>
                                        <span>1.21.10</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Modded Server */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="is_modded"
                                            checked={data.is_modded}
                                            onCheckedChange={(checked) => setData('is_modded', checked === true)}
                                        />
                                        <div>
                                            <CardTitle className="text-lg cursor-pointer" onClick={() => setData('is_modded', !data.is_modded)}>
                                                Modded Server
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground">Check if your server uses mods</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                {data.is_modded && (
                                    <CardContent className="space-y-4 border-t pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="launcher">Launcher / Platform</Label>
                                            <Select value={data.launcher} onValueChange={(value) => setData('launcher', value as LauncherType)}>
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
                                        </div>
                                    </CardContent>
                                )}
                            </Card>

                            {/* Server Details */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">Server Details</CardTitle>
                                    <p className="text-sm text-muted-foreground">Additional information about your server</p>
                                </CardHeader>
                                <CardContent className="space-y-4">
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
                                </CardContent>
                            </Card>

                            {/* Tags */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">Tags</CardTitle>
                                    <p className="text-sm text-muted-foreground">Select up to 5 tags that describe your server</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <label
                                                key={tag.id}
                                                className={cn(
                                                    'flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 transition-colors hover:bg-accent',
                                                    data.tags.length >= 5 && !data.tags.includes(tag.id) && 'opacity-50 cursor-not-allowed',
                                                )}
                                                style={{
                                                    borderColor: data.tags.includes(tag.id) ? tag.color : undefined,
                                                    backgroundColor: data.tags.includes(tag.id) ? `${tag.color}15` : undefined,
                                                }}
                                            >
                                                <Checkbox
                                                    checked={data.tags.includes(tag.id)}
                                                    onCheckedChange={() => toggleTag(tag.id)}
                                                    disabled={data.tags.length >= 5 && !data.tags.includes(tag.id)}
                                                    className="size-3.5"
                                                />
                                                <span className="text-sm" style={{ color: data.tags.includes(tag.id) ? tag.color : undefined }}>
                                                    {tag.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {data.tags.length > 0 && <p className="text-xs text-muted-foreground mt-3">{data.tags.length}/5 tags selected</p>}
                                </CardContent>
                            </Card>

                            {/* Banner */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">Server Banner</CardTitle>
                                    <p className="text-sm text-muted-foreground">Add a banner to make your server stand out</p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {data.banner_url && (
                                        <div className="overflow-hidden rounded-lg border">
                                            <img
                                                src={data.banner_url}
                                                alt="Banner preview"
                                                className="aspect-[3/1] w-full object-cover"
                                                onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="banner_url">Banner URL</Label>
                                        <Input
                                            id="banner_url"
                                            value={data.banner_url}
                                            onChange={(e) => setData('banner_url', e.target.value)}
                                            placeholder="https://example.com/banner.png"
                                        />
                                    </div>
                                    <Button type="button" variant="outline" size="sm" asChild className="gap-2">
                                        <Link href="/tools/banner-generator" target="_blank">
                                            <Sparkles className="size-4" />
                                            Create with generator
                                            <ExternalLink className="size-3" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Links */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">Links</CardTitle>
                                    <p className="text-sm text-muted-foreground">Optional links to your server resources</p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="website_url">Website</Label>
                                        <Input
                                            id="website_url"
                                            value={data.website_url}
                                            onChange={(e) => setData('website_url', e.target.value)}
                                            placeholder="https://myserver.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discord_url">Discord Invite</Label>
                                        <Input
                                            id="discord_url"
                                            value={data.discord_url}
                                            onChange={(e) => setData('discord_url', e.target.value)}
                                            placeholder="https://discord.gg/abc123"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discord_webhook_url">Discord Webhook</Label>
                                        <Input
                                            id="discord_webhook_url"
                                            value={data.discord_webhook_url}
                                            onChange={(e) => setData('discord_webhook_url', e.target.value)}
                                            placeholder="https://discord.com/api/webhooks/..."
                                        />
                                        <p className="text-xs text-muted-foreground">Receive vote notifications in Discord</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit */}
                            <Card className="border-primary/20 bg-primary/5">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <Button type="button" variant="outline" onClick={() => router.visit('/dashboard')} disabled={processing}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing} size="lg">
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Server'
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
