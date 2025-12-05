import { Check, Loader2, User, X } from 'lucide-react';
import * as React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MinecraftProfile {
    id: string; // UUID without dashes
    name: string;
}

interface MinecraftUsernameInputProps extends Omit<React.ComponentProps<'input'>, 'type' | 'onChange'> {
    error?: string;
    label?: string;
    showAvatar?: boolean;
    suggestions?: string[];
    onValidation?: (isValid: boolean, profile?: MinecraftProfile) => void;
    onChange?: (value: string) => void;
}

export function MinecraftUsernameInput({
    error,
    label = 'Minecraft Username',
    showAvatar = true,
    suggestions = [],
    onValidation,
    onChange,
    className,
    value,
    ...props
}: MinecraftUsernameInputProps) {
    const [avatarError, setAvatarError] = React.useState(false);
    const [isValidating, setIsValidating] = React.useState(false);
    const [validationStatus, setValidationStatus] = React.useState<'idle' | 'valid' | 'invalid'>('idle');
    const [validatedProfile, setValidatedProfile] = React.useState<MinecraftProfile | null>(null);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const username = value?.toString() || '';
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Filter suggestions based on current input
    const filteredSuggestions = suggestions.filter(
        (s) => s.toLowerCase().includes(username.toLowerCase()) && s.toLowerCase() !== username.toLowerCase()
    );

    // Validate username via Mojang API
    const validateUsername = React.useCallback(async (name: string) => {
        if (name.length < 3 || name.length > 16) {
            setValidationStatus('idle');
            setValidatedProfile(null);
            onValidation?.(false);
            return;
        }

        // Check if username matches Minecraft username rules
        if (!/^[a-zA-Z0-9_]+$/.test(name)) {
            setValidationStatus('invalid');
            setValidatedProfile(null);
            onValidation?.(false);
            return;
        }

        setIsValidating(true);

        try {
            // Use our backend proxy to avoid CORS issues
            const response = await fetch(`/api/minecraft/profile/${name}`);

            if (response.ok) {
                const profile: MinecraftProfile = await response.json();
                setValidationStatus('valid');
                setValidatedProfile(profile);
                setAvatarError(false);
                onValidation?.(true, profile);
            } else {
                setValidationStatus('invalid');
                setValidatedProfile(null);
                onValidation?.(false);
            }
        } catch (error) {
            // If validation fails, allow the username anyway (API might be down)
            setValidationStatus('idle');
            setValidatedProfile(null);
            onValidation?.(true);
        } finally {
            setIsValidating(false);
        }
    }, [onValidation]);

    // Debounced validation
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (username.length >= 3) {
                validateUsername(username);
            } else {
                setValidationStatus('idle');
                setValidatedProfile(null);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [username, validateUsername]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange?.(newValue);
        setShowSuggestions(true);
    };

    const selectSuggestion = (suggestion: string) => {
        onChange?.(suggestion);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    return (
        <div className="space-y-2">
            {label && <Label htmlFor={props.id}>{label}</Label>}
            <div className="relative">
                {/* Avatar/Icon */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    {showAvatar && username.length >= 3 && !avatarError && (validationStatus === 'valid' || validationStatus === 'idle') ? (
                        <img
                            src={`https://mc-heads.net/avatar/${validatedProfile?.name || username}/24`}
                            alt=""
                            className="size-5 rounded"
                            onError={() => setAvatarError(true)}
                        />
                    ) : (
                        <User className="size-5 text-muted-foreground" />
                    )}
                </div>

                {/* Input */}
                <Input
                    ref={inputRef}
                    type="text"
                    className={cn(
                        'pl-10 pr-10',
                        error && 'border-destructive focus-visible:ring-destructive/20',
                        validationStatus === 'valid' && 'border-green-500 focus-visible:ring-green-500/20',
                        validationStatus === 'invalid' && 'border-amber-500 focus-visible:ring-amber-500/20',
                        className,
                    )}
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    aria-invalid={!!error}
                    autoComplete="off"
                    {...props}
                />

                {/* Validation indicator */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {isValidating && (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    )}
                    {!isValidating && validationStatus === 'valid' && (
                        <Check className="size-4 text-green-500" />
                    )}
                    {!isValidating && validationStatus === 'invalid' && (
                        <X className="size-4 text-amber-500" />
                    )}
                </div>

                {/* Suggestions dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover p-1 shadow-lg">
                        <p className="px-2 py-1 text-xs text-muted-foreground">Previous usernames:</p>
                        {filteredSuggestions.slice(0, 5).map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                                onClick={() => selectSuggestion(suggestion)}
                            >
                                <img
                                    src={`https://mc-heads.net/avatar/${suggestion}/20`}
                                    alt=""
                                    className="size-5 rounded"
                                />
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Error message */}
            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* Validation feedback */}
            {!error && validationStatus === 'invalid' && (
                <p className="text-sm text-amber-500">
                    Username not found. Make sure you entered it correctly.
                </p>
            )}
            {!error && validationStatus === 'valid' && validatedProfile && (
                <p className="text-sm text-green-600 dark:text-green-400">
                    Verified: {validatedProfile.name}
                </p>
            )}

            {/* Help text */}
            {validationStatus === 'idle' && (
                <p className="text-xs text-muted-foreground">
                    Enter your exact Minecraft username (case-sensitive)
                </p>
            )}
        </div>
    );
}
