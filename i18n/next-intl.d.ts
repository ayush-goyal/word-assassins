import { type formats } from "@/i18n/request";
import { routing } from "@/i18n/routing";
import type messages from "@/locales/en.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: string;
    Messages: typeof messages;
    Formats: typeof formats;
  }
}

// Extend the useTranslations hook to provide better type safety
declare module "next-intl/client" {
  interface useTranslations {
    <TNamespace extends keyof typeof messages>(
      namespace: TNamespace
    ): (key: keyof (typeof messages)[TNamespace]) => string;
    (): (key: string) => string;
  }
}
