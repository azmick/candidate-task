import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import tr from './locales/tr.json';
import ru from './locales/ru.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: false,

        interpolation: {
            escapeValue: false,
        },

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage']
        },

        resources: {
            en: { translation: en },
            tr: { translation: tr },
            ru: { translation: ru }
        }
    });

export default i18n;

