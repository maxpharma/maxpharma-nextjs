# Max Pharma - Backend API Services

A high-performance, modular backend engine powering the **Max Pharma** pharmaceutical web and administrative platforms. Built with the **Bun** runtime, **ElysiaJS**, and **Sequelize ORM**, the system features dual-service architecture (Fast REST API + Dedicated Media Storage Microservice), intelligent in-memory caching, database indexing, and DigitalOcean Spaces integration.

---

## 📑 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#-environment-variables)
- [Database Setup & Migrations](#-database-setup--migrations)
- [Running the Application](#-running-the-application)
- [API Modules & Endpoints](#-api-modules--endpoints)
- [Storage & Media Handling](#-storage--media-handling)
- [Security & Performance Optimizations](#-security--performance-optimizations)
- [Scripts Reference](#-scripts-reference)
- [License](#-license)

---

## 🏛 Architecture Overview

The backend uses a decoupled, dual-microservice design:
1. **Core REST API (`src/index.ts`)**: Built with **ElysiaJS** on Bun, handling authentication, business logic, transactions, validation, and database operations on port `9000`.
2. **Bucket & Media Service (`src/bucket.ts`)**: Express-based file processing server on port `9002` that handles multipart file uploads, image transcoding/compression (via Sharp & FFmpeg), and seamless synchronization with **DigitalOcean Spaces (S3-compatible)** object storage.

---

## 💻 Tech Stack

- **Runtime**: [Bun](https://bun.sh/) (ultra-fast JavaScript/TypeScript runtime)
- **Web Framework**: [ElysiaJS](https://elysiajs.com/) (high-performance web framework for Bun)
- **Media Server**: Express.js
- **Database & ORM**: MySQL 8.0+ with [Sequelize v6](https://sequelize.org/) & `mysql2` driver
- **Cloud Storage**: [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) via `@aws-sdk/client-s3`
- **Authentication**: JWT (JSON Web Tokens) & `bcryptjs` password hashing
- **Data Validation**: Joi
- **Performance & Caching**: Node-Cache (TTL-based in-memory caching), Response Compression, Database Indexing
- **Security**: Elysia Helmet, CORS policies, Rate Limiting

---

## 📂 Folder Structure

```
backend/
├── Dockerfile                  # Container definition for containerized deployment
├── LICENSE                     # Project license
├── README.md                   # Complete backend documentation
├── bun.lock                    # Bun dependency lockfile
├── docker-compose.yml          # Local orchestration config for services & MySQL
├── entrypoint.sh               # Container startup script
├── env.example                 # Example environment variables template
├── index.ts                    # Entrypoint wrapper
├── maxpharma.sql               # Complete MySQL database export schema & initial data
├── package.json                # Project dependencies and script runner
├── tsconfig.json               # TypeScript compiler configuration
└── src/
    ├── bucket.ts               # Express media bucket server entrypoint (Port 9002)
    ├── constant.ts             # Global application constants
    ├── index.ts                # Main Elysia API server entrypoint (Port 9000)
    ├── config/                 # Core server & infrastructure configs
    │   ├── bucket.ts           # Bucket upload routes and multipart parser
    │   ├── cors.ts             # Cross-Origin Resource Sharing rules
    │   ├── db.ts               # Sequelize instance & MySQL connection pooling
    │   ├── env.ts              # Strongly-typed environment variables loader
    │   ├── helmet.ts           # Security headers configuration
    │   └── server.ts           # Elysia app initialization & global middlewares
    ├── middleware/             # Request interceptors & guards
    │   ├── checkApiKey.ts      # API Key authentication guard
    │   └── checkAuthentication.ts # Admin JWT verification guard
    ├── migrations/             # Database schema migrations
    │   ├── add_performance_indexes.ts # Compound performance indexes
    │   ├── index.ts            # Migration executor runner
    │   └── path.ts             # Sequence and registry of active migration files
    ├── modules/                # Feature-driven domain modules
    │   ├── aboutUs/            # Company history, vision, mission, and leadership
    │   ├── admins/             # Admin accounts, auth, login, tokens, password resets
    │   ├── apply/              # Career & recruitment job applications
    │   ├── contacts/           # Contact queries & customer communication
    │   ├── dashboard/          # Metric counters & admin dashboard analytics
    │   ├── galleries/          # Media albums, photo collections, and banners
    │   ├── generalSettings/    # Company contact, branding, social links & metadata
    │   ├── inquiries/          # Product customer inquiries & quote requests
    │   ├── notices/            # Public documents, press releases, circulars
    │   ├── popup/              # Modal promotion popups & announcements
    │   ├── products/           # Medicine catalog, categories, dosage & specs
    │   ├── services/           # Pharmaceutical distribution & support services
    │   └── themes/             # Dynamic website colors, layouts, and style tokens
    │       # Each module contains:
    │       ├── attributes.ts   # Database field definitions
    │       ├── controller.ts   # HTTP request handlers & input mapping
    │       ├── migration.ts    # Module table schema migration
    │       ├── model.ts        # Sequelize Model class
    │       ├── repository.ts   # Data access queries & filters
    │       ├── service.ts      # Core business logic & cache orchestration
    │       └── validationSchema.ts # Joi request validation schemas
    ├── routes/                 # Routing endpoints declaration
    │   ├── aboutUs.ts          # /api/about-us endpoints
    │   ├── admin.ts            # /api/admin & auth endpoints
    │   ├── apply.ts            # /api/apply endpoints
    │   ├── contact.ts          # /api/contact endpoints
    │   ├── dashboard.ts        # /api/dashboard statistics
    │   ├── gallery.ts          # /api/gallery endpoints
    │   ├── index.ts            # Master route aggregator
    │   ├── inquiry.ts          # /api/inquiry endpoints
    │   ├── notice.ts           # /api/notice endpoints
    │   ├── popup.ts            # /api/popup endpoints
    │   ├── product.ts          # /api/product endpoints
    │   ├── service.ts          # /api/service endpoints
    │   ├── setting.ts          # /api/setting endpoints
    │   └── theme.ts            # /api/theme endpoints
    ├── seeders/                # Idempotent database seeders
    │   └── index.ts            # Default admin account & baseline data seeder
    └── utils/                  # Shared utility functions
        ├── cache.ts            # Centralized Node-Cache manager (get, set, del)
        ├── constants.ts        # Response status codes & messages
        ├── helper.ts           # String manipulation, slugification & hashing
        ├── messages.ts         # Standardized error/success message templates
        ├── removeFile.ts       # Storage file cleanup & deletion
        ├── s3.ts               # AWS/DigitalOcean Spaces S3 client initialization
        ├── spacesUpload.ts     # S3 buffer upload stream handler
        ├── uploadFile.ts       # Single-file upload processor
        ├── uploadImage.ts      # Image processing, WebP conversion & resizing
        ├── uploadMultipleFile.ts # Batch upload processor
        └── verifyJwtToken.ts   # JWT signer & token decoder
```

---

## ⚙️ Prerequisites

- **Bun**: v1.1.0 or higher (`curl -fsSL https://bun.sh/install | bash`)
- **MySQL**: 8.0+ (or MariaDB 10.5+)
- **DigitalOcean Spaces** (or S3-compatible storage) credentials for media assets

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Network Ports
PORT=9000
BUCKET_PORT=9002

# Database Connection (MySQL)
DB_HOST=127.0.0.1
DB_PORT=3307
DB_NAME=maxpharma
DB_USER=root
DB_PASS=password

# Security & Secrets
API_KEY=your_secure_api_key_here
JWT_SECRET=your_jwt_signing_secret_here
RESPONSE_SECRET=your_response_encryption_secret_here
MODE=development

# DigitalOcean Spaces Storage
DIGITAL_SECRET_KEY="your_digitalocean_spaces_secret_key"
DIGITAL_ACCESS_ID="your_digitalocean_spaces_access_key_id"
DIGITAL_BUCKET_URL="https://iservers.blr1.cdn.digitaloceanspaces.com"
DIGITAL_ENDPOINT="https://blr1.digitaloceanspaces.com"
DIGITAL_BUCKET_NAME="iservers"
DIGITAL_BUCKET_FOLDER="maxpharma"
```

---

## 🗄 Database Setup & Migrations

### Option 1: Restore from SQL Dump (Recommended for instant setup)
A complete, structured database dump including baseline records is included in [`maxpharma.sql`](file:///Users/santosh/Documents/maxpharma/backend/maxpharma.sql):

```bash
# Import the dump into your MySQL instance
mysql -h 127.0.0.1 -P 3307 -u root -p maxpharma < maxpharma.sql
```

### Option 2: Run Sequelize Migrations
To execute programmatic migrations and create all tables:

```bash
# Run all table and indexing migrations
bun run migrate

# Run initial administrative seeders
bun run seed
```

---

## 🚀 Running the Application

### Development Mode
Runs both the API server (Port 9000) and the Bucket service (Port 9002) with live hot-reloading:

```bash
bun run dev
```

### Production Build & Run
Compile TypeScript to optimized JS bundles and launch:

```bash
# Build bundles to dist/
bun run build

# Start production server
bun run start
```

### Health Check
Verify the API and database connectivity:
```bash
curl http://localhost:9000/health
# Returns: {"status":"ok","uptime":120,"timestamp":"...","database":"connected"}
```

---

## 🔌 API Modules & Endpoints

All REST routes are prefixed with `/api` and protected by API Key checks.

| Module | Route Prefix | Description | Auth Required |
|---|---|---|---|
| **Health** | `GET /health` | Service uptime and database connectivity | No |
| **Authentication** | `/api/admin/login` | Admin login and token issuing | No |
| **Admins** | `/api/admin` | Admin account creation & management | Bearer Token |
| **Products** | `/api/product` | Catalog items, dosages, search & categories | Public / Admin (CRUD) |
| **Inquiries** | `/api/inquiry` | Customer product inquiries | Public (POST) / Admin (GET) |
| **Job Applications** | `/api/apply` | Resumes and applicant submissions | Public (POST) / Admin (GET) |
| **Contact** | `/api/contact` | Public contact submissions & inquiries | Public (POST) / Admin (GET) |
| **About Us** | `/api/about-us` | Corporate history, mission, leadership | Public / Admin (CRUD) |
| **Notices** | `/api/notice` | Official announcements and documents | Public / Admin (CRUD) |
| **Gallery** | `/api/gallery` | Image albums and banners | Public / Admin (CRUD) |
| **Popups** | `/api/popup` | Marketing and informational modals | Public / Admin (CRUD) |
| **Settings** | `/api/setting` | Contact info, social links, SEO tags | Public / Admin (CRUD) |
| **Theme** | `/api/theme` | Primary/secondary colors & layout tokens | Public / Admin (CRUD) |
| **Dashboard** | `/api/dashboard` | Aggregated counter metrics & analytics | Bearer Token |

---

## ☁️ Storage & Media Handling

- Image and document uploads are routed through **Port 9002** (`src/bucket.ts`).
- Files are parsed, resized/optimized (WebP compression), and uploaded to **DigitalOcean Spaces**.
- Preserves CDN-backed URLs under `DIGITAL_BUCKET_URL`.
- Built-in deduplication prevents redundant uploads when existing URLs are submitted.

---

## ⚡ Security & Performance Optimizations

1. **Connection Pooling**: Sequelize is configured with optimized connection pool thresholds (`max: 20`, `min: 2`, `idle: 10000ms`, `acquire: 30000ms`).
2. **Compound Indexes**: Dedicated indexes on frequently queried combinations (e.g. `(type, createdAt)` on products and notices) for sub-millisecond lookups.
3. **Response Caching**: `Node-Cache` caching layer for high-read, low-write endpoints (settings, themes, about-us, categories). Automatic cache busting on updates.
4. **Compression & Rate Limiting**: Gzip response compression and burst rate-limiting protection.
5. **Helmet & Strict CORS**: Cross-origin protections against clickjacking, sniffing, and unauthorized domains.

---

## 📜 Scripts Reference

| Script | Command | Description |
|---|---|---|
| `bun run dev` | `concurrently "bun run --watch src/index.ts" "bun run --watch src/bucket.ts"` | Starts dev servers with watch mode |
| `bun run build` | `bun build src/index.ts src/bucket.ts --outdir=dist ...` | Bundles app into `dist/` |
| `bun run start` | `concurrently "bun run dist/index.js" "bun run dist/bucket.js"` | Runs compiled production bundles |
| `bun run migrate` | `bun run src/migrations/index.ts` | Executes database migrations |
| `bun run seed` | `bun run src/seeders/index.ts` | Seeds admin credentials and defaults |
| `bun run lint` | `eslint src/**/*.ts --fix` | Runs code quality and lint checks |

---

## 📄 License
This project is proprietary and confidential. Licensed under the terms specified in the [`LICENSE`](file:///Users/santosh/Documents/maxpharma/backend/LICENSE) file.