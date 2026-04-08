// app/[locale]/error.tsx
"use client";

import { useTranslations } from "next-intl";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error: _error, reset }: ErrorPageProps) {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-destructive">{t("error")}</p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
      >
        {t("retry")}
      </button>
    </div>
  );
}
