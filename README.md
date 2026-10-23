# Digital Family Heritage (డిజిటల్ కుటుంబ వారసత్వం)

> **A modern, privacy-first, bilingual (English & Telugu) web platform dedicated to preserving ancestral roots, family trees, photographs, oral folklore, and milestones across generations.**

---

## 🌟 1. Product Vision

**Digital Family Heritage** preserves living and historical family roots across generations:
- **Intergenerational Family Tree**: Start with your oldest known ancestors (great-grandparents, patriarchs, matriarchs) and build downwards through children, grandchildren, and future generations.
- **Detailed Person Profiles**: Record full names, Unicode Telugu names (`రావు సూర్యనారాయణ`), nicknames, native villages, ancestral homes, traditional occupations, education, and life stories.
- **Living Family Timeline**: Chronicle weddings, migrations, ancestral courtyard homes built, festivals, and reunions.
- **Oral Lore & Memories**: Capture grandfather tales, recipes, and childhood recollections with contributor attribution.
- **Privacy by Default**: Multi-tenant database row-level security (RLS) ensures different families cannot access one another's private data.
- **No Accounts Required for Ancestors**: Deceased ancestors are treated as family heritage profiles, without requiring email accounts.
- **Live Interactive Demo**: Anyone can explore the full platform immediately using fictional sample data without authentication.

---

## 🛠️ 2. Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Interactive Family Tree**: [@xyflow/react](https://reactflow.dev/) (React Flow) with custom generational depth layout and branch isolation algorithms.
- **Database**: [Supabase](https://supabase.com/) PostgreSQL with Row-Level Security (RLS) and recursive cycle prevention triggers.
- **Authentication**: Supabase Auth (SSR Client `@supabase/ssr` with secure cookie management).
- **Storage**: Supabase Storage with private buckets (`family-photos`) and signed access.
- **Styling**: Tailwind CSS with custom heritage design system (warm terracotta, parchment, antique gold, and deep slate).
- **Localization**: Structured i18n supporting English and Telugu (`en` & `te`) throughout the entire application.
- **Testing**: Vitest with `@testing-library/jest-dom` for automated unit testing.
- **Deployment**: [Vercel](https://vercel.com/) & Supabase.

---

## 📂 3. Repository Structure

```
fam_heritage_project/
├── .env.example                     # Environment template with instructions
├── README.md                        # Complete project documentation
├── package.json                     # Dependencies and test/build scripts
├── tsconfig.json                    # TypeScript configuration
├── vitest.config.ts                 # Vitest test runner configuration
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql   # Relational schema (people, relationships, events, memories)
│       ├── 002_rls_and_functions.sql# RLS policies, ancestry cycle prevention triggers
│       └── 003_seed_demo.sql        # 3-generation bilingual seed data (Godavari delta)
└── src/
    ├── app/                         # Next.js App Router pages
    │   ├── page.tsx                 # Landing page & features overview
    │   ├── demo/page.tsx            # Live interactive demo with sample dataset
    │   ├── dashboard/page.tsx       # Authenticated workspace dashboard
    │   ├── tree/page.tsx            # Interactive family tree canvas
    │   ├── people/page.tsx          # People directory & profiles
    │   ├── timeline/page.tsx        # Family milestones chronological timeline
    │   ├── memories/page.tsx        # Oral stories & photo gallery
    │   ├── settings/page.tsx        # Archive settings, roles, & language switch
    │   ├── login/page.tsx           # Authentication sign-in
    │   ├── signup/page.tsx          # Account registration & archive setup
    │   └── forgot-password/page.tsx # Password recovery
    ├── components/
    │   ├── layout/                  # Navbar, Footer
    │   ├── tree/                    # React Flow PersonNode, FamilyTreeFlow, Controls
    │   ├── people/                  # PersonProfileDrawer, PersonFormModal, AddRelationshipModal
    │   ├── timeline/                # TimelineView
    │   ├── memories/                # MemoriesView
    │   └── settings/                # MembersManagement
    ├── lib/
    │   ├── cycle-prevention.ts      # Graph cycle prevention algorithms
    │   ├── genealogy-layout.ts      # Generational depth & node positioning engine
    │   ├── demo-data.ts             # Rich fictional bilingual sample archive
    │   ├── i18n/                    # Localization context, en.ts & te.ts dictionaries
    │   └── supabase/                # Browser and Server SSR clients, config detector
    ├── test/
    │   ├── setup.ts                 # Test setup
    │   └── genealogy.test.ts        # Automated unit tests
    └── types/                       # TypeScript database & graph definitions
```

---

## 🚀 4. Local Development Setup

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node.js v24)
- npm `v9+` or `v11+`

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd fam_heritage_project
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   > *Note: If Supabase credentials are not provided initially, the application operates in graceful setup mode, directing users to the full **Interactive Demonstration** (`/demo`).*

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ 5. Supabase Setup & Database Migrations

### 1. Create a Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Click **New Project** and select your region.
3. Once provisioned, navigate to **Project Settings > API**.
4. Copy your `Project URL` and `anon public` API key into `.env.local`:
   ```ini
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
   ```

### 2. Apply Database Migrations
Go to **Supabase Dashboard > SQL Editor > New Query**, and execute the migration files in order:
1. `supabase/migrations/001_initial_schema.sql`:
   - Creates `profiles`, `families`, `family_memberships`, `invitations`, `people`, `relationships`, `events`, `event_people`, `memories`, `media`, and `activity_logs`.
2. `supabase/migrations/002_rls_and_functions.sql`:
   - Enables **Row Level Security** on all family tables.
   - Installs the `prevent_relationship_cycles()` trigger to ensure no person can become their own ancestor.
   - Sets up role helpers (`is_family_member`, `is_family_editor`, `is_family_owner`).
3. `supabase/migrations/003_seed_demo.sql` *(Optional)*:
   - Populates the database with the fictional 3-generation Godavari Suryanarayana family archive.

### 3. Configure Storage Bucket
1. Go to **Storage > Create new bucket**.
2. Name the bucket `family-photos`.
3. Keep it **Private** (authenticated access only).
4. Apply read/write storage policies matching family membership.

---

## 🛡️ 6. Security, Roles & Cycle Prevention

### Multi-Tenant Authorization
- **Owner**: Full administrative control. Manage archive settings, invite relatives, assign roles, transfer or delete the archive.
- **Editor**: Can add and edit people, connect relationships, upload photographs, record memories, and add timeline milestones.
- **Viewer**: Read-only access to browse family records and private albums.

### Genealogy Graph Integrity
- **Cycle Prevention**: In `src/lib/cycle-prevention.ts` and database trigger `prevent_relationship_cycles`, a recursive DFS traversal verifies that a person cannot be added as an ancestor of their own descendant.
- **Self-Ancestry Safeguard**: Validates `parentId !== childId`.
- **Duplicate Detection**: Prevents duplicate parent-child or spouse relationships.

---

## 🧪 7. Automated Testing

Run the test suite using Vitest:
```bash
npm test
```

### Test Coverage includes:
- Ancestry cycle detection (preventing child from becoming parent of ancestor)
- Self-ancestry validation
- Duplicate relationship checks (reciprocal spouse handling)
- Generational layout algorithm (accurate generation depth assignment across 3 generations)
- Branch focus filtering (ancestor, descendant, and spouse isolation)
- Localization dictionary parity (100% key match between English and Telugu)

---

## ☁️ 8. Production Deployment to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Complete Digital Family Heritage Platform"
   git push origin main
   ```
2. Log into [Vercel](https://vercel.com) and click **Add New > Project**.
3. Import your GitHub repository.
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon public key
   - `NEXT_PUBLIC_SITE_URL`: Your production domain (e.g., `https://digital-family-heritage.vercel.app`)
5. Click **Deploy**. Vercel will compile the production build (`next build`) and deploy the application globally.

---

## 💾 9. Backup & Data Export

Users can export their complete family archive as a portable JSON document at any time:
1. Open the archive workspace and go to **Settings & Members** (or in the top banner of the Demo).
2. Click **Export Data** / **Export JSON**.
3. A JSON backup containing the family profile, all people records, relationship edges, timeline events, and memories will be downloaded to your device.

---

## 📜 10. License & Credits

Developed with care for families, ancestors, and future generations. Built as a student portfolio and learning project.
