import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/features/auth/components/LoginForm";

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  const session = await auth();

  if (session) {
    redirect(`/${locale}/dashboard`);
  }

  return <LoginForm />;
}
