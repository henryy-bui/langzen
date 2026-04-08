"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/config";

export default function LocaleSwitcher() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(newLocale: Locale) {
    // Replace the current locale segment in the path
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <div className="flex gap-2">
      {LOCALES.map((loc) => (
        <button
          key={loc}
          onClick={() => handleChange(loc)}
          className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
            loc === locale
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-current={loc === locale ? "true" : undefined}
        >
          {t(loc)}
        </button>
      ))}
    </div>
  );
}
