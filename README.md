# Akash Vaidya — Developer Portfolio

A production-ready, editorial developer portfolio built with **React 19**, **Vite**, **Framer Motion**, and **Modern CSS**. Specifically engineered to showcase senior **Flutter mobile development** mastery (Riverpod, offline-first Hive caching, hardware ESC/POS thermal printing, voice POS dictation) alongside modern **React web architecture**.

---

## 🚀 Key Highlights & Architecture

- **Visual Design Identity:** Premium dark charcoal backgrounds (`#0a0d12`, `#111620`), tasteful emerald green accents (`#10b981`, `#34d399`), refined borders, and typography using Inter & JetBrains Mono.
- **Genuine Engineering Narrative:** Highlights real commercial applications without fabricated employment metrics:
  - **Xtream Arena:** Voice POS order entry & ESC/POS Bluetooth/WiFi thermal printer hardware integration.
  - **VedicMitra:** Multi-tenant consultation mobile platform with sub-100ms Hive caching & declarative GoRouter.
  - **WhatsApp CRM:** Full-stack multi-agent inbox with real-time WebSocket event streams.
  - **Clinic Management Suite:** Coordinated doctor consultation & frontdesk reception ecosystem with digital prescription generation.
  - **DigiSlips:** Paperless school circular and digital signature consent suite.
  - **SIH Fixly:** Smart India Hackathon civic grievance reporting mobile app with GPS sensor locking.
- **Deep-Dive Case Study Modals:** Interactive Framer Motion modals exploring architecture blueprints, technical decisions, and hardware-software synergy.
- **Validated Contact Flow:** Client-side validation with pre-formatted direct `mailto:` execution, one-click clipboard copying, and honest architecture disclosure.
- **Production-Ready SEO & Deployment:** Configured `index.html` Open Graph metadata, `public/robots.txt`, `public/sitemap.xml`, and `vercel.json` SPA rewrite rules.

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
| :--- | :--- | :--- |
| **React** | Core component architecture | `^19.2.8` |
| **Vite** | Build tool & lightning-fast HMR | `^8.3.0` |
| **React Router DOM** | Client-side declarative routing | `^7.18.4` |
| **Framer Motion** | Physics-based micro-interactions | `^14.1.0` |
| **Lucide React** | Consistent iconography | `^1.55.0` |
| **Modern CSS** | CSS custom properties, Grid, Flexbox | Vanilla CSS |

---

## 📂 Project Structure

```text
portfollio/
├── index.html                   # HTML entrypoint with SEO & OpenGraph meta tags
├── vercel.json                  # Single-Page Application (SPA) routing configuration
├── vite.config.js               # Vite bundler configuration
├── package.json                 # Project dependencies & scripts
├── public/
│   ├── favicon.svg              # Emerald code-bracket brand favicon
│   ├── robots.txt               # Web crawler instructions
│   └── sitemap.xml              # XML search engine sitemap
└── src/
    ├── main.jsx                 # React root renderer
    ├── App.jsx                  # Main application routes (<Routes>, <Route>)
    ├── index.css                # Global CSS imports
    ├── assets/                  # Static media & brand icons
    ├── layouts/
    │   └── MainLayout.jsx       # Layout shell (Navbar, ScrollToTop, Outlet, Footer)
    ├── pages/
    │   ├── Home.jsx             # Hero, principles, flagship projects, skills snapshot
    │   ├── About.jsx            # Engineering background, philosophy, skills matrix
    │   ├── Projects.jsx         # Searchable, filterable project catalog with modal
    │   ├── Experience.jsx       # Milestones timeline, hackathon, core standards
    │   ├── Contact.jsx          # Validated contact form, direct channels, copy helpers
    │   └── NotFound.jsx         # Custom 404 page
    ├── components/
    │   ├── Navbar.jsx           # Responsive sticky header with mobile slide drawer
    │   ├── Footer.jsx           # Editorial footer with navigation & status pill
    │   ├── ProjectCard.jsx      # Interactive project cards with deep-dive modal
    │   ├── ProjectModal.jsx     # Full case-study architecture breakdown modal
    │   ├── SectionTitle.jsx     # Reusable section heading with badges
    │   ├── SocialLinks.jsx      # Social channel buttons with accessible ARIA
    │   └── Icons.jsx            # Custom vector brand SVG icons (GitHub, LinkedIn)
    ├── data/
    │   ├── projects.js          # Verified project catalog with architecture notes
    │   ├── skills.js            # Categorized mobile, hardware, and web skills
    │   ├── experience.js        # Timeline milestones & engineering principles
    │   └── socials.js           # Verified contact links & availability
    └── styles/
        ├── variables.css        # Design tokens: colors, typography, radii, transitions
        ├── global.css           # Resets, baseline layout, utility classes
        ├── responsive.css       # Navigation bar & mobile responsive rules
        └── components.css       # Page layouts, modal styles, timeline, contact cards
```

---

## 💻 Local Development Commands

### 1. Run Development Server
```bash
npm run dev
```
Starts Vite development server with Hot Module Replacement (HMR) at `http://localhost:5173`.

### 2. Run Lint Check
```bash
npm run lint
```
Runs ESLint with React Hooks and Refresh verification.

### 3. Build for Production
```bash
npm run build
```
Generates optimized, minified production assets in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```
Spins up a local server to test the generated production bundle.

---

## 🚢 Deployment Guide

### Deploying to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete senior portfolio with React 19, Vite, and Framer Motion"
   git remote add origin https://github.com/arao62916-sys/portfolio.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Import your GitHub repository (`portfolio`).
   - Framework Preset: **Vite** (auto-detected).
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
   - Click **Deploy**.

`vercel.json` is already included at the root to route all requests (`/(.*)`) to `index.html`, ensuring direct navigation to nested URLs like `/projects`, `/about`, and `/contact` works without 404 errors.

---

## 📬 Contact Form Configuration

By default, the form operates in client-direct mode:
- Opens the user's default email client (`mailto:akshvadh@resiliencesoft.com`) with all fields formatted.
- Provides a one-click **"Copy Message to Clipboard"** button.

To connect an automated backend email service (such as Formspree, Resend, or EmailJS), create a `.env` file:
```env
VITE_CONTACT_ENDPOINT=https://formspree.io/f/your_form_id
```
