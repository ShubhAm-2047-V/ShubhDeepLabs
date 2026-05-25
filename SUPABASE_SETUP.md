# ⚡ Supabase Cloud Database Setup Manual

This guide provides a step-by-step walkthrough to connect **ProjectHub Solutions** to a live, production-ready Supabase PostgreSQL database.

---

## 📅 Step 1: Create a New Supabase Project

1. Go to the [Supabase Website](https://supabase.com/) and sign in with your GitHub account or Email.
2. Click the **New Project** button on your organization dashboard.
3. Select an organization (or create a free one).
4. Fill in your project details:
   - **Name:** `projecthub-solutions`
   - **Database Password:** Click **Generate a password** (and save it securely somewhere!).
   - **Region:** Choose the server region closest to your target audience (e.g., `South Asia (Mumbai)` or `East US`).
   - **Pricing Plan:** Select the **Free** tier.
5. Click **Create new project**. 
6. Wait 1–2 minutes for Supabase to spin up your cloud database instance.

---

## 🔑 Step 2: Retrieve API Keys & Config

Once your project is provisioned, you will see your API credentials:
1. In the Supabase Sidebar, click the **Settings Cog (⚙️)** at the bottom, then click **API**.
2. Find the **Project API keys** and **Connection info** fields:
   - **Project URL:** Copy the URL (starts with `https://...`).
   - **anon (public):** Copy the long API key.
3. Open your project folder, find the [`.env.local`](file:///e:/My%20Website/.env.local) file, and paste those two values directly inside:

```ini
# ProjectHub Solutions - Real Supabase Database Connection Settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_anon_key...
```

---

## 🗄️ Step 3: Run the Database SQL Schema

Supabase uses PostgreSQL. To build your relational tables instantly:
1. Click the **SQL Editor (`>_`)** icon in the left-hand navigation sidebar.
2. Click **New query** (or the **+** button) to open a blank slate.
3. Copy and paste the following SQL script exactly:

```sql
-- 1. Create the orders ledger table
create table orders (
  id uuid default gen_random_uuid() primary key,
  "fullName" text not null,
  "collegeName" text not null,
  branch text,
  year text,
  "projectTitle" text not null,
  "techRequired" text,
  deadline text not null,
  budget text not null,
  description text,
  "needPPT" boolean default false,
  "needReport" boolean default false,
  "needVivaGuidance" boolean default false,
  "projectStatus" text default 'Pending',
  "paymentStatus" text default 'Unpaid',
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create the daily offers agenda table
create table offers (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subtext text,
  ribbon text,
  emoji text,
  "isActive" boolean default false,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable Row Level Security (RLS) on both tables
alter table orders enable row level security;
alter table offers enable row level security;

-- 4. Enable public read and write access rules (for instant client-side queries)
create policy "Allow public read/write on orders" on orders for all using (true) with check (true);
create policy "Allow public read/write on offers" on offers for all using (true) with check (true);
```

4. Click the **Run** (or `Ctrl + Enter` / `Cmd + Enter`) button in the bottom right corner of the SQL Editor.
5. You should see a success message: `"Success: Query returned 0 rows."`. 
6. Double-check your tables by clicking the **Table Editor (grid icon)** in the sidebar to verify that `orders` and `offers` are created with all fields ready!

---

## 🔒 Step 4: Add Your Coordinator Login Credentials

To lock and unlock your administrative Coordinator Desk desk securely:
1. Click the **Authentication (User ID icon)** in the sidebar.
2. Under the **Users** tab, click the **Add User** dropdown and select **Create User**.
3. Fill in the credentials:
   - **Email:** `admin@projecthub.com` (or your personal admin email)
   - **Password:** Create a secure admin password (e.g., `admin123`)
4. Toggle **Auto-confirm User** to **ON** (so you don't have to verify via email confirmation during testing).
5. Click **Create User**.

---

## 🚀 Step 5: Start testing!

Run the platform dev server locally:
```bash
bun run dev
```

1. Submit a test project outline on `/order` and click **"Build My Project!"**. It will immediately record to your live Supabase cloud database!
2. Open `/offers`, tap the **Graphite Scrub Card** 3 times, click the combo button, and see how the current active offer updates dynamically!
3. Go to `/admin/offers` and log in with your email/password. You can now toggle and change daily offers instantly in real-time!
