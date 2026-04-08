import type { Resend } from "resend";

let resend: Resend | null = null;

async function getResend(): Promise<Resend> {
  if (!resend) {
    const { Resend: ResendClass } = await import("resend");
    const { env } = await import("@/lib/env");
    resend = new ResendClass(env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_ADDRESS = "LangZen <noreply@langzen.app>";

export async function sendVerificationEmail(
  to: string,
  token: string
): Promise<void> {
  const { env } = await import("@/lib/env");
  const resendClient = await getResend();
  const verifyUrl = `${env.NEXT_PUBLIC_APP_URL}/en/verify?token=${token}`;

  await resendClient.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Verify your LangZen email",
    html: `
      <h2>Welcome to LangZen!</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}

export async function sendCertificateEmail(
  to: string,
  certUrl: string
): Promise<void> {
  const resendClient = await getResend();

  await resendClient.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Your LangZen Certificate is Ready",
    html: `
      <h2>Congratulations!</h2>
      <p>Your certificate is ready. Download it here:</p>
      <a href="${certUrl}">${certUrl}</a>
    `,
  });
}
