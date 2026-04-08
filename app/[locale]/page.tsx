// app/[locale]/page.tsx
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
      <a
        href="#"
        className="mt-8 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        {t("cta")}
      </a>
    </main>
  );
}
