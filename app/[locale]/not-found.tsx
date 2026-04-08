// app/[locale]/not-found.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("message")}</p>
      <Link href="/" className="text-primary underline">
        {t("home")}
      </Link>
    </div>
  );
}
