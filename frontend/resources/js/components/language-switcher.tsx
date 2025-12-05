import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { changeLanguage, getSupportedLanguages } from '@/i18n';

import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const languages = getSupportedLanguages();
    const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9">
                    <span className="text-base">{currentLang.flag}</span>
                    <span className="sr-only">
                        <Languages className="size-4" />
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={i18n.language === lang.code ? 'bg-accent' : ''}
                    >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
