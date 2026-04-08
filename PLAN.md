# LangZen — Language Learning Platform
**Design & Implementation Plan**
*Date: 2026-04-08*

---

## Context

LangZen is a web-based language learning platform targeting Vietnamese-speaking users who want to learn English or Korean. It aligns learning content to real exam tracks (IELTS/TOEFL for English, TOPIK-I/II for Korean) and issues certificates showing exam readiness. The platform uses gamification (streaks, XP, badges, leaderboard) to retain users. The UI supports English and Vietnamese via i18n.

---

## Requirements Summary

| Concern | Decision |
|---------|----------|
| Learning languages | English (IELTS, TOEFL tracks), Korean (TOPIK-I, TOPIK-II tracks) |
| UI languages | English + Vietnamese (next-intl) |
| Target users | Mixed levels — beginner to advanced |
| Content types | Reading, listening, video, grammar, speaking |
| Feedback | Rule-based: LanguageTool (grammar) + Web Speech API (pronunciation) |
| Auth | Email/password + Google OAuth via NextAuth.js |
| Stack | Next.js 14 App Router, PostgreSQL, Prisma ORM, Tailwind CSS, shadcn/ui |
| Services | Free-tier first, abstracted behind lib/ wrappers for easy swap |
| TypeScript | Strict mode, `noImplicitAny: true`, `@typescript-eslint/no-explicit-any: error` |

---

## Architecture

### Stack & Free-Tier Services

| Concern | Free Service | Upgrade Path |
|---------|-------------|--------------|
| Hosting | Vercel (free) | Vercel Pro |
| Database | Supabase free (500MB PostgreSQL) | Supabase Pro / Railway |
| File storage | Cloudinary free (25GB) | Cloudinary paid / AWS S3 |
| Auth | NextAuth.js (self-hosted) | Auth0 / Clerk |
| Email | Resend free (3,000/mo) | Resend Pro |
| Grammar check | LanguageTool open-source API | LanguageTool Premium |
| Pronunciation | Web Speech API (browser built-in) | Azure Speech / Deepgram |
| Certificate PDF | react-pdf (free, self-generated) | Certified third-party |

### Folder Structure

```
langzen/
├── app/
│   ├── (auth)/                  # login, register, verify
│   ├── (dashboard)/             # dashboard, progress
│   ├── (learn)/                 # lessons, quizzes
│   ├── (admin)/                 # content management
│   ├── api/
│   │   ├── auth/
│   │   ├── lessons/
│   │   ├── progress/
│   │   ├── certificates/
│   │   └── leaderboard/
│   └── layout.tsx
├── components/
│   ├── ui/                      # shadcn/ui base components
│   └── shared/                  # app-specific shared components
├── features/
│   ├── auth/
│   ├── lessons/
│   ├── quiz/
│   ├── progress/
│   ├── certificates/
│   └── leaderboard/
├── lib/
│   ├── db.ts                    # Prisma client singleton
│   ├── auth.ts                  # NextAuth config
│   ├── env.ts                   # Zod env validation
│   ├── storage.ts               # File storage abstraction
│   ├── email.ts                 # Email service abstraction
│   ├── grammar.ts               # Grammar check abstraction
│   └── validations/             # Zod schemas per feature
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── messages/
│   ├── en.json
│   └── vi.json
├── hooks/                       # Custom React hooks
├── types/                       # Global TypeScript types
├── config/                      # App-wide constants
└── docs/
    └── superpowers/specs/
```

### Key Conventions

| Convention | Rule |
|-----------|------|
| Components | Server Components by default; `"use client"` only when needed |
| Mutations | Next.js Server Actions — no extra API routes for internal mutations |
| Data fetching | Fetch in Server Components; never `useEffect` for initial data |
| Naming | `PascalCase` components, `camelCase` functions, `kebab-case` files |
| Feature modules | Each feature owns its components, hooks, actions, and types |
| Service wrappers | All external services behind `lib/` abstractions |
| Env variables | Validated at startup with Zod in `lib/env.ts` |
| Error handling | `error.tsx` boundaries per route group; API routes return typed `ApiResponse<T>` |
| Type safety | TypeScript strict mode; no `any`; Prisma types flow end-to-end |
| i18n | All user-facing strings via `next-intl` — no hardcoded UI text |

---

## Data Model (Prisma Schema)

### Enums
```prisma
enum Locale         { EN VI }
enum LanguageCode   { EN KO }
enum ExamType       { IELTS TOEFL TOPIK_I TOPIK_II }
enum LevelCode      { A1 A2 B1 B2 C1 C2 TOPIK_I TOPIK_II }
enum LessonType     { READING LISTENING VIDEO GRAMMAR SPEAKING }
enum QuestionType   { MCQ FILL_BLANK PRONUNCIATION WRITING }
enum ProgressStatus { NOT_STARTED IN_PROGRESS COMPLETED }
enum VocabStatus    { LEARNING REVIEW MASTERED }
enum NotifType      { STREAK_REMINDER BADGE_EARNED CERT_READY LEVEL_UP }
```

### Auth Tables (NextAuth required)
- `User` — id, email, name, image, hashedPassword?, preferredLocale, createdAt, updatedAt
- `Account` — OAuth provider accounts (provider + providerAccountId unique)
- `Session` — sessionToken, userId, expires
- `VerificationToken` — identifier, token, expires

### Learning Structure
- `ExamTrack` — languageCode, examType, nameKey, descriptionKey
- `Level` — examTrackId, code (LevelCode), order, nameKey
- `Lesson` — levelId, type (LessonType), titleKey, slug, contentJson, audioUrl?, videoUrl?, thumbnailUrl?, durationSec?, order, publishedAt?
- `Vocabulary` — languageCode, word, pronunciation?, audioUrl?, definitionKey, examplesJson
- `LessonVocabulary` — lessonId + vocabularyId (composite PK)

### Quizzes
- `Quiz` — lessonId, titleKey, passingScore (default 70%)
- `QuizQuestion` — quizId, type (QuestionType), questionKey, optionsJson?, correctAnswer, explanationKey?, points, order
- `UserQuizAttempt` — userId, quizId, score, totalPoints, passed, startedAt, completedAt?
- `UserQuizAnswer` — attemptId, questionId, userAnswer, isCorrect, feedbackText?, pointsEarned

### User Progress
- `UserProgress` — userId + languageCode (unique), xp, currentStreak, longestStreak, lastActiveDate?, totalLessonsCompleted, totalQuizzesPassed
- `UserLessonProgress` — userId + lessonId (unique), status, score?, attempts, startedAt?, completedAt?
- `UserVocabulary` — userId + vocabularyId (unique), status (VocabStatus), nextReviewAt? (spaced repetition)

### Feedback
- `GrammarFeedback` — userId, lessonId, submittedText, feedbackJson (LanguageTool response), createdAt

### Certificates
- `Certificate` — userId, examTrackId, levelId, verificationCode (UUID unique), pdfUrl?, scoresSummaryJson?, issuedAt

### Gamification
- `Badge` — nameKey, descriptionKey, icon, conditionJson ({ type, value })
- `UserBadge` — userId + badgeId (composite PK), earnedAt
- `LeaderboardSnapshot` — userId, languageCode, xp, rank, weekOf (Monday; unique per user+lang+week)

### Notifications
- `Notification` — userId, type (NotifType), titleKey, messageKey, read, createdAt

---

## Pages & Navigation

```
/ (landing)                              — hero, features, exam tracks, CTA
/auth/login                              — email/password + Google
/auth/register                           — email/password + Google
/auth/verify                             — email verification

/dashboard                               — streak, XP, active languages, recent lessons
/dashboard/progress                      — detailed stats per language

/learn                                   — language selector (EN / KO)
/learn/[lang]                            — exam track selector
/learn/[lang]/[track]                    — level map
/learn/[lang]/[track]/[level]            — lesson list
/learn/[lang]/[track]/[level]/[slug]     — lesson page
/learn/[lang]/[track]/[level]/[slug]/quiz — quiz

/vocabulary                              — saved words, spaced repetition review
/certificates                            — earned certificates + PDF download
/certificates/verify/[code]              — public verification (no login required)
/leaderboard                             — weekly ranking by language
/profile                                 — avatar, name, locale, password
/notifications                           — notification inbox
```

**Navigation:**
- Top navbar: Logo | Learn | Vocabulary | Leaderboard | Certificates | [User menu]
- Language toggle (EN/VI) always visible
- Sidebar on `/learn` routes showing level progress map

---

## Feature Modules

### 1. Auth (`features/auth/`)
- Register with email/password (bcrypt hash)
- Login with email/password or Google OAuth
- Email verification flow via Resend
- Session management via NextAuth

### 2. Lessons (`features/lessons/`)
- Lesson page renders based on `LessonType`
- Reading: rich text + vocabulary highlights
- Listening: audio player + transcript
- Video: embedded Cloudinary video + notes
- Grammar: explanation + interactive examples
- Speaking: Web Speech API recording + pronunciation score

### 3. Quiz (`features/quiz/`)
- MCQ, fill-in-the-blank, writing, pronunciation question types
- Rule-based feedback per answer
- Grammar check via LanguageTool on writing answers
- Pass/fail based on `passingScore` threshold
- XP awarded on completion

### 4. Progress (`features/progress/`)
- XP increments on lesson completion and quiz pass
- Streak: compare `lastActiveDate` to today; reset if gap > 1 day
- Level unlocks when all lessons in previous level completed + quiz passed
- Badge evaluation after each XP/streak/completion event

### 5. Certificates (`features/certificates/`)
- Auto-issued when user passes all quizzes in a level
- PDF generated server-side with `react-pdf`
- Uploaded to Cloudinary, URL stored in `Certificate.pdfUrl`
- Public verification via `/certificates/verify/[verificationCode]`

### 6. Leaderboard (`features/leaderboard/`)
- Weekly cron job (Vercel Cron) snapshots top users into `LeaderboardSnapshot`
- Ranked by XP earned in the current week per language

### 7. Vocabulary (`features/vocabulary/`)
- Words saved during lesson
- Spaced repetition: `nextReviewAt` updated after each review
- Review queue shows words due today

### 8. i18n
- `next-intl` with `messages/en.json` and `messages/vi.json`
- All DB string fields use i18n keys (nameKey, titleKey, etc.)
- Locale stored in `User.preferredLocale`, togglable in navbar

---

## Service Abstractions (`lib/`)

```typescript
// lib/storage.ts — swap Cloudinary → S3 by changing this file only
export async function uploadFile(file: Buffer, path: string): Promise<string>
export async function deleteFile(path: string): Promise<void>

// lib/email.ts — swap Resend → SES by changing this file only
export async function sendVerificationEmail(to: string, token: string): Promise<void>
export async function sendCertificateEmail(to: string, certUrl: string): Promise<void>

// lib/grammar.ts — swap LanguageTool → Premium by changing this file only
export async function checkGrammar(text: string, lang: LanguageCode): Promise<GrammarResult>

// lib/env.ts — Zod validation, crashes at startup on missing vars
export const env = z.object({ DATABASE_URL, NEXTAUTH_SECRET, ... }).parse(process.env)
```

---

## Verification Plan

1. **Auth flow** — register, verify email, login with email, login with Google, logout
2. **Lesson flow** — navigate to a lesson, complete reading/listening/video/grammar/speaking
3. **Quiz flow** — take a quiz, submit answers, receive feedback, earn XP
4. **Progress** — streak increments daily, XP accumulates, badge awarded on trigger
5. **Certificate** — complete all lessons + quizzes in a level → certificate issued → PDF downloadable → verification URL works publicly
6. **Leaderboard** — weekly snapshot populated, ranking displayed correctly
7. **i18n** — toggle EN↔VI, all UI text switches, no hardcoded strings remain
8. **TypeScript** — `tsc --noEmit` passes with zero errors; ESLint `no-explicit-any` passes
9. **Service swap test** — confirm `lib/storage.ts` interface is the only change needed to switch providers

---

## Implementation Steps

### Phase 1 — Project Bootstrap
1. Create Next.js 14 app with TypeScript strict mode
2. Configure Tailwind CSS + shadcn/ui
3. Set up `lib/env.ts` with Zod env validation
4. Configure `next-intl` with `en.json` and `vi.json`
5. Create ESLint config with `@typescript-eslint/no-explicit-any: error`
6. Create project-specific `langzen-conventions` skill

### Phase 2 — Database & Auth
1. Set up Prisma with Supabase PostgreSQL
2. Write full `schema.prisma` from data model above
3. Run initial migration
4. Configure NextAuth.js with Google + credentials providers
5. Build auth pages: login, register, verify

### Phase 3 — Core Learning Features
1. Build ExamTrack + Level + Lesson data seeding scripts
2. Build lesson page with type-based rendering (Reading, Listening, Video, Grammar, Speaking)
3. Integrate Cloudinary for audio/video
4. Build quiz engine with MCQ, fill-blank, writing, pronunciation
5. Integrate LanguageTool for grammar feedback
6. Integrate Web Speech API for pronunciation scoring

### Phase 4 — Progress & Gamification
1. Build XP + streak system (Server Actions)
2. Build badge evaluation engine
3. Build leaderboard with Vercel Cron weekly snapshot
4. Build vocabulary review with spaced repetition

### Phase 5 — Certificates
1. Build certificate issuance logic (trigger on level completion)
2. Generate PDF with react-pdf
3. Upload to Cloudinary, store URL
4. Build public verification page

### Phase 6 — Dashboard & Polish
1. Build dashboard with stats, streak widget, recent lessons
2. Build notifications system
3. Build profile page with locale switcher
4. Final i18n audit — ensure no hardcoded strings
5. TypeScript audit — `tsc --noEmit` clean

### Phase 7 — Skill Creation
1. Write `langzen-conventions` skill to `~/.claude/plugins/`
2. Encode: folder structure, naming conventions, Server Action vs API route, service wrapper pattern, i18n compliance, no-any rule
