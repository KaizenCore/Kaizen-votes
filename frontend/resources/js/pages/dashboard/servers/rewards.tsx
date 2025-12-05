import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Gift, GripVertical, Plus, Sparkles, Trash2, X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, DashboardServerRewardsPageProps, Reward, RewardType } from '@/types';

type RewardFormData = {
    name: string;
    description: string;
    reward_type: RewardType;
    commands: string[];
    chance: number;
    is_active: boolean;
    min_votes: number | null;
    daily_limit: number | null;
};

const defaultFormData: RewardFormData = {
    name: '',
    description: '',
    reward_type: 'command',
    commands: [''],
    chance: 100,
    is_active: true,
    min_votes: null,
    daily_limit: null,
};

// Reward templates for quick setup
const rewardTemplates: { name: string; description: string; data: Partial<RewardFormData> }[] = [
    {
        name: 'Diamonds',
        description: 'Give diamonds to voters',
        data: {
            name: 'Diamond Reward',
            description: 'Receive diamonds for voting',
            reward_type: 'command',
            commands: ['give {player} diamond 5'],
            chance: 100,
        },
    },
    {
        name: 'Money (EssentialsX)',
        description: 'Give in-game money using EssentialsX',
        data: {
            name: 'Vote Money',
            description: 'Receive money for voting',
            reward_type: 'currency',
            commands: ['eco give {player} 1000'],
            chance: 100,
        },
    },
    {
        name: 'Experience',
        description: 'Give experience points',
        data: {
            name: 'XP Reward',
            description: 'Receive experience points for voting',
            reward_type: 'command',
            commands: ['xp add {player} 500 points'],
            chance: 100,
        },
    },
    {
        name: 'Vote Key (Crates)',
        description: 'Give a vote key for crate plugins',
        data: {
            name: 'Vote Key',
            description: 'Receive a vote key for crates',
            reward_type: 'command',
            commands: ['crate give {player} vote 1'],
            chance: 100,
        },
    },
    {
        name: 'Random Items',
        description: 'Chance-based random items',
        data: {
            name: 'Lucky Drop',
            description: 'Small chance to get rare items',
            reward_type: 'item',
            commands: ['give {player} emerald 3'],
            chance: 25,
        },
    },
    {
        name: 'Loyal Voter Bonus',
        description: 'Extra reward after 10 votes (25% chance)',
        data: {
            name: 'Loyal Voter Bonus',
            description: 'Bonus for loyal voters (10+ votes)',
            reward_type: 'command',
            commands: ['give {player} diamond_block 1'],
            chance: 25,
            min_votes: 10,
        },
    },
    {
        name: 'Daily Special',
        description: 'Limited reward once per day',
        data: {
            name: 'Daily Special',
            description: 'Special reward limited to once per day',
            reward_type: 'command',
            commands: ['give {player} golden_apple 3'],
            chance: 100,
            daily_limit: 1,
        },
    },
    {
        name: 'Permission (LuckPerms)',
        description: 'Grant a permission using LuckPerms',
        data: {
            name: 'Voter Perk',
            description: 'Unlock voter perks',
            reward_type: 'permission',
            commands: ['lp user {player} permission set vote.perk true'],
            chance: 100,
        },
    },
];

export default function DashboardServerRewards({ server, rewards, rewardTypes }: DashboardServerRewardsPageProps) {
    const [createOpen, setCreateOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [selectedReward, setSelectedReward] = React.useState<Reward | null>(null);
    const [showTemplates, setShowTemplates] = React.useState(true);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Servers', href: '/dashboard/servers' },
        { title: server.name, href: `/dashboard/servers/${server.slug}` },
        { title: 'Rewards', href: `/dashboard/servers/${server.slug}/rewards` },
    ];

    const createForm = useForm<RewardFormData>(defaultFormData);
    const editForm = useForm<RewardFormData>(defaultFormData);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(`/dashboard/servers/${server.slug}/rewards`, {
            onSuccess: () => {
                setCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedReward) return;
        editForm.patch(`/dashboard/servers/${server.slug}/rewards/${selectedReward.id}`, {
            onSuccess: () => {
                setEditOpen(false);
                setSelectedReward(null);
            },
        });
    };

    const handleDelete = () => {
        if (!selectedReward) return;
        router.delete(`/dashboard/servers/${server.slug}/rewards/${selectedReward.id}`, {
            onSuccess: () => {
                setDeleteOpen(false);
                setSelectedReward(null);
            },
        });
    };

    const handleToggle = (reward: Reward) => {
        router.post(`/dashboard/servers/${server.slug}/rewards/${reward.id}/toggle`);
    };

    const openEditDialog = (reward: Reward) => {
        setSelectedReward(reward);
        editForm.setData({
            name: reward.name,
            description: reward.description || '',
            reward_type: reward.reward_type,
            commands: reward.commands || [''],
            chance: reward.chance,
            is_active: reward.is_active,
            min_votes: reward.min_votes ?? null,
            daily_limit: reward.daily_limit ?? null,
        });
        setEditOpen(true);
    };

    const openDeleteDialog = (reward: Reward) => {
        setSelectedReward(reward);
        setDeleteOpen(true);
    };

    const addCommand = (form: ReturnType<typeof useForm<RewardFormData>>) => {
        form.setData('commands', [...form.data.commands, '']);
    };

    const removeCommand = (form: ReturnType<typeof useForm<RewardFormData>>, index: number) => {
        const newCommands = form.data.commands.filter((_, i) => i !== index);
        form.setData('commands', newCommands.length > 0 ? newCommands : ['']);
    };

    const updateCommand = (form: ReturnType<typeof useForm<RewardFormData>>, index: number, value: string) => {
        const newCommands = [...form.data.commands];
        newCommands[index] = value;
        form.setData('commands', newCommands);
    };

    const applyTemplate = (template: typeof rewardTemplates[0]) => {
        createForm.setData({
            ...defaultFormData,
            ...template.data,
            is_active: true,
        } as RewardFormData);
        setShowTemplates(false);
    };

    const RewardForm = ({
        form,
        onSubmit,
        submitLabel,
    }: {
        form: ReturnType<typeof useForm<RewardFormData>>;
        onSubmit: (e: React.FormEvent) => void;
        submitLabel: string;
    }) => (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    placeholder="Diamond Kit"
                />
                {form.errors.name && <p className="text-sm text-destructive">{form.errors.name}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                    id="description"
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                    placeholder="A kit with diamond items"
                    rows={2}
                />
                {form.errors.description && <p className="text-sm text-destructive">{form.errors.description}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="reward_type">Reward Type</Label>
                <Select value={form.data.reward_type} onValueChange={(value) => form.setData('reward_type', value as RewardType)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        {rewardTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {form.errors.reward_type && <p className="text-sm text-destructive">{form.errors.reward_type}</p>}
            </div>

            <div className="space-y-2">
                <Label>Commands</Label>
                <p className="text-xs text-muted-foreground">Use {'{player}'} as placeholder for the player name</p>
                <div className="space-y-2">
                    {form.data.commands.map((command, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={command}
                                onChange={(e) => updateCommand(form, index, e.target.value)}
                                placeholder="give {player} diamond 64"
                            />
                            {form.data.commands.length > 1 && (
                                <Button type="button" variant="outline" size="icon" onClick={() => removeCommand(form, index)}>
                                    <X className="size-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => addCommand(form)}>
                    <Plus className="mr-2 size-4" />
                    Add Command
                </Button>
                {form.errors.commands && <p className="text-sm text-destructive">{form.errors.commands}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="chance">Chance (%)</Label>
                    <Input
                        id="chance"
                        type="number"
                        min={1}
                        max={100}
                        value={form.data.chance}
                        onChange={(e) => form.setData('chance', parseInt(e.target.value) || 1)}
                    />
                    {form.errors.chance && <p className="text-sm text-destructive">{form.errors.chance}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="min_votes">Min Votes (optional)</Label>
                    <Input
                        id="min_votes"
                        type="number"
                        min={0}
                        value={form.data.min_votes ?? ''}
                        onChange={(e) => form.setData('min_votes', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="0"
                    />
                    {form.errors.min_votes && <p className="text-sm text-destructive">{form.errors.min_votes}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="daily_limit">Daily Limit (optional)</Label>
                <Input
                    id="daily_limit"
                    type="number"
                    min={0}
                    value={form.data.daily_limit ?? ''}
                    onChange={(e) => form.setData('daily_limit', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="No limit"
                />
                <p className="text-xs text-muted-foreground">Maximum number of times this reward can be given per day</p>
                {form.errors.daily_limit && <p className="text-sm text-destructive">{form.errors.daily_limit}</p>}
            </div>

            <DialogFooter>
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? 'Saving...' : submitLabel}
                </Button>
            </DialogFooter>
        </form>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Rewards - ${server.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={`/dashboard/servers/${server.slug}`}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Vote Rewards</h1>
                            <p className="text-muted-foreground">{server.name}</p>
                        </div>
                    </div>
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 size-4" />
                        Add Reward
                    </Button>
                </div>

                {/* Rewards List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gift className="size-5" />
                            Rewards
                        </CardTitle>
                        <CardDescription>
                            Configure rewards players receive when they vote for your server.
                            Commands are executed when a player claims their vote in-game.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {rewards.length > 0 ? (
                            <div className="space-y-3">
                                {rewards.map((reward) => (
                                    <div
                                        key={reward.id}
                                        className="flex items-center gap-4 rounded-lg border p-4"
                                    >
                                        <div className="cursor-move text-muted-foreground">
                                            <GripVertical className="size-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{reward.name}</p>
                                                <Badge variant="outline">{reward.chance}%</Badge>
                                                <Badge variant={reward.is_active ? 'default' : 'secondary'}>
                                                    {reward.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>
                                            {reward.description && (
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {reward.description}
                                                </p>
                                            )}
                                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                <span>Type: {rewardTypes.find((t) => t.value === reward.reward_type)?.label || reward.reward_type}</span>
                                                {reward.min_votes !== null && reward.min_votes > 0 && (
                                                    <span>Min votes: {reward.min_votes}</span>
                                                )}
                                                {reward.daily_limit !== null && reward.daily_limit > 0 && (
                                                    <span>Daily limit: {reward.daily_limit}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleToggle(reward)}>
                                                {reward.is_active ? 'Disable' : 'Enable'}
                                            </Button>
                                            <Button variant="outline" size="icon" onClick={() => openEditDialog(reward)}>
                                                <Edit className="size-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" onClick={() => openDeleteDialog(reward)}>
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Gift className="mb-4 size-12 text-muted-foreground" />
                                <p className="mb-2 font-medium">No rewards configured</p>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Add rewards to incentivize players to vote for your server
                                </p>
                                <Button onClick={() => setCreateOpen(true)}>
                                    <Plus className="mr-2 size-4" />
                                    Add Your First Reward
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Create Dialog */}
                <Dialog open={createOpen} onOpenChange={(open) => {
                    setCreateOpen(open);
                    if (open) {
                        setShowTemplates(true);
                        createForm.reset();
                    }
                }}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add Reward</DialogTitle>
                            <DialogDescription>
                                Create a new reward that players can receive when voting
                            </DialogDescription>
                        </DialogHeader>

                        {showTemplates ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Sparkles className="size-4 text-yellow-500" />
                                        Quick Templates
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setShowTemplates(false)}>
                                        Skip to custom
                                    </Button>
                                </div>
                                <div className="grid gap-2">
                                    {rewardTemplates.map((template, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => applyTemplate(template)}
                                            className="flex items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent"
                                        >
                                            <Gift className="mt-0.5 size-4 text-muted-foreground" />
                                            <div className="flex-1">
                                                <p className="font-medium">{template.name}</p>
                                                <p className="text-sm text-muted-foreground">{template.description}</p>
                                                {template.data.chance !== 100 && (
                                                    <Badge variant="outline" className="mt-1">{template.data.chance}% chance</Badge>
                                                )}
                                                {template.data.min_votes && (
                                                    <Badge variant="outline" className="ml-1 mt-1">Min {template.data.min_votes} votes</Badge>
                                                )}
                                                {template.data.daily_limit && (
                                                    <Badge variant="outline" className="ml-1 mt-1">Daily limit: {template.data.daily_limit}</Badge>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowTemplates(true)}
                                    className="mb-2"
                                >
                                    <Sparkles className="mr-2 size-4" />
                                    Back to templates
                                </Button>
                                <RewardForm form={createForm} onSubmit={handleCreate} submitLabel="Create Reward" />
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Reward</DialogTitle>
                            <DialogDescription>
                                Update reward settings
                            </DialogDescription>
                        </DialogHeader>
                        <RewardForm form={editForm} onSubmit={handleEdit} submitLabel="Save Changes" />
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Reward</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete &quot;{selectedReward?.name}&quot;? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
