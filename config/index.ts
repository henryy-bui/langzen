// config/index.ts
export const LOCALES = ["en", "vi"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "vi";

export const LEARNING_LANGUAGES = ["EN", "KO"] as const;
export type LearningLanguage = (typeof LEARNING_LANGUAGES)[number];
