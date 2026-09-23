# Max Pharma - Web & Admin Portal

A modern, high-performance web application and administrative management suite for **Max Pharma Pvt. Ltd.**, one of Nepal's leading pharmaceutical importers and distributors. Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, this application delivers both a public-facing corporate website and an administrative dashboard.

---

## 📑 Table of Contents
- [Features & Capabilities](#-features--capabilities)
  - [Public Web Portal](#public-web-portal)
  - [Administrative Dashboard](#administrative-dashboard)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Environment Configuration](#-environment-configuration)
- [Getting Started](#-getting-started)
- [State Management Architecture](#-state-management-architecture)
- [SEO & Metadata Architecture](#-seo--metadata-architecture)
- [Available Scripts](#-available-scripts)
- [License](#-license)

---

## 🌟 Features & Capabilities

### Public Web Portal
- **Homepage (`/`)**: Dynamic hero banner slider, corporate statistics counter, featured pharmaceutical categories, company overview snippet, partner network, bottom promotional banners, and active announcement popups.
- **About Us (`/about`)**: Corporate journey (over 22 years of excellence), Chairperson's message, Mission & Vision statements, Core Values, and an interactive corporate Team Organization Chart.
- **Products Catalog (`/products`)**: Filterable medicine catalog organized by therapeutic category, live keyword search, detailed product specifications modal, and instant inquiry submission drawer.
- **Manufacturing & Quality (`/manufacturing`)**: Quality assurance guidelines, WHO-GMP compliant storage, and temperature-controlled cold-chain distribution standards.
- **Notices & Documents (`/notice`)**: Regulatory filings, tender notices, official circulars, and downloadable PDF documents.
- **Media Gallery (`/gallery`)**: High-resolution image albums, event coverage, and facility photos.
- **Contact Us (`/contact`)**: Public inquiry form, direct branch contact information, and Google Maps location integration.

### Administrative Dashboard
- **Authentication & Security**: Protected by `AuthGuard` with JWT authentication and secure session persistence.
- **Dashboard Analytics (`/admin/dashboard`)**: Real-time KPI summary (total products, pending inquiries, applications, and gallery media).
- **Product Management (`/admin/products`)**: Full CRUD operations for medicines, specifications table builder, category tagging, and multi-image uploads.
- **Corporate Content (`/admin/about`, `/admin/team`)**: Rich-text editors for leadership messages, vision/mission statements, and organizational hierarchy.
- **Lead & Inquiry Management (`/admin/inquiry-request`, `/admin/contact-list`)**: Customer inquiry inbox and contact form submissions.
- **Marketing & Media Tools (`/admin/popup`, `/admin/banner`, `/admin/gallery`)**: Control promotional modal popups, hero slides, and gallery collections.
- **System Settings (`/admin/settings`, `/admin/seo`)**: Corporate branding, logos, contact info, social links, and live search engine metadata management.

---

## 💻 Tech Stack

- **Framework**: [Next.js 15.3](https://nextjs.org/) (App Router, Server & Client Components)
- **Library**: [React 19](https://react.dev/) with [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & PostCSS
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & `react-redux`
- **Animations & Effects**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Rich Text Editing**: [Tiptap](https://tiptap.dev/) StarterKit
- **Form Management**: [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup) schema validation
- **Notifications**: [React-Toastify](https://fkhadra.github.io/react-toastify/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Org Chart**: `@dabeng/react-orgchart`

---

## 📂 Folder Structure

```
frontend/
├── Dockerfile                  # Container definition for frontend deployments
├── LICENSE                     # Project license
├── README.md                   # Complete frontend documentation
├── docker-compose.yml          # Container orchestration config
├── env.example                 # Environment variables reference template
├── eslint.config.mjs           # ESLint v9 configuration
├── next.config.ts              # Next.js build and image optimization settings
├── package.json                # Project dependencies and npm scripts
├── postcss.config.mjs          # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
├── public/                     # Static media assets, icons, and logos
└── src/
    ├── api/                    # Typed API client services
    │   ├── Inquiry.ts          # Customer product inquiries API
    │   ├── aboutUs.ts          # About Us & leadership API
    │   ├── admin.ts            # Admin auth and profile API
    │   ├── applications.ts     # Job applications API
    │   ├── contacts.ts         # Contact form API
    │   ├── dashboard.ts        # Metrics & analytics API
    │   ├── gallery.ts          # Image gallery API
    │   ├── generalSettings.ts  # Branding and site settings API
    │   ├── notice.ts           # Circulars and notice documents API
    │   ├── popup.ts            # Promotion popups API
    │   ├── product.ts          # Medicines and categories API
    │   ├── services.ts         # Distribution services API
    │   ├── team.ts             # Corporate team structure API
    │   ├── theme.ts            # Theme styling tokens API
    │   └── types.ts            # Shared API response interfaces
    ├── app/                    # Next.js App Router
    │   ├── (pages)/            # Public-facing web layout and route group
    │   │   ├── about/          # /about page
    │   │   ├── contact/        # /contact page
    │   │   ├── gallery/        # /gallery page
    │   │   ├── layout.tsx      # Public layout with Navbar & Footer
    │   │   ├── manufacturing/  # /manufacturing page
    │   │   ├── notice/         # /notice page
    │   │   └── products/       # /products page
    │   ├── admin/              # Administrative dashboard routes
    │   │   ├── about/          # /admin/about content management
    │   │   ├── banner/         # /admin/banner slide management
    │   │   ├── contact-list/   # /admin/contact-list submissions
    │   │   ├── dashboard/      # /admin/dashboard analytics overview
    │   │   ├── documents&notice/ # /admin/documents&notice manager
    │   │   ├── faqs/           # /admin/faqs management
    │   │   ├── gallery/        # /admin/gallery manager
    │   │   ├── inquiry-request/# /admin/inquiry-request leads
    │   │   ├── layout.tsx      # Admin shell layout with Sidebar & AuthGuard
    │   │   ├── page.tsx        # /admin login screen
    │   │   ├── popup/          # /admin/popup promotion editor
    │   │   ├── products/       # /admin/products catalog management
    │   │   ├── seo/            # /admin/seo meta tags editor
    │   │   ├── service/        # /admin/service manager
    │   │   ├── settings/       # /admin/settings branding config
    │   │   └── team/           # /admin/team organization builder
    │   ├── api/seo/            # Next.js server-side route for dynamic SEO data
    │   ├── client-layout.tsx   # Top-level client hydration wrapper
    │   ├── globals.css         # Tailwind CSS styling and theme custom properties
    │   ├── layout.tsx          # Root HTML layout with font injections
    │   ├── not-found.tsx       # Custom 404 page
    │   ├── page.tsx            # Main landing page (Homepage)
    │   ├── providers.tsx       # Redux, Toast, and Theme context providers
    │   ├── robots.ts           # Dynamic robots.txt generator
    │   └── sitemap.ts          # Dynamic sitemap.xml generator
    ├── assets/                 # SVGs and vector icons
    ├── components/             # Reusable UI component library
    │   ├── ActionButton.tsx    # Admin action button (Edit, Delete, View)
    │   ├── Banner.tsx          # Hero carousel slider
    │   ├── BannerNavigation.tsx# Carousel pagination dots & arrows
    │   ├── ConfirmationAlert.tsx # Modal dialog for destructive actions
    │   ├── CustomImage.tsx     # Enhanced Next.js Image with CDN fallback
    │   ├── CustomToast.tsx     # Notification alerts
    │   ├── DataTable.tsx       # Paginated, searchable admin data table
    │   ├── EmptyState.tsx      # Fallback UI for empty query lists
    │   ├── Footer.tsx          # Public website footer
    │   ├── Navbar.tsx          # Responsive navigation bar with mobile drawer
    │   ├── Overlay.tsx         # Backdrop blur modal overlay
    │   ├── Sidebar.tsx         # Collapsible admin sidebar
    │   ├── StatsGrid.tsx       # Corporate metrics counter grid
    │   ├── animation/          # Scroll-triggered entrance animations
    │   ├── auth/AuthGuard.tsx  # JWT authentication gate for admin routes
    │   ├── fields/             # Custom Formik input controls
    │   │   ├── Checkbox.tsx    # Formik checkbox input
    │   │   ├── CustomDate.tsx  # Datepicker input
    │   │   ├── Dropdown.tsx    # Select menu
    │   │   ├── Input.tsx       # Text & password input with validation
    │   │   ├── MultipleUpload.tsx # Multi-file upload dropzone
    │   │   ├── MyEditor.tsx    # Tiptap rich-text editor wrapper
    │   │   ├── Phone.tsx       # Internationalized phone input
    │   │   ├── SpecificationTable.tsx # Dynamic key-value spec table
    │   │   ├── TextArea.tsx    # Multi-line text field
    │   │   └── Upload.tsx      # Single file upload dropzone
    │   └── ui/                 # Atomic design tokens (Buttons, Toggles, Modals)
    ├── features/               # High-level domain feature sections
    │   ├── AboutUs.tsx         # Homepage About Us feature block
    │   ├── AdvertisementBanner.tsx # Dynamic popup modal banner
    │   ├── ApplyNow.tsx        # Career application modal drawer
    │   ├── BottomBanners.tsx   # Secondary promotional grid
    │   ├── Categories.tsx      # Featured category carousel
    │   ├── ContactUs.tsx       # Homepage contact section
    │   ├── Faqs.tsx            # Expandable accordion FAQs
    │   ├── GalleryCard.tsx     # Lightbox gallery item
    │   ├── Notices.tsx         # Announcement list component
    │   ├── Products.tsx        # Homepage featured products grid
    │   └── SendInquiry.tsx     # Instant product inquiry modal form
    ├── store/                  # Centralized Redux Toolkit state
    │   ├── actions.ts          # Action creators
    │   ├── constants.ts        # Redux action types
    │   ├── index.ts            # Configured Redux store
    │   ├── initialState.ts     # Global initial store state
    │   ├── reducer/            # Immutable reducer actions (set, append, etc.)
    │   └── selectors.ts        # Memoized state selectors
    ├── types/                  # Ambient TypeScript definitions
    └── utils/                  # Helper functions & HTTP fetch wrappers
        ├── data.ts             # Static fallback data & category lists
        ├── fetch.ts            # Server-side HTTP fetch helpers
        ├── helper.ts           # Currency, date, and string formatting
        ├── request.ts          # Axios client with interceptors & auth headers
        ├── seo.ts              # OpenGraph & schema.org JSON-LD generators
        ├── theme.ts            # Dynamic CSS variable injector
        └── validation.ts       # Yup validation schemas
```

---

## ⚙️ Prerequisites

- **Node.js**: v18.18 or higher (v20+ recommended)
- **Package Manager**: `npm` or `bun`
- Running instance of the **Max Pharma Backend API** (default: `http://localhost:9000`)

---

## 🔑 Environment Configuration

Create a `.env` (or `.env.local`) file in the `frontend/` directory:

```env
# Backend API Base URL
NEXT_PUBLIC_APP_BASE_URL=http://localhost:9000/api

# DigitalOcean Spaces Media CDN URL
NEXT_PUBLIC_BUCKET_URL=https://iservers.blr1.cdn.digitaloceanspaces.com

# Shared API Security Keys
API_KEY=hsdjhfjhehbdjrhjerhjkdhdjhfjkbrdhfjed
NEXT_PUBLIC_API_KEY=hsdjhfjhehbdjrhjerhjkdhdjhfjkbrdhfjed
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🔄 State Management Architecture

The application utilizes a lightweight, predictable state container using **Redux Toolkit**:
- **Generic Reducers (`src/store/reducer/`)**: Highly reusable reducer primitives (`set`, `append`, `prepend`, `update`, `remove`) that avoid repetitive boilerplate across different entity types.
- **Client Cache**: Reduces round-trips to the backend API by caching active navigation state, active themes, and general configuration settings.

---

## 🔍 SEO & Metadata Architecture

- **Dynamic Sitemap (`src/app/sitemap.ts`)**: Automatically indexes public pages (`/about`, `/products`, `/manufacturing`, `/notice`, `/gallery`, `/contact`).
- **Search Engine Directives (`src/app/robots.ts`)**: Grants search crawler permissions for public routes while strictly disallowing indexing of administrative surfaces (`/admin/*`).
- **Dynamic OpenGraph Tags**: Automatic meta tags generated from the `/admin/seo` configuration for enhanced social media sharing previews.

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `next dev` | Starts local Next.js development server on port `3000` |
| `npm run build` | `next build` | Compiles optimized production bundle |
| `npm run start` | `next start` | Runs production server |
| `npm run lint` | `next lint` | Executes ESLint validation |

---

## 📄 License
This project is proprietary and confidential. Licensed under the terms specified in the [`LICENSE`](file:///Users/santosh/Documents/maxpharma/frontend/LICENSE) file.