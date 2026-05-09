# The Prescription — Career Translation Diagnostic

A reflective diagnostic tool for NHS professionals who have worked in the NHS for many years and want to understand what other sectors, employers, or roles might value in their experience.

Built with **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**.

---

## What it does

The app guides users through 20 questions across six domains:

1. Complexity Translation
2. Ambiguity and Autonomy
3. Relationship-led Influence
4. Delivery and Momentum
5. Moral Courage and Values Alignment
6. Energy and Environment Fit

It produces a report identifying patterns, transferable capabilities, likely energising and draining environments, sectors to explore, language tips, and coaching questions.

It does **not** give personality types, fixed labels, or career advice. It is a starting point for reflection.

---

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- No database — answers stored in `sessionStorage` only
- No login or payment
- Deployable to Vercel with zero configuration

---

## Local development

### Prerequisites

- Node.js 18.17 or later
- npm

### Install and run

```bash
git clone https://github.com/YOUR_USERNAME/prescription-diagnostic.git
cd prescription-diagnostic
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

---

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel will detect Next.js automatically.

### Option 2: GitHub + Vercel dashboard

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and sign in.
3. Click **Add New → Project**.
4. Import your GitHub repository.
5. Vercel detects Next.js automatically — no build settings needed.
6. Click **Deploy**.

Your app will be live at `https://your-project.vercel.app` within a minute or two.

### Environment variables

None required for v1. The app runs entirely client-side with no external API calls.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx          Root layout with metadata
│   ├── globals.css         Global styles and CSS variables
│   ├── page.tsx            Landing page
│   ├── diagnostic/
│   │   └── page.tsx        Questionnaire page
│   └── report/
│       └── page.tsx        Report page
├── components/
│   ├── Layout.tsx          Page shell with header and footer
│   ├── ProgressBar.tsx     Step progress indicator
│   ├── QuestionCard.tsx    Renders each question type
│   ├── ReportSection.tsx   Report section wrapper
│   ├── ResultSummary.tsx   Domain score bar chart
│   └── Button.tsx          Reusable button component
├── data/
│   └── questions.ts        All 20 questions with domain scoring
├── lib/
│   ├── scoring.ts          Domain score calculation logic
│   └── report.ts           Deterministic report generation
└── types/
    └── index.ts            TypeScript interfaces
```

---

## Extending the report with AI

The `src/lib/report.ts` file uses deterministic logic and templated text. It is structured so that the `generateReport` function can be replaced or supplemented with an OpenAI or Anthropic API call in v2.

To add AI-generated report text:

1. Create a server action or API route in `src/app/api/report/route.ts`.
2. Pass `answers` and `domainScores` as context to your prompt.
3. Return the generated text and merge it into the `ReportData` structure.
4. Update `report/page.tsx` to call the API route after the diagnostic completes.

---

## Brand

**The Prescription** — Clarity in complexity

Tone: clear, reflective, practical, credible.
Avoid: cheesy personality quiz language, diagnostic certainty, or fixed archetypes.

---

## Licence

Private — The Prescription. Not for redistribution.
