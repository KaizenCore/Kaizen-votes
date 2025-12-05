import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';

const LANGUAGE_KEY = 'kaizen_language';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            fr: { translation: fr },
        },
        fallbackLng: 'en',
        supportedLngs: ['en', 'fr'],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: LANGUAGE_KEY,
            caches: ['localStorage'],
        },
    });

export const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem(LANGUAGE_KEY, lng);
};

export const getCurrentLanguage = () => i18n.language;

export const getSupportedLanguages = () => [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default i18n;
