import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterForm from "@/features/auth/components/RegisterForm";

interface RegisterPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  const session = await auth();

  if (session) {
    redirect(`/${locale}/dashboard`);
  }

  return <RegisterForm />;
}
