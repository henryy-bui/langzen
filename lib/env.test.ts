// lib/env.test.ts
import { z } from "zod";

// Test the schema directly, not lib/env.ts itself (which reads process.env at import time)
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

const validEnv = {
  DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
  NEXTAUTH_URL: "http://localhost:3000",
  NEXTAUTH_SECRET: "a".repeat(32),
  GOOGLE_CLIENT_ID: "google-client-id",
  GOOGLE_CLIENT_SECRET: "google-client-secret",
  CLOUDINARY_CLOUD_NAME: "my-cloud",
  CLOUDINARY_API_KEY: "123456",
  CLOUDINARY_API_SECRET: "secret",
  RESEND_API_KEY: "re_abc123",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
};

describe("env schema", () => {
  it("accepts valid environment variables", () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
  });

  it("rejects missing DATABASE_URL", () => {
    const result = envSchema.safeParse({ ...validEnv, DATABASE_URL: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects invalid DATABASE_URL (not a URL)", () => {
    const result = envSchema.safeParse({ ...validEnv, DATABASE_URL: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("rejects NEXTAUTH_SECRET shorter than 32 chars", () => {
    const result = envSchema.safeParse({ ...validEnv, NEXTAUTH_SECRET: "short" });
    expect(result.success).toBe(false);
  });

  it("rejects empty GOOGLE_CLIENT_ID", () => {
    const result = envSchema.safeParse({ ...validEnv, GOOGLE_CLIENT_ID: "" });
    expect(result.success).toBe(false);
  });
});
