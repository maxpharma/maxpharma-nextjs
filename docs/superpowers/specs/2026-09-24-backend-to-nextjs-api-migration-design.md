# Backend-to-Next.js API Migration — Design Spec

Date: 2026-09-24

## Goal

Currently `frontend/` (Next.js 16 App Router) and `backend/` (Bun +
ElysiaJS + Express) are two separately-deployed repos in this monorepo.
Merge them into a single Next.js application: all backend REST endpoints
become Next.js Route Handlers (`src/app/api/**/route.ts`) inside
`frontend/`, backed by the same MySQL database via the same Sequelize
models/business logic. After migration, only one framework (Next.js)
and one deployable exists.

**Constraint from the user:** don't drop any feature that currently
exists in the backend — this is a framework port, not a feature cut.
Bun/Elysia/Express-specific *mechanisms* (the runtime, the HTTP
framework, the standalone static file server) are replaced by Next.js
equivalents; the *behavior* they provide (CORS, rate limiting, gzip,
auth, caching, uploads, migrations) must all still exist afterward.

## Current State Summary

**Backend** (`backend/src`, Bun + ElysiaJS on port 9000, Express bucket
server on port 9002):
- 13 domain modules under `src/modules/*`, each following the same
  5-file shape: `attributes.ts` (Sequelize `DataTypes` field map) →
  `model.ts` (`db.define(...)`, scopes/associations) → `repository.ts`
  (filter builders for list/find) → `service.ts` (validation via Joi,
  cache orchestration, calls repository+model) → `controller.ts` (thin:
  pulls query/params/body off the request, calls service, returns data
  or throws). `dashboard` module has only `service.ts`+`controller.ts`
  (aggregation, no own table).
- `src/routes/*.ts`: one file per module, each exporting an array of
  `{ method, path, controller, authorization?, authCheckType? }`.
  `src/routes/index.ts` concatenates all arrays and
  `routesInit(app)` registers each with Elysia, prefixing `api/`,
  wrapping the controller result in `{ data, message }`, and running
  `checkAuthentication(req, authCheckType)` via `beforeHandle` when
  `authorization: true`.
- `src/config/server.ts`: Elysia instance with a hand-rolled
  response formatter (JSON stringify + conditional gzip via
  `Bun.gzipSync`), a hand-rolled in-memory sliding-window rate limiter
  (500 req/60s per `ip-path` key, periodic cleanup), CORS
  (`@elysiajs/cors`, wide open `origin: "*"`, no credentials), Helmet
  (`elysia-helmet`), a `/health` and `/api/health` endpoint (checks
  `db.authenticate()`), and a global `onError` mapping specific error
  messages (`jwt expired`, `Unauthorized`, `Invalid API Key`) to
  status 401, everything else to 500, always returning
  `{ message, success:false, statusCode }`.
- `src/config/db.ts`: Sequelize/MySQL instance, pool `{max:5,min:1,
  acquire:15000,idle:5000}`, `timezone:"+05:45"`.
- `src/config/env.ts`: `dotenv`-based env loader with defaults.
- `src/config/cors.ts`, `src/config/helmet.ts`: option objects consumed
  by server.ts.
- `src/middleware/checkAuthentication.ts`: reads `Authorization` header,
  strips `Bearer `, verifies JWT (`verifyJwtToken`), enforces
  `allowTo` roles (currently only `"admin"`, looked up via
  `AdminService.find`), attaches `request.user`.
- `src/middleware/checkApiKey.ts`: compares `Api-Key` header to
  `env.API_KEY` — **defined but currently disabled** (commented out in
  `server.ts`'s `onBeforeHandle`). Keep as an available helper; leave
  disabled to match current behavior exactly.
- `src/utils/`: `cache.ts` (dependency-free in-memory TTL Map cache
  used by some services, e.g. settings/themes, to skip DB reads),
  `verifyJwtToken.ts` (jsonwebtoken verify wrapper), `helper.ts`
  (slugify/string helpers), `messages.ts` (`SUCCESS_MESSAGES`/
  `ERROR_MESSAGES` constants), `constants.ts` (status codes),
  `removeFile.ts` (deletes an old Spaces object on replace), `s3.ts`
  (`S3Client` + `uploadToSpaces`/`deleteFromSpaces` via
  `@aws-sdk/client-s3`, DigitalOcean Spaces endpoint), `uploadImage.ts`
  (base64 → Sharp → WebP conversion, HEIC/HEIF special-cased via
  `heic-convert`, then `uploadToSpaces`), `uploadFile.ts` (single-file
  variant used by `uploadImage`), `uploadMultipleFile.ts` (maps an
  array of `{base64,...}`/string entries through `uploadFile`, dedupes
  already-uploaded URLs/keys, replaces old files on update).
- `src/bucket.ts` + `src/config/bucket.ts`: standalone Express app,
  only serves `/uploads` as static files from local disk. Not the path
  real uploads take (those go straight to Spaces from the API
  process) — confirmed dead weight for current real usage. **Per user
  decision: drop entirely, do not port.**
- `src/migrations/`: `path.ts` is a hardcoded ordered list of
  per-module `migration.ts` files (each a plain `{up(queryInterface,
  Sequelize)}` module) plus `add_performance_indexes.ts`. `index.ts`
  is a runner script: for each path, `require()`s it and calls
  `.up(queryInterface, Sequelize)` sequentially, then closes the DB
  connection. Run via `bun run migrate`.
- `src/seeders/index.ts`: idempotent seeder script (default admin +
  baseline data), run via `bun run seed`.
- `maxpharma.sql`: full schema+data dump, alternate setup path — no
  change needed, still usable to seed the same MySQL DB.

**Frontend** (`frontend/src`, Next.js 16 App Router, already proven to
support Route Handlers via the existing `src/app/api/seo/route.ts`):
- `src/api/*.ts`: one file per domain (mirrors backend modules),
  each exporting CRUD functions that build a `ReturnType` config
  (`url`, `method`, `data`, `authorization`, `config.store/showErr/
  successMsg`) and call the shared `request()` helper.
- `src/utils/request.ts`: axios wrapper. Builds URL as
  `${NEXT_PUBLIC_APP_BASE_URL}/${url}`, sends `Content-Type`,
  `Accept`, `Api-Key: NEXT_PUBLIC_API_KEY`, and (for
  `authorization:true` requests under `/admin/*` pages)
  `Authorization: Bearer <token>` from local storage/helper. On
  success unwraps `resp.data.data` and optionally dispatches into
  Redux (`config.store`). On error reads `resp.data.message` /
  `resp.data.errors[0].message`, shows a toast, and on 401/`jwt
  expired`/`Unauthorized` clears the stored user and reloads if on an
  `/admin` page.
- `env.example`: `NEXT_PUBLIC_APP_BASE_URL=https://maxpharma.com.np/api`,
  `NEXT_PUBLIC_BUCKET_URL`, `API_KEY`.
- `next.config.ts`: `remotePatterns` already whitelist the Spaces CDN
  hostnames for `next/image` — no change needed there.

**Critical compatibility point:** because the response envelope
(`{data,message}` / `{message,success:false,statusCode}`), header
names (`Api-Key`, `Authorization: Bearer`), and route path segments
(`products`, `products/:id`, `admins/login`, ...) are preserved
exactly, **`frontend/src/api/*.ts` and `frontend/src/utils/request.ts`
need zero code changes** — only `NEXT_PUBLIC_APP_BASE_URL` changes (to
point at the same origin's `/api`, e.g. `/api` relative or
`https://maxpharma.com.np/api` unchanged if same domain).

## Target Structure

Everything lives in `frontend/` (becomes the only app). `backend/` is
retired after migration (see Cutover below).

```
frontend/src/server/                    # ported backend, framework-agnostic
  config/
    db.ts                               # Sequelize instance (unchanged logic)
    env.ts                              # env loader (unchanged logic, server-only vars)
  modules/
    aboutUs/  admins/  apply/  contacts/  dashboard/  galleries/
    generalSettings/  inquiries/  notices/  popup/  products/  services/  themes/
      attributes.ts | model.ts | repository.ts | service.ts | validationSchema.ts
      (each ported ~1:1, no Elysia/Express types remain — controller.ts
       logic moves into the route.ts handler, see below)
  middleware/
    requireAdmin.ts                     # was checkAuthentication.ts, now a plain
                                         # function called at the top of a route
                                         # handler instead of an Elysia beforeHandle
    requireApiKey.ts                    # was checkApiKey.ts, ported but left
                                         # unused/disabled to match current behavior
  utils/
    cache.ts  verifyJwtToken.ts  helper.ts  messages.ts  constants.ts
    removeFile.ts  s3.ts  uploadImage.ts  uploadFile.ts  uploadMultipleFile.ts
  lib/
    apiHandler.ts                       # shared wrapper: try/catch → envelope,
                                         # error-message → status mapping (ports
                                         # server.ts's onError switch), optional
                                         # auth/role check, optional rate limit
    rateLimit.ts                        # ports the sliding-window limiter
  migrations/
    path.ts  index.ts  add_performance_indexes.ts
    (module migration.ts files stay colocated in modules/*/migration.ts)
  seeders/
    index.ts

frontend/src/app/api/
  health/route.ts                       # GET  (public)
  about-us/route.ts                     # GET, POST
  about-us/[id]/route.ts                # GET, PATCH, DELETE
  admins/route.ts                       # GET
  admins/register/route.ts              # POST
  admins/login/route.ts                 # POST
  admins/logout/route.ts                # POST
  admins/change-password/route.ts       # PATCH
  admins/[id]/route.ts                  # GET
  apply/route.ts                        # GET, POST
  apply/[id]/route.ts                   # GET, PATCH, DELETE   (match existing paths)
  contact/route.ts ...
  dashboard/route.ts                    # GET
  gallery/route.ts ... 
  inquiry/route.ts ...
  notice/route.ts ...
  popup/route.ts ...
  product/route.ts, product/[id]/route.ts
  service/route.ts ...
  setting/route.ts ...
  theme/route.ts ...
  upload/route.ts                       # NEW: replaces the base64-in-body upload
                                         # path; same uploadImage/uploadMultipleFile
                                         # utils, no behavior change, just an entry
                                         # point since there's no more bucket.ts
```

Exact route path segments (`about-us` vs `aboutUs`, `product` vs
`products`, etc.) are copied verbatim from each `backend/src/routes/*.ts`
file — the implementation plan enumerates them per module so nothing
drifts from what `frontend/src/api/*.ts` already calls.

## How Each Piece Maps

| Concern | Backend today | Next.js after |
|---|---|---|
| Route registration | `routesInit` loop over route-array, Elysia `.get/.post/...` | One `route.ts` per resource path, exporting `GET`/`POST`/`PATCH`/`DELETE` functions (App Router convention) |
| Request parsing | Elysia gives `query`/`params`/`body` on the context object | `route.ts` reads `req.nextUrl.searchParams`, the dynamic segment from the 2nd handler arg (`{ params }`), and `await req.json()` |
| Response envelope | `routesInit` wraps controller result as `{data, message}` | `apiHandler()` wrapper does the same, so client code is unaffected |
| Error → status mapping | `server.onError` switch on `error.message` | Same switch, ported into `apiHandler()`'s catch block |
| Auth (JWT + role) | `checkAuthentication` via Elysia `beforeHandle` | `requireAdmin(req, allowTo)` called explicitly as the first line of a protected handler; throws same errors, caught by `apiHandler` |
| API key check | `checkApiKey`, currently disabled | Ported as `requireApiKey`, left uncalled (matches current disabled state) |
| CORS | `@elysiajs/cors` package | `next.config.ts` `headers()` (or `middleware.ts`) setting the same `Access-Control-Allow-*` values; `OPTIONS` preflight handled per route or centrally in middleware |
| Helmet security headers | `elysia-helmet` package | `next.config.ts` `headers()` with the equivalent header set (`X-Frame-Options`, `X-Content-Type-Options`, etc.) |
| Gzip compression | Hand-rolled `Bun.gzipSync` in response formatter | Dropped — the hosting platform (Vercel/Node behind a proxy) compresses responses automatically; note this explicitly as an intentional infra-level replacement, not a dropped feature |
| Rate limiting | Hand-rolled in-memory Map, 500req/60s per ip+path | Ported as-is into `lib/rateLimit.ts`, called from `apiHandler()` — same limitation (in-memory, per-instance) preserved; `ponytail:` comment notes upgrade path to Redis/Upstash if scaled to multiple instances |
| DB connectivity check | `/health`, `/api/health` in server.ts | `src/app/api/health/route.ts`, same `db.authenticate()` check |
| File upload | Base64 body → `uploadImage`/`uploadMultipleFile` → Spaces | Same utils called from `src/app/api/upload/route.ts` and directly from module services (`products`, `galleries`, etc.) exactly as today — upload utils are framework-agnostic, no change to their internals |
| Static `/uploads` serving | Express `bucket.ts` on port 9002 | Dropped per user decision (Spaces is the real storage; this was dead weight) |
| Migrations | `bun run src/migrations/index.ts` | `tsx src/server/migrations/index.ts`, wired as an npm script in `frontend/package.json`; runner logic (`require` each path, call `.up`) unchanged |
| Seeders | `bun run src/seeders/index.ts` | `tsx src/server/seeders/index.ts`, same script pattern |
| In-memory TTL cache | `utils/cache.ts`, Map-based | Ported unchanged; same per-instance caveat as rate limiter |
| Env vars | `dotenv` + `src/config/env.ts` | Next.js's built-in `.env` loading (no `dotenv` package needed — Next.js loads `.env`/`.env.local` itself); `src/server/config/env.ts` keeps the same shape/defaults, reads `process.env` directly, and stays **server-only** (never imported from client components) since it holds `DB_PASS`, `JWT_SECRET`, Spaces secret keys |

## Dependencies

**Added to `frontend/package.json`:**
`sequelize`, `mysql2`, `pg-hstore` (Sequelize peer, kept since backend
has it — harmless if unused by MySQL dialect, but matches current
lockfile; flag for removal only if confirmed unused), `bcryptjs`,
`jsonwebtoken` (+ `@types/jsonwebtoken`), `joi`, `sharp`,
`heic-convert` (+ `@types/heic-convert`), `@aws-sdk/client-s3`,
`node-cache` only if actually used (grep shows `utils/cache.ts` is
hand-rolled, not the `node-cache` package — confirm during
implementation whether `node-cache` npm package is actually imported
anywhere or just listed; drop if unused), `tsx` (dev dependency, for
running migration/seed scripts).

**Not ported (Bun/Elysia/Express-specific, no longer needed):**
`elysia`, `@elysiajs/cors`, `elysia-helmet`, `express`,
`@types/express`, `concurrently`, `fluent-ffmpeg` +
`@types/fluent-ffmpeg` (grep during implementation to confirm it's
actually unused dead weight in the current backend — if genuinely
unused, don't port; if used somewhere not yet seen, port it), `i`
(clearly a stray/accidental dependency, drop).

## Environment Variables

`frontend/.env.local` (or deployment env) gains the backend's server-only
vars, keeping the same names: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`,
`DB_PASS`, `JWT_SECRET`, `API_KEY`, `DIGITAL_SECRET_KEY`,
`DIGITAL_ACCESS_ID`, `DIGITAL_BUCKET_URL`, `DIGITAL_ENDPOINT`,
`DIGITAL_BUCKET_NAME`, `DIGITAL_BUCKET_FOLDER`. `PORT`/`BUCKET_PORT`
are dropped (Next.js has its own port config, no bucket server).
`NEXT_PUBLIC_APP_BASE_URL` is updated to point at the same origin's
`/api` (frontend and API now share one deployment); `NEXT_PUBLIC_API_KEY`
stays (still read by `request.ts`, still checked server-side only if
`requireApiKey` is ever re-enabled — currently it's not, matching
today).

## Testing / Verification Approach

- Each ported module's `service.ts` business logic is a straight port
  — verify by hitting each new route with the same request shape the
  corresponding `frontend/src/api/*.ts` file sends today (method, URL
  segment, body shape) and comparing the response envelope.
- Auth: verify `requireAdmin` rejects missing/invalid/expired tokens
  the same way (401, same error messages) and accepts a valid admin
  token the same way.
- Upload: verify a base64 image round-trips to a Spaces WebP key
  identically to today's behavior (including the HEIC path and the
  "already a URL/key, don't reprocess" short-circuit).
- Migrations: running `tsx src/server/migrations/index.ts` against a
  fresh MySQL DB produces the same schema as `maxpharma.sql`.
- Full smoke test: run the merged Next.js app against the existing
  frontend UI (admin panel CRUD screens + public pages) with zero
  changes to `src/api/*.ts`/`request.ts` beyond the base URL — this is
  the real acceptance test that nothing was dropped.

## Cutover / What Happens to `backend/`

Once all routes are ported and verified, `backend/` is removed from
the repo (or archived) and the root `README.md`/deployment configs
updated to reflect a single Next.js app. This spec does not cover
production deployment/infra changes (e.g. decommissioning the old
Bun/Express deployment) — that's an operational step after the code
migration is verified, and should be confirmed with the user
separately before deleting `backend/` or touching production.

## Vercel Deployment Compatibility

The app will be deployed to Vercel, which changes several assumptions
the current backend makes. Vercel Functions (what Next.js Route
Handlers become) are **stateless and multi-instance**: each invocation
may land on a different warm/cold instance, instances scale
horizontally under load and are recycled, and nothing written to
local disk or process memory is guaranteed to persist or be shared.
This section is the authoritative compatibility list — the
implementation plan must follow it, not the general table above where
the two conflict.

- **Runtime**: All routes use the default Node.js runtime (no
  `export const runtime = 'edge'`) — required for Sequelize, `sharp`,
  `heic-convert`, `bcryptjs`, and `@aws-sdk/client-s3`, none of which
  are Edge-compatible, and Next.js 16.3+ no longer supports Edge at
  all. No route needs to opt out of the default.

- **Database connections (user decision: add a connection pooler)**.
  Sequelize's current pool (`max:5, min:1`) is sized for one long-lived
  process; on Vercel, many concurrent function instances each holding
  their own pool can exceed MySQL's `max_connections`. Since the data
  layer stays MySQL + Sequelize (no ORM/DB swap), there's no Vercel
  Marketplace serverless option for MySQL the way Neon covers Postgres
  — Vercel Storage marketplace is Postgres/Redis/Mongo-first. Two
  concrete options, to be settled with the user during implementation
  (this is an infra provisioning choice, not a code question):
  - **PlanetScale** — MySQL-compatible, built for exactly this
    (serverless connection handling via its proxy); would mean
    swapping the connection string/host only, Sequelize's MySQL
    dialect keeps working unchanged.
  - **Keep the existing MySQL server, put a pooling proxy in front**
    (ProxySQL, or the cloud provider's managed proxy if on
    RDS/DigitalOcean Managed MySQL) — no data migration, just a new
    connection endpoint.
  Either way, `src/server/config/db.ts` is additionally hardened for
  serverless: pool `max` lowered to 1–2 *per instance* (the pooler/
  proxy absorbs the fan-out, not Sequelize itself), and `db.ts`'s
  Sequelize instance is created lazily (module-scope lazy singleton,
  not instantiated at import time) so a missing `DB_*` env var at
  build time doesn't crash `next build` — same pattern needed for any
  server-only client, ported to `src/server/utils/s3.ts`'s `S3Client`
  too.

- **Rate limiter & in-memory cache (user decision: port as-is)**.
  `utils/cache.ts` and the sliding-window rate limiter in
  `config/server.ts` both use a plain in-process `Map`. Ported
  unchanged into `lib/rateLimit.ts` / `server/utils/cache.ts` — each
  warm Vercel instance enforces its own window and keeps its own
  cache, so under multi-instance scaling the *effective* rate limit is
  higher than 500/60s and cache hit rate is lower than today, but
  correctness never breaks (worst case: more DB reads, or a generous
  limit). `# ponytail:` comment on both files noting Upstash Redis
  (`@upstash/redis` + `@upstash/ratelimit`, Vercel Marketplace) as the
  upgrade path if/when precise cross-instance limits or shared cache
  are needed.

- **File uploads — request size**: Vercel Functions cap request/response
  bodies at **4.5 MB**. The current base64-JSON upload flow
  (`uploadImage`/`uploadMultipleFile`, called from `products`,
  `galleries`, etc. services) sends the full file as base64 in the
  JSON body, which inflates size ~33% — a photo already close to 3 MB
  raw can blow the cap where it wouldn't have on the old Bun server
  (`maxRequestBodySize: 32MB`). This is a real behavior gap, called
  out explicitly for the plan: keep the base64 flow exactly as-is
  (simplest, matches "don't drop features," fine for the app's actual
  image sizes after Sharp/WebP compression on the way in — but the
  compression happens server-side *after* the oversized upload would
  already be rejected), and document the 4.5 MB ceiling in the admin
  upload UI copy / add client-side file-size validation before
  submit. Do not silently raise limits Vercel doesn't allow.

- **No local static file serving**: confirms the earlier decision to
  drop `bucket.ts`'s Express static server — Vercel's filesystem is
  ephemeral per-invocation and was never a valid target for this
  regardless of the merge, so this isn't a new loss, just a better
  reason for the same call.

- **Migrations/seeders don't run as part of the deployed app**: `tsx
  src/server/migrations/index.ts` / `seeders/index.ts` are run
  locally or in CI against the target MySQL/PlanetScale instance
  before/after deploy — never as a Vercel Function (they're long-lived
  scripts, not request handlers, and Vercel doesn't run arbitrary
  scripts at deploy time beyond the build command).

- **Env vars**: all backend secrets (`DB_*`, `JWT_SECRET`, `API_KEY`,
  `DIGITAL_*`) are set as Vercel Project Environment Variables
  (Production/Preview/Development), never committed; `vercel env pull
  .env.local` is the local-dev sync path. `NEXT_PUBLIC_*` vars are the
  only ones exposed to the browser bundle — confirmed none of the
  server secrets use that prefix already.

- **Health check**: `src/app/api/health/route.ts` stays as a normal
  route (not a Vercel Cron) since it's for manual/monitoring checks,
  not scheduled work — no `vercel.json` crons entry needed for it.

## Explicitly Out of Scope

- No database schema changes.
- No change to the Spaces/S3 bucket, credentials, or file layout.
- No change to `frontend/src/api/*.ts`, `utils/request.ts`, Redux
  store, or any UI component — this is a backend-only port.
- No new features, no framework swap for the DB layer (Sequelize
  stays), no auth mechanism change (JWT stays).
- No production deployment/infra work (covered above).
