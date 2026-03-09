# NextNest — Unified Platform

A unified Next.js platform bridging care gaps, connecting donors, orphanages, and administrators.

---

## Team Structure & Working Areas

| Role | Working Directory |
|---|---|
| 🌐 **Website / Public Portal** | `src/app/(portals)/public/` |
| ❤️ **Donor Portal** | `src/app/(portals)/donor/` |
| 🏠 **Orphanage Portal** | `src/app/(portals)/orphanage/` |
| 🌟 **Super Admin Portal** | `src/app/(portals)/admin/` |
| 🤖 **AI Engine Developer** | `src/app/api/ai/` |

**Shared utilities** are in `src/lib/`:
- `supabase.ts` — Database client (use in any component)
- `groq.ts` — AI inference client (use in server-side API routes only)

---

## Setup (First Time)

### 1. Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

### 2. Clone the repository
```bash
git clone https://github.com/adal3396/IIITHack.git
cd IIITHack
```

### 3. Install dependencies
```bash
npm install
```

### 4. Set up environment variables
```bash
# Copy the example file
cp .env.example .env.local
```
Then open `.env.local` and fill in values (ask team lead for the credentials):
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase Project Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase Project Settings → API
- `GROQ_API_KEY` — from https://console.groq.com/keys *(AI Engine dev only)*

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Git Workflow

> **Important:** Only commit changes to **your assigned directory**. Coordinate with others on `src/lib/` and shared components.

```bash
# 1. Always pull the latest code before starting work
git pull origin main

# 2. Create a branch for your feature
git checkout -b feat/donor-ai-advisor

# 3. Stage and commit your changes
git add src/app/(portals)/donor/
git commit -m "feat(donor): add AI advisor chat interface"

# 4. Push your branch and open a Pull Request
git push origin feat/donor-ai-advisor
```

---

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL)
- **AI Inference:** Groq API
- **Icons:** Lucide React
