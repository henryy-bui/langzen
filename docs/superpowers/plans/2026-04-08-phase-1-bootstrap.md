# Phase 1 — Project Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the LangZen Next.js 14 project with TypeScript strict mode, Tailwind CSS, shadcn/ui, next-intl (EN/VI), Zod env validation, ESLint with no-any rule, Jest, and a project-specific conventions skill.

**Architecture:** Single Next.js 14 App Router monorepo. All external services abstracted behind `lib/` wrappers. i18n via `next-intl` with locale-based routing (`/[locale]/...`). Environment validated at startup with Zod — missing vars crash immediately.

**Tech Stack:** Next.js 14, TypeScript 5 (strict), Tailwind CSS, shadcn/ui, next-intl, Zod, Jest, React Testing Library, ESLint + @typescript-eslint

---

## File Map

| File | Responsibility |
|------|---------------|
| `next.config.ts` | Next.js config with next-intl plugin |
| `tsconfig.json` | TypeScript strict config with path aliases |
| `.eslintrc.json` | ESLint rules including no-explicit-any |
| `tailwind.config.ts` | Tailwind config with shadcn/ui theme |
| `postcss.config.mjs` | PostCSS for Tailwind |
| `jest.config.ts` | Jest config for Next.js |
| `jest.setup.ts` | Jest global setup with RTL |
| `middleware.ts` | next-intl locale detection + routing |
| `i18n/request.ts` | next-intl server-side config |
| `lib/env.ts` | Zod env validation — crashes on missing vars |
| `messages/en.json` | English UI translations |
| `messages/vi.json` | Vietnamese UI translations |
| `app/layout.tsx` | Root HTML shell (lang attribute) |
| `app/[locale]/layout.tsx` | Locale-aware layout with NextIntlClientProvider |
| `app/[locale]/page.tsx` | Placeholder home page |
| `app/[locale]/error.tsx` | Route-level error boundary |
| `app/[locale]/not-found.tsx` | 404 page |
| `config/index.ts` | App-wide constants (supported locales, languages) |
| `types/index.ts` | Global TypeScript types (ApiResponse<T>, etc.) |
| `components/ui/` | shadcn/ui generated components |
| `components/shared/LocaleSwitcher.tsx` | EN/VI toggle component |

---

## Task 1: Initialize Next.js 14 App

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/globals.css`

- [ ] **Step 1: Run create-next-app inside the existing langzen directory**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --yes
```

Expected output: `Success! Created langzen at ...`

- [ ] **Step 2: Verify the project structure**

```bash
ls "/Users/habui/Desktop/My Projects/langzen"
```

Expected: `app/  components/  node_modules/  public/  next.config.ts  package.json  tsconfig.json  tailwind.config.ts`

- [ ] **Step 3: Verify the dev server starts**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
kill %1
```

Expected: `200`

- [ ] **Step 4: Commit**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && git init && git add . && git commit -m "feat: initialize Next.js 14 app with TypeScript, Tailwind, ESLint"
```

---

## Task 2: Harden TypeScript Configuration

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Replace tsconfig.json with strict config**

Replace the contents of `tsconfig.json` with:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npx tsc --noEmit
```

Expected: No errors (exit code 0)

- [ ] **Step 3: Commit**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && git add tsconfig.json && git commit -m "feat: harden TypeScript config with strict mode and noImplicitAny"
```

---

## Task 3: Configure ESLint with No-Any Rule

**Files:**
- Modify: `.eslintrc.json`

- [ ] **Step 1: Install TypeScript ESLint packages**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Expected: packages added to `devDependencies`

- [ ] **Step 2: Replace .eslintrc.json**

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }],
    "@typescript-eslint/no-non-null-assertion": "error",
    "prefer-const": "error"
  }
}
```

- [ ] **Step 3: Verify ESLint passes on existing files**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npx eslint . --ext .ts,.tsx --max-warnings 0
```

Expected: No errors, no warnings (exit code 0)

- [ ] **Step 4: Commit**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && git add .eslintrc.json package.json package-lock.json && git commit -m "feat: configure ESLint with @typescript-eslint/no-explicit-any as error"
```

---

## Task 4: Install and Configure shadcn/ui

**Files:**
- Create: `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/badge.tsx`, `lib/utils.ts`
- Modify: `tailwind.config.ts`, `app/globals.css`

- [ ] **Step 1: Install shadcn/ui**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npx shadcn@latest init --yes --defaults
```

When prompted (if not using `--yes`):
- Style: Default
- Base color: Slate
- CSS variables: Yes

Expected: `components/ui/` created, `lib/utils.ts` created, `tailwind.config.ts` and `globals.css` updated.

- [ ] **Step 2: Add core components we will use throughout the project**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npx shadcn@latest add button card badge avatar progress separator skeleton toast
```

Expected: Components added to `components/ui/`

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && git add -A && git commit -m "feat: install and configure shadcn/ui with core components"
```

---

## Task 5: Set Up Zod Environment Validation

**Files:**
- Create: `lib/env.ts`
- Create: `lib/env.test.ts`
- Modify: `.env.example`

- [ ] **Step 1: Install Zod**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npm install zod
```

- [ ] **Step 2: Create `.env.example`**

```bash
cat > "/Users/habui/Desktop/My Projects/langzen/.env.example" << 'EOF'
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/langzen

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Resend
RESEND_API_KEY=your-resend-api-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
```

- [ ] **Step 3: Create `.env.local` with placeholder values for development**

```bash
cp "/Users/habui/Desktop/My Projects/langzen/.env.example" "/Users/habui/Desktop/My Projects/langzen/.env.local"
```

- [ ] **Step 4: Create `lib/env.ts`**

```typescript
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),

  // NextAuth
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),

  // Resend
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),

  // Public
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables — fix them before starting the server.");
}

export const env = parsed.data;
```

- [ ] **Step 5: Add `.env.local` to `.gitignore` (verify it's there)**

```bash
grep -q ".env.local" "/Users/habui/Desktop/My Projects/langzen/.gitignore" && echo "already ignored" || echo ".env.local" >> "/Users/habui/Desktop/My Projects/langzen/.gitignore"
```

Expected: `already ignored` (create-next-app adds it by default)

- [ ] **Step 6: Verify TypeScript compiles**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 7: Commit**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && git add lib/env.ts .env.example .gitignore package.json package-lock.json && git commit -m "feat: add Zod env validation in lib/env.ts — crashes on missing vars"
```

---

## Task 6: Configure next-intl for EN/VI i18n

**Files:**
- Create: `i18n/request.ts`
- Create: `middleware.ts`
- Create: `messages/en.json`
- Create: `messages/vi.json`
- Create: `config/index.ts`
- Modify: `next.config.ts`
- Modify: `app/layout.tsx`
- Create: `app/[locale]/layout.tsx`
- Create: `app/[locale]/page.tsx`
- Create: `app/[locale]/error.tsx`
- Create: `app/[locale]/not-found.tsx`

- [ ] **Step 1: Install next-intl**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npm install next-intl
```

- [ ] **Step 2: Create `config/index.ts`**

```typescript
// config/index.ts
export const LOCALES = ["en", "vi"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "vi";

export const LEARNING_LANGUAGES = ["EN", "KO"] as const;
export type LearningLanguage = (typeof LEARNING_LANGUAGES)[number];
```

- [ ] **Step 3: Create `i18n/request.ts`**

```typescript
// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/config";

export default getRequestConfig(async ({ locale }) => {
  if (!LOCALES.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)) as Record<string, unknown>,
  };
});
```

- [ ] **Step 4: Create `middleware.ts`**

```typescript
// middleware.ts
import createMiddleware from "next-intl/middleware";
import { LOCALES, DEFAULT_LOCALE } from "@/config";

export default createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 5: Update `next.config.ts` to use next-intl plugin**

```typescript
// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Create `messages/en.json`**

```json
{
  "nav": {
    "learn": "Learn",
    "vocabulary": "Vocabulary",
    "leaderboard": "Leaderboard",
    "certificates": "Certificates",
    "dashboard": "Dashboard",
    "profile": "Profile",
    "logout": "Log out",
    "login": "Log in",
    "register": "Sign up"
  },
  "home": {
    "title": "Learn English & Korean",
    "subtitle": "Prepare for IELTS, TOEFL, TOPIK and earn certificates that prove your level.",
    "cta": "Start Learning Free"
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong.",
    "retry": "Try again",
    "save": "Save",
    "cancel": "Cancel",
    "back": "Back",
    "next": "Next",
    "submit": "Submit"
  },
  "locale": {
    "en": "English",
    "vi": "Tiếng Việt"
  }
}
```

- [ ] **Step 7: Create `messages/vi.json`**

```json
{
  "nav": {
    "learn": "Học",
    "vocabulary": "Từ vựng",
    "leaderboard": "Bảng xếp hạng",
    "certificates": "Chứng chỉ",
    "dashboard": "Tổng quan",
    "profile": "Hồ sơ",
    "logout": "Đăng xuất",
    "login": "Đăng nhập",
    "register": "Đăng ký"
  },
  "home": {
    "title": "Học Tiếng Anh & Tiếng Hàn",
    "subtitle": "Chuẩn bị cho IELTS, TOEFL, TOPIK và nhận chứng chỉ chứng minh trình độ của bạn.",
    "cta": "Bắt đầu học miễn phí"
  },
  "common": {
    "loading": "Đang tải...",
    "error": "Đã xảy ra lỗi.",
    "retry": "Thử lại",
    "save": "Lưu",
    "cancel": "Hủy",
    "back": "Quay lại",
    "next": "Tiếp theo",
    "submit": "Gửi"
  },
  "locale": {
    "en": "English",
    "vi": "Tiếng Việt"
  }
}
```

- [ ] **Step 8: Update root `app/layout.tsx`**

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LangZen — Learn English & Korean",
  description: "Prepare for IELTS, TOEFL, TOPIK with structured lessons and earn certificates.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
```

- [ ] **Step 9: Create `app/[locale]/layout.tsx`**

```typescript
// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/config";
import "../globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "LangZen",
  description: "Learn English & Korean. Prepare for IELTS, TOEFL, TOPIK.",
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;

  if (!LOCALES.includes(locale as Locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 10: Create `app/[locale]/page.tsx`**

```typescript
// app/[locale]/page.tsx
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");

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
```

- [ ] **Step 11: Create `app/[locale]/error.tsx`**

```typescript
// app/[locale]/error.tsx
"use client";

import { useTranslations } from "next-intl";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
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
```

- [ ] **Step 12: Create `app/[locale]/not-found.tsx`**

```typescript
// app/[locale]/not-found.tsx
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found.</p>
      <Link href="/" className="text-primary underline">
        Go home
      </Link>
    </div>
  );
}
```

- [ ] **Step 13: Verify TypeScript and build**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npx tsc --noEmit
```

Expected: No errors

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`

- [ ] **Step 14: Verify i18n routing works**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npm run dev &
sleep 6
echo "--- EN ---"
curl -s http://localhost:3000/en | grep -o "Learn English.*Korean"
echo "--- VI ---"
curl -s http://localhost:3000/vi | grep -o "Học Tiếng Anh.*Hàn"
kill %1
```

Expected:
```
--- EN ---
Learn English & Korean
--- VI ---
Học Tiếng Anh & Tiếng Hàn
```

- [ ] **Step 15: Commit**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && git add -A && git commit -m "feat: configure next-intl with EN/VI locale routing"
```

---

## Task 7: Set Up Jest + React Testing Library

**Files:**
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Create: `lib/env.test.ts`

- [ ] **Step 1: Install Jest and RTL**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npm install --save-dev \
  jest \
  jest-environment-jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @types/jest \
  ts-jest
```

- [ ] **Step 2: Create `jest.config.ts`**

```typescript
// jest.config.ts
import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  collectCoverageFrom: [
    "lib/**/*.ts",
    "features/**/*.ts",
    "features/**/*.tsx",
    "components/**/*.tsx",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
};

export default createJestConfig(config);
```

- [ ] **Step 3: Create `jest.setup.ts`**

```typescript
// jest.setup.ts
import "@testing-library/jest-dom";
```

- [ ] **Step 4: Add test scripts to package.json**

In `package.json`, add to the `"scripts"` section:

```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

- [ ] **Step 5: Write failing test for env validation**

Create `lib/env.test.ts`:

```typescript
// lib/env.test.ts
import { z } from "zod";

// We test the schema directly, not the module (which reads process.env at import time)
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
```

- [ ] **Step 6: Run failing tests to verify setup**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npm test -- lib/env.test.ts --verbose
```

Expected: All 5 tests PASS (they test the schema directly, not the module)

- [ ] **Step 7: Commit**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && git add -A && git commit -m "feat: add Jest + RTL setup with env schema tests"
```

---

## Task 8: Create Global Types and Base Folder Structure

**Files:**
- Create: `types/index.ts`
- Create: `hooks/.gitkeep`
- Create: `features/.gitkeep`

- [ ] **Step 1: Create `types/index.ts`**

```typescript
// types/index.ts

/** Standard API response wrapper — use in all API route handlers */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  pagination: PaginationMeta;
}>;
```

- [ ] **Step 2: Create placeholder dirs for features and hooks**

```bash
touch "/Users/habui/Desktop/My Projects/langzen/hooks/.gitkeep"
touch "/Users/habui/Desktop/My Projects/langzen/features/.gitkeep"
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && git add types/index.ts hooks/.gitkeep features/.gitkeep && git commit -m "feat: add global ApiResponse types and base folder structure"
```

---

## Task 9: Create LocaleSwitcher Component

**Files:**
- Create: `components/shared/LocaleSwitcher.tsx`

- [ ] **Step 1: Create `components/shared/LocaleSwitcher.tsx`**

```typescript
// components/shared/LocaleSwitcher.tsx
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && git add components/shared/LocaleSwitcher.tsx && git commit -m "feat: add LocaleSwitcher component for EN/VI toggle"
```

---

## Task 10: Create langzen-conventions Skill

**Files:**
- Create: `~/.claude/plugins/langzen/skills/langzen-conventions.md`

- [ ] **Step 1: Create the skill directory**

```bash
mkdir -p ~/.claude/plugins/langzen/skills
```

- [ ] **Step 2: Create the skill file**

```bash
cat > ~/.claude/plugins/langzen/skills/langzen-conventions.md << 'SKILL'
---
name: langzen-conventions
description: Use at the start of every LangZen development session — enforces project architecture, naming, TypeScript, i18n, and service wrapper conventions
---

# LangZen Project Conventions

## Stack
- Next.js 14 App Router, TypeScript strict (no `any`), Tailwind CSS, shadcn/ui
- Prisma + Supabase PostgreSQL, NextAuth.js, next-intl (EN/VI)
- Free-tier services abstracted behind `lib/` wrappers

## Folder Placement Rules

| What you're creating | Where it goes |
|---------------------|---------------|
| Page UI | `app/[locale]/(group)/page.tsx` |
| Route group layout | `app/[locale]/(group)/layout.tsx` |
| Error boundary | `app/[locale]/(group)/error.tsx` |
| API route | `app/api/<resource>/route.ts` |
| Feature component | `features/<feature>/components/` |
| Feature server action | `features/<feature>/actions.ts` |
| Feature types | `features/<feature>/types.ts` |
| Feature hooks | `features/<feature>/hooks/` |
| Shared UI component | `components/shared/` |
| shadcn/ui component | `components/ui/` (auto-generated, do not edit) |
| External service wrapper | `lib/<service>.ts` |
| Zod validation schema | `lib/validations/<feature>.ts` |
| Global types | `types/index.ts` |
| App constants | `config/index.ts` |
| Custom hooks (global) | `hooks/` |

## TypeScript Rules — HARD

- NEVER use `any`. Use `unknown` and narrow with type guards.
- NEVER use non-null assertion (`!`). Use optional chaining or explicit checks.
- All API routes return `ApiResponse<T>` from `types/index.ts`.
- All Prisma queries use the generated types — never redeclare DB shapes manually.
- Use `type` imports: `import type { Foo } from "..."`.

## Component Rules

- Default to **Server Components** — no `"use client"` unless you need browser APIs, event handlers, or React state.
- Never use `useEffect` for initial data fetching — fetch in Server Components.
- Use **Server Actions** for mutations. Only create API routes for external consumers.

## i18n Rules — HARD

- NEVER hardcode user-facing strings. Use `useTranslations()` in client components, `getTranslations()` in server components.
- Add all new keys to BOTH `messages/en.json` AND `messages/vi.json` before using them.
- DB content fields that need translation use a `Key` suffix (e.g., `nameKey`, `titleKey`) and map to `messages/*.json` keys.

## Service Wrapper Rules

- All external services (storage, email, grammar check) must be called through `lib/*.ts` wrappers.
- The wrapper exports a typed function interface. The implementation detail (which provider) is inside the wrapper only.
- To swap providers, change only the wrapper file — callers never change.

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| React components | PascalCase | `LessonCard.tsx` |
| Files (non-component) | kebab-case | `lesson-utils.ts` |
| Functions/variables | camelCase | `getLessonById` |
| Constants | SCREAMING_SNAKE | `DEFAULT_LOCALE` |
| Prisma models | PascalCase | `UserProgress` |
| DB enum values | SCREAMING_SNAKE | `NOT_STARTED` |
| API routes | kebab-case dirs | `app/api/exam-tracks/route.ts` |

## Testing Rules

- Write tests in `<file>.test.ts` alongside the file being tested.
- Use Jest + React Testing Library.
- Test `lib/` functions with unit tests. Test components with RTL.
- Run `npx tsc --noEmit && npm test` before every commit.

## Before Every Commit

1. `npx tsc --noEmit` — must pass with zero errors
2. `npx eslint . --ext .ts,.tsx --max-warnings 0` — must pass
3. `npm test` — all tests must pass

## Environment Variables

- Never access `process.env` directly. Always import from `lib/env.ts`.
- Add new vars to `.env.example` and `lib/env.ts` schema simultaneously.
SKILL
```

- [ ] **Step 3: Verify the skill file was created**

```bash
cat ~/.claude/plugins/langzen/skills/langzen-conventions.md | head -5
```

Expected: First 5 lines of the skill file

- [ ] **Step 4: Commit the skill reference inside the project**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && echo "# Conventions\nSee ~/.claude/plugins/langzen/skills/langzen-conventions.md" > CONVENTIONS.md
git add CONVENTIONS.md && git commit -m "docs: add reference to langzen-conventions Claude skill"
```

---

## Final Verification

- [ ] **Run full verification suite**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && npx tsc --noEmit && echo "✓ TypeScript OK"
npx eslint . --ext .ts,.tsx --max-warnings 0 && echo "✓ ESLint OK"
npm test -- --passWithNoTests && echo "✓ Tests OK"
npm run build 2>&1 | grep -E "(✓|Error|Failed)" | head -10
```

Expected:
```
✓ TypeScript OK
✓ ESLint OK
✓ Tests OK
✓ Compiled successfully
```

- [ ] **Verify git log shows clean commit history**

```bash
cd "/Users/habui/Desktop/My Projects/langzen" && git log --oneline
```

Expected: 9-10 commits, each representing a logical unit of work.
