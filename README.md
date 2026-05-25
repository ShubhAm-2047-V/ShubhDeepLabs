# ProjectHub Solutions - Technical Manual & Guide

This is the developer reference guide and deployment manual for the **ProjectHub Solutions** academic project development service platform, built on Next.js, Tailwind CSS v4, Framer Motion, and Firebase.

---

## 🚀 1. Local Development Setup

To run this platform on your local machine, ensure you have **Bun** (recommended) or **Node.js** installed.

### Step 1: Install Dependencies
```bash
# Using Bun (Recommended)
bun install

# Using npm
npm install
```

### Step 2: Launch the Development Server
```bash
# Using Bun
bun run dev

# Using npm
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

---

## 🔑 2. Environment Variables Configuration

Create a file named `.env.local` in the root folder of your project and populate it with your Firebase Web App credentials:

```ini
# Firebase Config (Get these from your Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

> [!NOTE]
> **Zero-Config Local Fallback:** If you do not supply these environment variables, the system automatically runs in **Offline Mock Mode**, transparently persisting order records to `LocalStorage` and utilizing a secure mockup login session (`admin@projecthub.com` / `admin123`) for the admin panel. Once you supply environment keys, it will immediately hook into your live Firebase collection!

---

## 🔥 3. Firebase Console Configuration Guide

To provision your live cloud database and configure authentication:

### Step A: Initialize the Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project**, enter `projecthub-solutions`, and select your preferences (Google Analytics is optional).
3. Click **Create Project**.

### Step B: Setup Web App Connection
1. In the Project Dashboard, click the **Web icon (`</>`)**.
2. Register the app as `projecthub-web-client` and click **Register App**.
3. Copy the configuration credentials provided inside the `firebaseConfig` object and paste them into your `.env.local` file (as outlined above).

### Step C: Configure Cloud Firestore Database
1. In the sidebar, select **Build > Firestore Database**.
2. Click **Create Database**.
3. Choose your database location and select **Start in production mode** or **Test mode**.
4. In the **Rules** tab, adjust the read/write security as required (e.g., allowing authenticated admins full access):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /orders/{document} {
         allow read, write: if true; // Customize for security
       }
     }
   }
   ```

### Step D: Setup Admin Authentication
1. Select **Build > Authentication** in the sidebar.
2. Click **Get Started** and enable the **Email/Password** sign-in method.
3. In the **Users** tab, click **Add User** and register your admin email and password (e.g., `admin@projecthub.com` and your secure passphrase). 
4. The admin dashboard login page will now authenticate directly against this account!

---

## ☁️ 4. Vercel Deployment Guide

To deploy this Next.js platform to Vercel for free public hosting:

### Method 1: Vercel CLI (Super Fast)
1. Install Vercel globally: `npm i -g vercel`
2. Run the deployment sequence from your project root:
   ```bash
   vercel
   ```
3. Follow the CLI prompts to link the project.
4. Add your `.env.local` environment variables inside the Vercel dashboard or during CLI setup.
5. Deploy to production:
   ```bash
   vercel --prod
   ```

### Method 2: GitHub Integration (Recommended for CI/CD)
1. Initialize a git repository and push your project to a GitHub repository.
2. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New > Project**.
3. Import your GitHub repository.
4. Expand the **Environment Variables** panel and input the Firebase keys:
   *   `NEXT_PUBLIC_FIREBASE_API_KEY`
   *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   *   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   *   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   *   `NEXT_PUBLIC_FIREBASE_APP_ID`
5. Click **Deploy**. Vercel will automatically compile, optimize, and serve your app globally on a secure `https://...` address.

---

## 🛠️ 5. Technical Architecture Summary

```
E:\My Website
├── src
│   ├── app
│   │   ├── admin
│   │   │   └── page.js       # Admin Dashboard & Secure Login View
│   │   ├── order
│   │   │   └── page.js       # Dynamic Order Form Page (Suspense wrapped)
│   │   ├── globals.css       # Custom Tailwinds v4 design styles & glassmorphism
│   │   ├── layout.js         # SEO Optimization, Meta data, Global Toaster & theme layout
│   │   └── page.js           # Interactive home page sections (Hero, FAQ, Categories, Forms)
│   ├── components
│   │   ├── Navbar.js         # Sticky reactive header & Theme Toggles
│   │   ├── Footer.js         # Detailed columns & administrative indexes
│   │   └── WhatsAppButton.js # Bouncing Float button with prefilled order text
│   ├── context
│   │   └── ThemeContext.js   # Light/Dark persistent state context
│   └── lib
│       └── firebase.js       # Adaptive client connector & LocalStorage fallback engine
├── README.md                 # Technical configuration manual
├── jsconfig.json             # Root folder directory mappings configuration
└── package.json              # System libraries & scripts manifest
```
