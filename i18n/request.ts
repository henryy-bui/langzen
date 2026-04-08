// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/config";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !LOCALES.includes(locale as Locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)) as Record<
      string,
      unknown
    >,
  };
});
