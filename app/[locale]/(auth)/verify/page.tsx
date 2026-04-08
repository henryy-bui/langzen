import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { verifyEmail } from "@/features/auth/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface VerifyPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyPage({
  params,
  searchParams,
}: VerifyPageProps) {
  const { locale } = await params;
  const { token } = await searchParams;
  const t = await getTranslations("auth.verify");

  if (!token) {
    redirect(`/${locale}/login`);
  }

  const result = await verifyEmail(token);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {result.success ? t("success") : t("invalid")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result.success ? (
          <a
            href={`/${locale}/login`}
            className="text-primary underline text-sm"
          >
            {t("title")}
          </a>
        ) : (
          <p className="text-sm text-destructive">{t("invalid")}</p>
        )}
      </CardContent>
    </Card>
  );
}
