"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import { registerSchema } from "@/lib/validations/auth";
import type { RegisterInput } from "@/lib/validations/auth";
import type { ApiResponse } from "@/types";

export async function registerUser(
  input: RegisterInput
): Promise<ApiResponse<null>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "validation" };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "emailTaken" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: { name, email, hashedPassword },
  });

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.verificationToken.create({
    data: { identifier: user.email ?? email, token, expires },
  });

  await sendVerificationEmail(email, token);

  return { success: true, data: null };
}

export async function verifyEmail(token: string): Promise<ApiResponse<null>> {
  const record = await db.verificationToken.findFirst({
    where: { token },
  });

  if (!record) {
    return { success: false, error: "invalid" };
  }

  if (record.expires < new Date()) {
    await db.verificationToken.delete({
      where: { identifier_token: { identifier: record.identifier, token } },
    });
    return { success: false, error: "expired" };
  }

  await db.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  await db.verificationToken.delete({
    where: { identifier_token: { identifier: record.identifier, token } },
  });

  return { success: true, data: null };
}
