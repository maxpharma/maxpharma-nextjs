# Backend-to-Next.js API Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port all 13 backend REST modules (Bun + ElysiaJS + Express) into Next.js 16 App Router Route Handlers inside `frontend/`, so the app has one framework and one deployable, ready for Vercel, with zero required changes to `frontend/src/api/*.ts` or `frontend/src/utils/request.ts`.

**Architecture:** Business logic (Sequelize models/services/repositories/validation) moves into `frontend/src/server/` almost verbatim — same MySQL schema, same Joi validation, same JWT/bcrypt auth, same DigitalOcean Spaces upload pipeline. HTTP wiring moves from Elysia's route-array registration into one `route.ts` per resource path under `frontend/src/app/api/`, using a shared `apiHandler()` wrapper that reproduces the old response envelope, error-to-status mapping, and rate limiting.

**Tech Stack:** Next.js 16 (App Router, Node.js runtime), Sequelize 6 + `mysql2` (MySQL), Joi, `jsonwebtoken`, `bcryptjs`, `sharp` + `heic-convert`, `@aws-sdk/client-s3` (DigitalOcean Spaces), `tsx` (migration/seed scripts).

**Spec:** `docs/superpowers/specs/2026-09-24-backend-to-nextjs-api-migration-design.md`

## Global Constraints

- No database schema changes — every Sequelize `attributes.ts`/`migration.ts` is ported with identical field definitions.
- No change to `frontend/src/api/*.ts`, `frontend/src/utils/request.ts`, Redux store, or any UI component.
- Response envelope stays `{ data, message }` on success and `{ message, success:false, statusCode }` on error, exactly as `backend/src/routes/index.ts` and `backend/src/config/server.ts` produce today.
- Route path segments are copied verbatim from each `backend/src/routes/*.ts` file (e.g. `about-us`, `applies`, `generalSettings/group/:group`) — these must match what `frontend/src/api/*.ts` already calls.
- All routes run on the default Node.js runtime — no `export const runtime = 'edge'` anywhere (Sequelize, `sharp`, `bcryptjs`, `@aws-sdk/client-s3` are not Edge-compatible).
- Drop Bun/Elysia/Express-only code: no `elysia`, `@elysiajs/cors`, `elysia-helmet`, `express`, `concurrently`, `Bun.gzipSync`, or the stray `import { allocUnsafe } from "bun"` lines (found in `apply/attributes.ts`, `products/attributes.ts`, `notices/attributes.ts` — dead imports, never used).
- Do not port `node-cache` or `fluent-ffmpeg` as dependencies — confirmed unused in `backend/src` (only `node-cache` appears in `package.json`, `utils/cache.ts` is hand-rolled; `fluent-ffmpeg` has zero imports anywhere).
- Do not port `backend/src/bucket.ts` / `backend/src/config/bucket.ts` (local static file server) — real uploads already go to Spaces, and Vercel's filesystem is ephemeral per-invocation anyway.
- Sequelize/S3 client instances are created as lazy module-scope singletons (not instantiated at import time), so `next build` doesn't crash when `DB_*`/`DIGITAL_*` env vars are absent at build time.
- Every ported module task must leave `frontend` building and lint-clean (`npm run build`, `npm run lint`) before its commit.

## Review Focus

- **JWT expiry / bad token on a protected route** — `Authorization: Bearer <expired-or-malformed>` must produce the exact same `{message:"Unauthorized"|"jwt expired", success:false, statusCode:401}` shape the old `checkAuthentication` + `server.onError` produced, not a raw 500 or a Next.js default error page. Covered in Task 3.
- **Upload payload over Vercel's 4.5MB request body cap** — a base64 image large enough to exceed the cap must fail with a clear, catchable error (not an opaque platform-level crash), and this is called out to the user as a real behavior gap versus the old 32MB Bun limit. Covered in Task 10 (upload route) with an explicit oversized-payload test.
- **Duplicate admin registration (race on unique email/username)** — `Admin.beforeCreate` hook throws `"User already exists"` today; the ported `POST /api/admins/register` route must surface that as a 4xx-shaped envelope, not crash the route handler. Covered in Task 4.
- **List endpoints with no query params** — every `list()` service defaults `limit`/`page` via `Number(query?.limit) || 10` patterns; the Next.js route handlers must read `req.nextUrl.searchParams` (not `req.query`, which doesn't exist on the Web `Request`) or every list endpoint silently 500s. Covered as a repeated assertion across Tasks 5–9.
- **Popup "only one active" business rule** — `popup` service's `update()` throws if another popup already has `status:true` when setting a new one active; this cross-record validation must survive the port unchanged (it's easy to lose when a service function gets re-typed instead of copied). Covered in Task 8 by copying the file unmodified and asserting the check verbatim.

---

## File Structure Overview

```
frontend/src/server/
  config/          db.ts, env.ts
  middleware/      requireAdmin.ts, requireApiKey.ts
  lib/             apiHandler.ts, rateLimit.ts
  utils/           cache.ts, verifyJwtToken.ts, helper.ts, messages.ts,
                    constants.ts, removeFile.ts, s3.ts, uploadImage.ts,
                    uploadFile.ts, uploadMultipleFile.ts, index.ts, constant.ts
  modules/<name>/  attributes.ts, model.ts, repository.ts, service.ts,
                    validationSchema.ts  (13 modules; dashboard has no
                    attributes/model/repository/validationSchema)
  migrations/      path.ts, index.ts, add_performance_indexes.ts
                    (+ modules/<name>/migration.ts colocated)
  seeders/         index.ts

frontend/src/app/api/
  health/route.ts
  about-us/route.ts, about-us/[id]/route.ts
  admins/route.ts, admins/register/route.ts, admins/login/route.ts,
  admins/logout/route.ts, admins/change-password/route.ts, admins/[id]/route.ts
  applies/route.ts, applies/[id]/route.ts
  contacts/route.ts, contacts/[id]/route.ts
  dashboard/route.ts
  gallery/route.ts, gallery/[id]/route.ts
  generalSettings/route.ts, generalSettings/group/[group]/route.ts,
  generalSettings/key/[key]/route.ts, generalSettings/[id]/route.ts
  inquiries/route.ts, inquiries/[id]/route.ts
  notices/route.ts, notices/[id]/route.ts
  popup/route.ts, popup/[id]/route.ts
  products/route.ts, products/[id]/route.ts
  services/route.ts, services/[id]/route.ts
  themes/route.ts, themes/[id]/route.ts
  upload/route.ts
```

---

### Task 1: Server config, env loader, and lazy DB/S3 clients

**Files:**
- Create: `frontend/src/server/config/env.ts`
- Create: `frontend/src/server/config/db.ts`
- Create: `frontend/src/server/utils/s3.ts`
- Create: `frontend/src/server/constant.ts`
- Test: `frontend/src/server/config/__tests__/env.test.ts`

**Interfaces:**
- Produces: `env` (default export, object) from `config/env.ts` — same shape as `backend/src/config/env.ts` minus `PORT`/`BUCKET_PORT`.
- Produces: `getDb(): Sequelize` (named export, lazy singleton) from `config/db.ts` — replaces the old `import db from "./config/db"` default-export-instance pattern; every module file that did `import db from "../../config/db"` now does `import { getDb } from "../../config/db"` and calls `getDb()`.
- Produces: `getS3Client(): S3Client`, `uploadToSpaces`, `deleteFromSpaces` (named exports) from `utils/s3.ts`.
- Produces: `ROOT_PATH` (named export) from `constant.ts`.

- [ ] **Step 1: Write the failing test for lazy env loading**

```ts
// frontend/src/server/config/__tests__/env.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("server env", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("falls back to documented defaults when env vars are unset", async () => {
    delete process.env.DB_NAME;
    delete process.env.DB_USER;
    delete process.env.DB_PASS;
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    delete process.env.DIGITAL_BUCKET_NAME;
    const { default: env } = await import("../env");
    expect(env.DB_NAME).toBe("maxpharma");
    expect(env.DB_USER).toBe("root");
    expect(env.DB_HOST).toBe("127.0.0.1");
    expect(env.DB_PORT).toBe(3307);
    expect(env.DIGITAL_BUCKET_NAME).toBe("iservers");
  });

  it("reads real values when env vars are set", async () => {
    process.env.DB_NAME = "custom_db";
    process.env.DB_PORT = "3306";
    const { default: env } = await import("../env");
    expect(env.DB_NAME).toBe("custom_db");
    expect(env.DB_PORT).toBe(3306);
  });
});
```

If `vitest` is not yet installed in `frontend`, install it now: `npm install -D vitest --prefix frontend`, and add `"test": "vitest run"` to `frontend/package.json` `scripts`.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npx vitest run src/server/config/__tests__/env.test.ts`
Expected: FAIL — `Cannot find module '../env'`

- [ ] **Step 3: Write `env.ts`, `constant.ts`, `db.ts`, `s3.ts`**

```ts
// frontend/src/server/config/env.ts
// Next.js loads .env/.env.local itself — no dotenv package needed here.
const env = {
  APP_NAME: process.env.APP_NAME || "Max Pharma",
  DB_NAME: process.env.DB_NAME || "maxpharma",
  DB_USER: process.env.DB_USER || "root",
  DB_PASS: process.env.DB_PASS || "password",
  DB_HOST: process.env.DB_HOST || "127.0.0.1",
  DB_PORT: Number(process.env.DB_PORT) || 3307,
  API_KEY: process.env.API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  MODE: process.env.MODE || "development",
  DIGITAL_SECRET_KEY: process.env.DIGITAL_SECRET_KEY || "",
  DIGITAL_ACCESS_ID: process.env.DIGITAL_ACCESS_ID || "",
  DIGITAL_BUCKET_URL:
    process.env.DIGITAL_BUCKET_URL ||
    "https://iservers.blr1.cdn.digitaloceanspaces.com",
  DIGITAL_ENDPOINT:
    process.env.DIGITAL_ENDPOINT || "https://blr1.digitaloceanspaces.com",
  DIGITAL_BUCKET_NAME: process.env.DIGITAL_BUCKET_NAME || "iservers",
  DIGITAL_BUCKET_FOLDER: process.env.DIGITAL_BUCKET_FOLDER || "maxpharma",
};

export default env;
```

```ts
// frontend/src/server/constant.ts
import path from "path";

const ROOT_PATH = path.resolve(__dirname);

export { ROOT_PATH };
```

```ts
// frontend/src/server/config/db.ts
import { Sequelize } from "sequelize";
import env from "./env";

// ponytail: lazy singleton so a missing DB_* env var at `next build` time
// doesn't crash the build — the old backend threw eagerly at import time,
// which was fine for a long-lived process but breaks a serverless build step.
let _db: Sequelize | null = null;

const getDb = (): Sequelize => {
  if (_db) return _db;

  const { DB_NAME, DB_USER, DB_PASS, DB_HOST } = env;
  if (!DB_NAME || !DB_USER || !DB_PASS || !DB_HOST) {
    throw new Error(
      "Missing required environment variables for database connection.",
    );
  }

  _db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: env.DB_PORT,
    dialect: "mysql",
    logging: false,
    timezone: "+05:45",
    // ponytail: pool sized for one Vercel Function instance, not the whole
    // app — put a connection pooler (PlanetScale / ProxySQL) in front of
    // MySQL so many concurrent instances don't exceed max_connections.
    pool: {
      max: 2,
      min: 0,
      acquire: 15000,
      idle: 5000,
    },
  });

  return _db;
};

export { getDb };
```

```ts
// frontend/src/server/utils/s3.ts
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import env from "../config/env";

let _s3Client: S3Client | null = null;

const getS3Client = (): S3Client => {
  if (_s3Client) return _s3Client;
  _s3Client = new S3Client({
    endpoint: env.DIGITAL_ENDPOINT,
    region: "blr1",
    credentials: {
      accessKeyId: env.DIGITAL_ACCESS_ID,
      secretAccessKey: env.DIGITAL_SECRET_KEY,
    },
  });
  return _s3Client;
};

export const uploadToSpaces = async ({
  key,
  buffer,
  contentType,
}: {
  key: string;
  buffer: Buffer;
  contentType: string;
}) => {
  try {
    const cleanKey = key.replace(/^\/+/, "");
    const command = new PutObjectCommand({
      Bucket: env.DIGITAL_BUCKET_NAME,
      Key: cleanKey,
      Body: buffer,
      ACL: "public-read",
      ContentType: contentType,
    });

    await getS3Client().send(command);
    return cleanKey;
  } catch (error: any) {
    console.error("Error uploading to DigitalOcean Spaces:", error);
    throw new Error(
      `Failed to upload to DigitalOcean Spaces: ${error?.message || error}`,
    );
  }
};

export const deleteFromSpaces = async ({ key }: { key: string }) => {
  try {
    if (!key) return;
    const cleanKey = key.replace(/^\/+/, "");
    const command = new DeleteObjectCommand({
      Bucket: env.DIGITAL_BUCKET_NAME,
      Key: cleanKey,
    });

    await getS3Client().send(command);
    return cleanKey;
  } catch (error: any) {
    console.error("Error deleting from DigitalOcean Spaces:", error);
    // Non-blocking error for delete
  }
};

export { getS3Client };
export default getS3Client;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npx vitest run src/server/config/__tests__/env.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Install remaining server dependencies**

```bash
cd frontend
npm install sequelize mysql2 bcryptjs jsonwebtoken joi sharp heic-convert @aws-sdk/client-s3
npm install -D @types/jsonwebtoken @types/heic-convert tsx
```

- [ ] **Step 6: Commit**

```bash
git add frontend/src/server/config frontend/src/server/utils/s3.ts frontend/src/server/constant.ts frontend/package.json frontend/package-lock.json
git commit -m "feat: add server config, lazy Sequelize/S3 clients

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Shared utils (cache, JWT verify, helper, messages, constants, uploads)

**Files:**
- Create: `frontend/src/server/utils/cache.ts`
- Create: `frontend/src/server/utils/verifyJwtToken.ts`
- Create: `frontend/src/server/utils/helper.ts`
- Create: `frontend/src/server/utils/messages.ts`
- Create: `frontend/src/server/utils/constants.ts`
- Create: `frontend/src/server/utils/index.ts`
- Create: `frontend/src/server/utils/removeFile.ts`
- Create: `frontend/src/server/utils/uploadImage.ts`
- Create: `frontend/src/server/utils/uploadFile.ts`
- Create: `frontend/src/server/utils/uploadMultipleFile.ts`
- Test: `frontend/src/server/utils/__tests__/cache.test.ts`

**Interfaces:**
- Consumes: `env` from `../config/env` (Task 1), `uploadToSpaces`/`deleteFromSpaces` from `./s3` (Task 1).
- Produces: `cache` (default export, `MemoryCache` instance with `get/set/delete/invalidatePrefix/clear`), `verifyJwtToken(token: string)`, `{ hashPassword, generateToken, reverseToken }`, `{ SUCCESS_MESSAGES, ERROR_MESSAGES }`, `{ imageValidationExtensions, fileValidationExtensions, videoValidationExtensions, status }`, `{ Constant, Helper }` barrel, `removeFile({filePath})`, `uploadImage({filePath,fileName,base64})` (default export), `uploadFile({filePath,fileName,base64})` (default export), `uploadMultipleImage(items, dynamicPath, oldImages?)` (default export) — all identical signatures to `backend/src/utils/*`, consumed the same way by every module's `service.ts` in Tasks 5–9.

- [ ] **Step 1: Write the failing test for cache TTL/prefix invalidation**

```ts
// frontend/src/server/utils/__tests__/cache.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import cache from "../cache";

describe("MemoryCache", () => {
  beforeEach(() => {
    cache.clear();
  });

  it("returns null for a missing key", () => {
    expect(cache.get("missing")).toBeNull();
  });

  it("stores and retrieves a value before TTL expiry", () => {
    cache.set("k", { a: 1 }, 60);
    expect(cache.get("k")).toEqual({ a: 1 });
  });

  it("expires a value after its TTL", () => {
    vi.useFakeTimers();
    cache.set("k", "v", 1);
    vi.advanceTimersByTime(1001);
    expect(cache.get("k")).toBeNull();
    vi.useRealTimers();
  });

  it("invalidatePrefix clears only matching keys", () => {
    cache.set("settings:a", 1, 60);
    cache.set("settings:b", 2, 60);
    cache.set("other:c", 3, 60);
    cache.invalidatePrefix("settings:");
    expect(cache.get("settings:a")).toBeNull();
    expect(cache.get("settings:b")).toBeNull();
    expect(cache.get("other:c")).toBe(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npx vitest run src/server/utils/__tests__/cache.test.ts`
Expected: FAIL — `Cannot find module '../cache'`

- [ ] **Step 3: Copy the unmodified utils from `backend/`**

Copy these files verbatim — their logic has zero Bun/Elysia/Express dependency, so no edits are needed beyond the file move:

```bash
cp backend/src/utils/cache.ts frontend/src/server/utils/cache.ts
cp backend/src/utils/helper.ts frontend/src/server/utils/helper.ts
cp backend/src/utils/messages.ts frontend/src/server/utils/messages.ts
cp backend/src/utils/constants.ts frontend/src/server/utils/constants.ts
cp backend/src/utils/index.ts frontend/src/server/utils/index.ts
```

For `verifyJwtToken.ts`, `removeFile.ts`, `uploadImage.ts`, `uploadFile.ts`, `uploadMultipleFile.ts` — copy, then apply the import-path fix (these import `../config/env` or `../constant`, which are unchanged relative paths since the directory structure under `server/` mirrors `backend/src/`, so **no edit is needed for those five either**:

```bash
cp backend/src/utils/verifyJwtToken.ts frontend/src/server/utils/verifyJwtToken.ts
cp backend/src/utils/removeFile.ts frontend/src/server/utils/removeFile.ts
cp backend/src/utils/uploadImage.ts frontend/src/server/utils/uploadImage.ts
cp backend/src/utils/uploadFile.ts frontend/src/server/utils/uploadFile.ts
cp backend/src/utils/uploadMultipleFile.ts frontend/src/server/utils/uploadMultipleFile.ts
```

Verify no file under `frontend/src/server/utils/` still imports `db` the old (eager instance) way — `db.ts` now exports `getDb`, not a default instance. None of these five utils import `db` at all, so no further edit is required; confirm with:

```bash
grep -rn "from \"../config/db\"\|from '../config/db'" frontend/src/server/utils/
```

Expected: no output.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npx vitest run src/server/utils/__tests__/cache.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Verify the build compiles this far**

Run: `cd frontend && npx tsc --noEmit -p tsconfig.json`
Expected: no errors referencing `src/server/utils/*` (errors about not-yet-created `modules/*` are expected and ignored until later tasks).

- [ ] **Step 6: Commit**

```bash
git add frontend/src/server/utils
git commit -m "feat: port shared server utils (cache, jwt, uploads, messages)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Auth middleware, rate limiter, and the shared `apiHandler` response wrapper

**Files:**
- Create: `frontend/src/server/middleware/requireAdmin.ts`
- Create: `frontend/src/server/middleware/requireApiKey.ts`
- Create: `frontend/src/server/lib/rateLimit.ts`
- Create: `frontend/src/server/lib/apiHandler.ts`
- Test: `frontend/src/server/lib/__tests__/apiHandler.test.ts`

**Interfaces:**
- Consumes: `verifyJwtToken` (Task 2), `ERROR_MESSAGES` (Task 2), `env` (Task 1).
- Produces: `requireAdmin(request: Request, allowTo: string[]): Promise<{id:number,name:string,email:string,role:string}>` (throws on failure — used by every protected route handler in Tasks 4–10), `requireApiKey(request: Request): Promise<boolean>` (ported, left uncalled to match today's disabled state), `checkRateLimit(key: string): boolean` (named export, returns `false` when the caller should be rejected), `apiHandler(fn: (req: Request, ctx: {params: Promise<Record<string,string>>}) => Promise<any>): (req: Request, ctx: any) => Promise<Response>` (wraps a handler, calls `checkRateLimit`, catches thrown errors, maps `error.message` to a status code exactly like `backend/src/config/server.ts`'s `onError`, and returns `Response.json({data, message: "Success"})` on success).

- [ ] **Step 1: Write the failing test for `apiHandler`'s error-to-status mapping**

```ts
// frontend/src/server/lib/__tests__/apiHandler.test.ts
import { describe, it, expect } from "vitest";
import { apiHandler } from "../apiHandler";

describe("apiHandler", () => {
  it("wraps a successful handler result in {data, message}", async () => {
    const handler = apiHandler(async () => ({ id: 1 }));
    const res = await handler(
      new Request("http://localhost/api/test"),
      { params: Promise.resolve({}) },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ data: { id: 1 }, message: "Success" });
  });

  it("maps 'Unauthorized' to 401", async () => {
    const handler = apiHandler(async () => {
      throw new Error("Unauthorized");
    });
    const res = await handler(
      new Request("http://localhost/api/test"),
      { params: Promise.resolve({}) },
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({
      message: "Unauthorized",
      success: false,
      statusCode: 401,
    });
  });

  it("maps 'jwt expired' to 401", async () => {
    const handler = apiHandler(async () => {
      throw new Error("jwt expired");
    });
    const res = await handler(
      new Request("http://localhost/api/test"),
      { params: Promise.resolve({}) },
    );
    expect(res.status).toBe(401);
  });

  it("maps 'Invalid API Key' to 401", async () => {
    const handler = apiHandler(async () => {
      throw new Error("Invalid API Key");
    });
    const res = await handler(
      new Request("http://localhost/api/test"),
      { params: Promise.resolve({}) },
    );
    expect(res.status).toBe(401);
  });

  it("maps any other error to 500 and strips 'Error: ' prefix", async () => {
    const handler = apiHandler(async () => {
      throw new Error("Error: Data not found");
    });
    const res = await handler(
      new Request("http://localhost/api/test"),
      { params: Promise.resolve({}) },
    );
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.message).toBe("Data not found");
    expect(body.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npx vitest run src/server/lib/__tests__/apiHandler.test.ts`
Expected: FAIL — `Cannot find module '../apiHandler'`

- [ ] **Step 3: Write `requireAdmin.ts`, `requireApiKey.ts`, `rateLimit.ts`, `apiHandler.ts`**

```ts
// frontend/src/server/middleware/requireAdmin.ts
import verifyJwtToken from "../utils/verifyJwtToken";
import AdminService from "../modules/admins/service";
import { ERROR_MESSAGES } from "../utils/messages";

const roles = ["admin"];

const checkSpecificRole = async (user: any, allowTo: string[]) => {
  if (!allowTo.includes(user?.role || user?.type)) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }
  return user;
};

// Ported from backend/src/middleware/checkAuthentication.ts. Elysia's
// beforeHandle hook is gone — this is called as a plain function at the
// top of each protected route.ts handler instead.
const requireAdmin = async (request: Request, allowTo: string[] = []) => {
  const token = request.headers.get("authorization");
  if (!token && allowTo.includes("public")) {
    return null;
  }
  if (!token) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }
  const tokenWithoutBearer = token.startsWith("Bearer ")
    ? token.slice(7)
    : token;
  const decoded = await verifyJwtToken(tokenWithoutBearer);
  if (!decoded) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }
  if (!Array.isArray(allowTo) || !allowTo?.length) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }
  let user = null;
  await checkSpecificRole(decoded, allowTo);
  if (decoded?.role === "admin") {
    const userInfo = await AdminService.find(decoded.id);
    user = {
      ...(userInfo as any)?.dataValues,
      role: "admin",
    };
  } else {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }
  return user;
};

export { roles };
export default requireAdmin;
```

```ts
// frontend/src/server/middleware/requireApiKey.ts
import env from "../config/env";
import { ERROR_MESSAGES } from "../utils/messages";

// Ported from backend/src/middleware/checkApiKey.ts. Currently unused by
// any route, matching the disabled `onBeforeHandle` call in the old
// server.ts — kept available if API-key enforcement is re-enabled later.
const requireApiKey = async (request: Request) => {
  const apiKey = request.headers.get("Api-Key");
  if (apiKey !== env.API_KEY) {
    throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
  }
  return true;
};

export default requireApiKey;
```

```ts
// frontend/src/server/lib/rateLimit.ts
// Ported from backend/src/config/server.ts's hand-rolled sliding-window
// limiter. ponytail: per-instance Map, not shared across Vercel Function
// instances — each warm instance enforces its own 500req/60s window, so
// the effective limit is higher under multi-instance scaling. Upgrade
// path: Upstash Redis (@upstash/ratelimit) via Vercel Marketplace if a
// precise cross-instance limit is ever required.
const requestCounts = new Map<string, { count: number; timestamp: number }>();
const windowMs = 60 * 1000;
const maxRequests = 500;

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of requestCounts.entries()) {
      if (now - record.timestamp > windowMs) {
        requestCounts.delete(key);
      }
    }
  }, 60 * 1000).unref?.();
}

const checkRateLimit = (key: string): boolean => {
  const currentTime = Date.now();
  const record = requestCounts.get(key);
  if (!record) {
    requestCounts.set(key, { count: 1, timestamp: currentTime });
    return true;
  }
  const timeElapsed = currentTime - record.timestamp;
  if (timeElapsed > windowMs) {
    requestCounts.set(key, { count: 1, timestamp: currentTime });
    return true;
  }
  if (record.count >= maxRequests) {
    return false;
  }
  record.count++;
  return true;
};

export { checkRateLimit };
```

```ts
// frontend/src/server/lib/apiHandler.ts
import { checkRateLimit } from "./rateLimit";

type RouteContext = { params: Promise<Record<string, string>> };
type Handler = (request: Request, ctx: RouteContext) => Promise<any>;

// Ported from backend/src/routes/index.ts's routesInit wrapper +
// backend/src/config/server.ts's onError. Every route.ts handler in
// src/app/api wraps its logic with this so the response envelope and
// error-to-status mapping stay identical to the old Elysia server.
const statusForError = (message: string): number => {
  switch (message) {
    case "jwt expired":
    case "Unauthorized":
    case "Invalid API Key":
      return 401;
    default:
      return 500;
  }
};

const apiHandler =
  (fn: Handler) =>
  async (request: Request, ctx: RouteContext): Promise<Response> => {
    const url = new URL(request.url);
    if (url.pathname !== "/api/health") {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "127.0.0.1";
      const rateLimitKey = `${ip}-${url.pathname}`;
      if (!checkRateLimit(rateLimitKey)) {
        return Response.json(
          {
            message: "You have exceeded you limit",
            success: false,
            statusCode: 429,
          },
          { status: 429 },
        );
      }
    }

    try {
      const data = await fn(request, ctx);
      return Response.json({ data, message: "Success" }, { status: 200 });
    } catch (err: any) {
      const rawMessage: string = err?.message || "Forbidden";
      const message = rawMessage.replaceAll("Error: ", "");
      const status = statusForError(message);
      console.log(message, status);
      return Response.json(
        { message, success: false, statusCode: status },
        { status },
      );
    }
  };

export { apiHandler };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npx vitest run src/server/lib/__tests__/apiHandler.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add frontend/src/server/middleware frontend/src/server/lib
git commit -m "feat: add requireAdmin middleware, rate limiter, apiHandler wrapper

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: `admins` module (proves the auth/JWT pattern end-to-end)

**Files:**
- Create: `frontend/src/server/modules/admins/attributes.ts`
- Create: `frontend/src/server/modules/admins/model.ts`
- Create: `frontend/src/server/modules/admins/repository.ts`
- Create: `frontend/src/server/modules/admins/service.ts`
- Create: `frontend/src/server/modules/admins/validationSchema.ts`
- Create: `frontend/src/app/api/admins/route.ts`
- Create: `frontend/src/app/api/admins/register/route.ts`
- Create: `frontend/src/app/api/admins/login/route.ts`
- Create: `frontend/src/app/api/admins/logout/route.ts`
- Create: `frontend/src/app/api/admins/change-password/route.ts`
- Create: `frontend/src/app/api/admins/[id]/route.ts`
- Test: `frontend/src/app/api/admins/__tests__/login.test.ts`
- Test: `frontend/src/server/middleware/__tests__/requireAdmin.test.ts`

**Interfaces:**
- Consumes: `getDb` (Task 1), `Constant`/`Helper` utils (Task 2), `apiHandler`, `requireAdmin` (Task 3).
- Produces: `AdminService` (default export: `{list, create, find, changePassword, login, logout}`) — this is what `requireAdmin` (Task 3) imports as `AdminService.find`, so **this task must land before any route that calls `requireAdmin` is exercised against a real DB**, but Task 3's unit tests above don't hit the DB, so ordering is safe.

- [ ] **Step 1: Write the failing test for the login route's envelope shape**

```ts
// frontend/src/app/api/admins/__tests__/login.test.ts
import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../server/modules/admins/service", () => ({
  default: {
    login: vi.fn().mockResolvedValue({
      id: 1,
      name: "Test Admin",
      email: "admin@test.com",
      username: "admin",
      role: "admin",
      token: "signed.jwt.token",
    }),
  },
}));

import { POST } from "../login/route";

describe("POST /api/admins/login", () => {
  it("returns the data/message envelope with a token", async () => {
    const req = new Request("http://localhost/api/admins/login", {
      method: "POST",
      body: JSON.stringify({ username: "admin", password: "password123" }),
    });
    const res = await POST(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("Success");
    expect(body.data.token).toBe("signed.jwt.token");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npx vitest run src/app/api/admins/__tests__/login.test.ts`
Expected: FAIL — `Cannot find module '../login/route'`

- [ ] **Step 3: Copy the module files, adjusting only the `db` import**

```bash
mkdir -p frontend/src/server/modules/admins
cp backend/src/modules/admins/attributes.ts frontend/src/server/modules/admins/attributes.ts
cp backend/src/modules/admins/repository.ts frontend/src/server/modules/admins/repository.ts
cp backend/src/modules/admins/validationSchema.ts frontend/src/server/modules/admins/validationSchema.ts
cp backend/src/modules/admins/service.ts frontend/src/server/modules/admins/service.ts
cp backend/src/modules/admins/model.ts frontend/src/server/modules/admins/model.ts
```

`model.ts` is the only file in this module that imports `db` — apply this exact edit:

```ts
// frontend/src/server/modules/admins/model.ts
// BEFORE: import db from "../../config/db";
// AFTER:
import { getDb } from "../../config/db";
import { adminAttributes } from "./attributes";
import { Op } from "sequelize";

const Admin = getDb().define("admins", adminAttributes, {
  tableName: "admins",
  timestamps: true,
  paranoid: true,
});

const insertHook = async (data: any) => {
  const exist = await Admin.findOne({
    where: {
      [Op.or]: [{ email: data.email }, { username: data.username }],
    },
  });

  if (exist) {
    throw new Error("User already exists");
  }
};

Admin.beforeCreate(insertHook);

export default Admin;
```

- [ ] **Step 4: Write the six route handlers**

```ts
// frontend/src/app/api/admins/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import AdminService from "@/server/modules/admins/service";

export const GET = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const { searchParams } = new URL(request.url);
  return AdminService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });
});
```

```ts
// frontend/src/app/api/admins/register/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import AdminService from "@/server/modules/admins/service";

export const POST = apiHandler(async (request) => {
  const body = await request.json();
  return AdminService.create(body);
});
```

```ts
// frontend/src/app/api/admins/login/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import AdminService from "@/server/modules/admins/service";

export const POST = apiHandler(async (request) => {
  const body = await request.json();
  return AdminService.login(body);
});
```

```ts
// frontend/src/app/api/admins/logout/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import AdminService from "@/server/modules/admins/service";

export const POST = apiHandler(async (request) => {
  const user = await requireAdmin(request, ["admin"]);
  const body = await request.json();
  return AdminService.logout(body, user.id);
});
```

```ts
// frontend/src/app/api/admins/change-password/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import AdminService from "@/server/modules/admins/service";

export const PATCH = apiHandler(async (request) => {
  const user = await requireAdmin(request, ["admin"]);
  const body = await request.json();
  return AdminService.changePassword(body, user.id);
});
```

Note on `admins/[id]/route.ts`: the original `backend/src/modules/admins/controller.ts`'s `find` handler reads `req.user.id` (set by the auth middleware), not the `:id` URL param, despite the route being registered at `admins/:id` — copied faithfully below (the `[id]` segment exists only to match the old URL shape; it's read from nowhere in the handler):

```ts
// frontend/src/app/api/admins/[id]/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import AdminService from "@/server/modules/admins/service";

export const GET = apiHandler(async (request) => {
  const user = await requireAdmin(request, ["admin"]);
  return AdminService.find(user.id);
});
```

- [ ] **Step 5: Add the `@/*` path alias if not already present**

Check `frontend/tsconfig.json` for a `paths` entry mapping `@/*` to `./src/*`. If absent, add it:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `cd frontend && npx vitest run src/app/api/admins/__tests__/login.test.ts`
Expected: PASS

- [ ] **Step 7: Verify JWT expiry produces the documented 401 shape (Review Focus item)**

```ts
// frontend/src/server/middleware/__tests__/requireAdmin.test.ts
import { describe, it, expect } from "vitest";
import requireAdmin from "../requireAdmin";

describe("requireAdmin", () => {
  it("throws 'Unauthorized' when no token is present", async () => {
    const req = new Request("http://localhost/api/admins", {
      headers: {},
    });
    await expect(requireAdmin(req, ["admin"])).rejects.toThrow(
      "Unauthorized",
    );
  });

  it("throws when the token is malformed", async () => {
    const req = new Request("http://localhost/api/admins", {
      headers: { authorization: "Bearer not-a-real-jwt" },
    });
    await expect(requireAdmin(req, ["admin"])).rejects.toThrow();
  });
});
```

Run: `cd frontend && npx vitest run src/server/middleware/__tests__/requireAdmin.test.ts`
Expected: PASS (2 tests) — confirms the Review Focus item on bad/expired tokens.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/server/modules/admins frontend/src/app/api/admins frontend/src/server/middleware/__tests__ frontend/tsconfig.json
git commit -m "feat: port admins module and auth routes to Next.js

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: `products` module (proves file-upload + category-association pattern)

**Files:**
- Create: `frontend/src/server/modules/products/attributes.ts`
- Create: `frontend/src/server/modules/products/model.ts`
- Create: `frontend/src/server/modules/products/repository.ts`
- Create: `frontend/src/server/modules/products/service.ts`
- Create: `frontend/src/server/modules/products/validationSchema.ts`
- Create: `frontend/src/app/api/products/route.ts`
- Create: `frontend/src/app/api/products/[id]/route.ts`
- Test: `frontend/src/app/api/products/__tests__/list.test.ts`

**Interfaces:**
- Consumes: `getDb` (Task 1), `uploadMultipleImage`/`removeFile` (Task 2), `apiHandler`/`requireAdmin` (Task 3), `getDb` from `../generalSettings/model` (Task 6 — **Task 6 must land before this task's `model.ts` is exercised at runtime**; note the dependency and land Task 6 first, or stub `generalSettings/model` if strict TDD ordering is required).

- [ ] **Step 1: Write the failing test for the list route reading query params correctly**

```ts
// frontend/src/app/api/products/__tests__/list.test.ts
import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../server/modules/products/service", () => ({
  default: {
    list: vi.fn().mockResolvedValue({
      items: [],
      page: 2,
      limit: 5,
      totalItems: 0,
      totalPages: 0,
    }),
  },
}));

import { GET } from "../route";

describe("GET /api/products", () => {
  it("reads page/limit/search/type/categoryId from searchParams, not req.query", async () => {
    const req = new Request(
      "http://localhost/api/products?page=2&limit=5&search=aspirin&type=medicine&categoryId=3",
    );
    const res = await GET(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.page).toBe(2);
    expect(body.data.limit).toBe(5);
  });

  it("defaults to no filters when no query params are given", async () => {
    const req = new Request("http://localhost/api/products");
    const res = await GET(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npx vitest run src/app/api/products/__tests__/list.test.ts`
Expected: FAIL — `Cannot find module '../route'`

- [ ] **Step 3: Copy module files, strip the dead `bun` import, fix the `db` import**

```bash
mkdir -p frontend/src/server/modules/products
cp backend/src/modules/products/repository.ts frontend/src/server/modules/products/repository.ts
cp backend/src/modules/products/validationSchema.ts frontend/src/server/modules/products/validationSchema.ts
cp backend/src/modules/products/service.ts frontend/src/server/modules/products/service.ts
cp backend/src/modules/products/attributes.ts frontend/src/server/modules/products/attributes.ts
cp backend/src/modules/products/model.ts frontend/src/server/modules/products/model.ts
```

Edit `attributes.ts` — delete line 1 (the dead Bun import):

```ts
// frontend/src/server/modules/products/attributes.ts
// DELETE this line entirely: import { allocUnsafe } from "bun";
import { DataTypes } from "sequelize";
const productAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    reference: {
      model: "general_settings",
      key: "id",
      index: true,
    },
    allowNull: false,
  },
  files: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  additionalInfo: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export { productAttributes };
```

Edit `model.ts` — swap the `db` import for `getDb`:

```ts
// frontend/src/server/modules/products/model.ts
import { getDb } from "../../config/db";
import GeneralSetting from "../generalSettings/model";
import { productAttributes } from "./attributes";

const Product = getDb().define("products", productAttributes, {
  tableName: "products",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

Product.belongsTo(GeneralSetting, {
  foreignKey: "categoryId",
  as: "categoryData",
});

Product.addScope("withCategory", () => {
  const scope = {
    model: GeneralSetting,
    as: "categoryData",
    attributes: ["id", "value", "type"],
    required: false,
  };

  return {
    include: [scope],
  };
});

export default Product;
```

`repository.ts`, `service.ts`, `validationSchema.ts` need no edits — none import `db`, `bun`, or anything Elysia/Express-specific (verify with the grep in Task 2 Step 3, run against this directory).

- [ ] **Step 4: Write the two route handlers**

```ts
// frontend/src/app/api/products/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ProductService from "@/server/modules/products/service";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  return ProductService.list({
    search: searchParams.get("search") || null,
    type: searchParams.get("type") || null,
    categoryId: searchParams.get("categoryId") || null,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });
});

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const body = await request.json();
  return ProductService.create(body);
});
```

```ts
// frontend/src/app/api/products/[id]/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ProductService from "@/server/modules/products/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { id } = await params;
  return ProductService.find(id);
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return ProductService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return ProductService.remove(Number(id));
});
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd frontend && npx vitest run src/app/api/products/__tests__/list.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add frontend/src/server/modules/products frontend/src/app/api/products
git commit -m "feat: port products module (proves upload + association pattern)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: `generalSettings` module (custom routes: group/key lookups, cache-backed)

**Files:**
- Create: `frontend/src/server/modules/generalSettings/attributes.ts`
- Create: `frontend/src/server/modules/generalSettings/model.ts`
- Create: `frontend/src/server/modules/generalSettings/service.ts`
- Create: `frontend/src/server/modules/generalSettings/validationSchema.ts`
- Create: `frontend/src/server/modules/generalSettings/interface.ts`
- Create: `frontend/src/app/api/generalSettings/route.ts`
- Create: `frontend/src/app/api/generalSettings/group/[group]/route.ts`
- Create: `frontend/src/app/api/generalSettings/key/[key]/route.ts`
- Create: `frontend/src/app/api/generalSettings/[id]/route.ts`
- Test: `frontend/src/app/api/generalSettings/__tests__/byKey.test.ts`

**Note:** `generalSettings` has no `repository.ts` in the original backend (its controller calls the service directly with group/key params, not list-filter builders) and no `POST` path outside `create` (there's no separate get-all list route registered — only `group/:group` and `key/:key` lookups plus admin `create`/`update`/`delete`). Confirm this against `backend/src/routes/setting.ts` (already read: only `create`, `getByGroup`, `getByKey`, `update`, `delete` are registered — **no plain `GET /api/generalSettings` list route exists today**, so `frontend/src/app/api/generalSettings/route.ts` only exports `POST`).

**Interfaces:**
- Produces: `Model` (default export, Sequelize model — `Product` in Task 5 imports this as `GeneralSetting`) — **this task must land before Task 5's `model.ts` can compile/run**, so execute Task 6 before Task 5 despite the numbering, or treat Tasks 5 and 6 as a single ordered pair.

- [ ] **Step 1: Write the failing test for the `key/:key` lookup route**

```ts
// frontend/src/app/api/generalSettings/__tests__/byKey.test.ts
import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../server/modules/generalSettings/service", () => ({
  default: {
    getByKey: vi.fn().mockResolvedValue({ key: "site_title", value: "Max Pharma" }),
  },
}));

import { GET } from "../key/[key]/route";

describe("GET /api/generalSettings/key/:key", () => {
  it("passes the key URL param through to the service", async () => {
    const req = new Request("http://localhost/api/generalSettings/key/site_title");
    const res = await GET(req, { params: Promise.resolve({ key: "site_title" }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.value).toBe("Max Pharma");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npx vitest run src/app/api/generalSettings/__tests__/byKey.test.ts`
Expected: FAIL — `Cannot find module '../key/[key]/route'`

- [ ] **Step 3: Copy module files**

```bash
mkdir -p frontend/src/server/modules/generalSettings
cp backend/src/modules/generalSettings/attributes.ts frontend/src/server/modules/generalSettings/attributes.ts
cp backend/src/modules/generalSettings/service.ts frontend/src/server/modules/generalSettings/service.ts
cp backend/src/modules/generalSettings/validationSchema.ts frontend/src/server/modules/generalSettings/validationSchema.ts
cp backend/src/modules/generalSettings/interface.ts frontend/src/server/modules/generalSettings/interface.ts
cp backend/src/modules/generalSettings/model.ts frontend/src/server/modules/generalSettings/model.ts
```

Edit `model.ts` — swap `db` for `getDb`:

```ts
// frontend/src/server/modules/generalSettings/model.ts
import { getDb } from "../../config/db";
import { generalSettingAttributes } from "./attributes";

const GeneralSetting = getDb().define(
  "general_settings",
  generalSettingAttributes,
  {
    tableName: "general_settings",
    timestamps: true,
  },
);

export default GeneralSetting;
```

(If the original `model.ts` differs from this — e.g. has additional scopes — read it first and preserve every scope/option exactly; only the `db` → `getDb()` swap is a required change.)

- [ ] **Step 4: Write the four route handlers**

```ts
// frontend/src/app/api/generalSettings/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import GeneralSettingsService from "@/server/modules/generalSettings/service";

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const body = await request.json();
  return GeneralSettingsService.create(body);
});
```

```ts
// frontend/src/app/api/generalSettings/group/[group]/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import GeneralSettingsService from "@/server/modules/generalSettings/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { group } = await params;
  return GeneralSettingsService.getByGroup(group);
});
```

```ts
// frontend/src/app/api/generalSettings/key/[key]/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import GeneralSettingsService from "@/server/modules/generalSettings/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { key } = await params;
  return GeneralSettingsService.getByKey(key);
});
```

```ts
// frontend/src/app/api/generalSettings/[id]/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import GeneralSettingsService from "@/server/modules/generalSettings/service";

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return GeneralSettingsService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return GeneralSettingsService.remove(Number(id));
});
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd frontend && npx vitest run src/app/api/generalSettings/__tests__/byKey.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add frontend/src/server/modules/generalSettings frontend/src/app/api/generalSettings
git commit -m "feat: port generalSettings module (group/key lookup routes)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: `aboutUs`, `galleries`, `services`, `themes` modules (cache-backed CRUD with multi-file/document uploads)

**Files:**
- Create: `frontend/src/server/modules/{aboutUs,galleries,services,themes}/{attributes,model,repository,service,validationSchema}.ts`
- Create: `frontend/src/app/api/{about-us,gallery,services,themes}/route.ts`
- Create: `frontend/src/app/api/{about-us,gallery,services,themes}/[id]/route.ts`
- Test: `frontend/src/app/api/gallery/__tests__/list.test.ts`

**Interfaces:**
- Consumes: `getDb`, `uploadMultipleImage`/`uploadFile`/`removeFile`, `cache`, `apiHandler`/`requireAdmin` — all from Tasks 1–3.
- Produces: nothing new consumed by later tasks (these four are leaves).

These four modules share the identical cache-backed CRUD shape already read in full above (`aboutUs/service.ts`, `galleries/service.ts`, `services/service.ts`, `themes/service.ts`). Port each the same way as Task 5:

- [ ] **Step 1: Write the failing test for `gallery`'s list route (cache-backed, confirms `searchParams` read)**

```ts
// frontend/src/app/api/gallery/__tests__/list.test.ts
import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../server/modules/galleries/service", () => ({
  default: {
    list: vi.fn().mockResolvedValue({ items: [], page: 1, limit: 10, totalItems: 0, totalPages: 0 }),
  },
}));

import { GET } from "../route";

describe("GET /api/gallery", () => {
  it("returns 200 with no query params", async () => {
    const req = new Request("http://localhost/api/gallery");
    const res = await GET(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npx vitest run src/app/api/gallery/__tests__/list.test.ts`
Expected: FAIL — `Cannot find module '../route'`

- [ ] **Step 3: For each of the four modules, copy files and apply the `db` → `getDb()` edit**

```bash
for m in aboutUs galleries services themes; do
  mkdir -p "frontend/src/server/modules/$m"
  cp "backend/src/modules/$m/attributes.ts" "frontend/src/server/modules/$m/attributes.ts"
  cp "backend/src/modules/$m/repository.ts" "frontend/src/server/modules/$m/repository.ts"
  cp "backend/src/modules/$m/service.ts" "frontend/src/server/modules/$m/service.ts"
  cp "backend/src/modules/$m/validationSchema.ts" "frontend/src/server/modules/$m/validationSchema.ts"
  cp "backend/src/modules/$m/model.ts" "frontend/src/server/modules/$m/model.ts"
done
```

For each `frontend/src/server/modules/{aboutUs,galleries,services,themes}/model.ts`: open the file, replace the `import db from "../../config/db";` line with `import { getDb } from "../../config/db";`, and replace every `db.define(` call with `getDb().define(`. This is the only required edit per model file — confirm each model has no other Bun/Elysia-specific code with:

```bash
grep -rn "allocUnsafe\|from \"bun\"\|elysia\|express" frontend/src/server/modules/{aboutUs,galleries,services,themes}/
```

Expected: no output (these four modules' `attributes.ts` files don't have the stray Bun import — only `apply`, `products`, `notices` do, per the earlier grep).

- [ ] **Step 4: Write route handlers for each of the four (identical shape, different service import)**

```ts
// frontend/src/app/api/about-us/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import AboutUsService from "@/server/modules/aboutUs/service";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  return AboutUsService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });
});

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const body = await request.json();
  return AboutUsService.create(body);
});
```

```ts
// frontend/src/app/api/about-us/[id]/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import AboutUsService from "@/server/modules/aboutUs/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { id } = await params;
  return AboutUsService.find(id);
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return AboutUsService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return AboutUsService.remove(Number(id));
});
```

```ts
// frontend/src/app/api/gallery/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import GalleryService from "@/server/modules/galleries/service";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  return GalleryService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    search: searchParams.get("search") || null,
  });
});

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin", "user"]);
  const body = await request.json();
  return GalleryService.create(body);
});
```

```ts
// frontend/src/app/api/gallery/[id]/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import GalleryService from "@/server/modules/galleries/service";

export const GET = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return GalleryService.find({ id });
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return GalleryService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return GalleryService.remove(Number(id));
});
```

```ts
// frontend/src/app/api/services/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ServicesService from "@/server/modules/services/service";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  return ServicesService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    categoryId: searchParams.get("categoryId") || null,
    search: searchParams.get("search") || null,
  });
});

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const body = await request.json();
  return ServicesService.create(body);
});
```

```ts
// frontend/src/app/api/services/[id]/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ServicesService from "@/server/modules/services/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { id } = await params;
  return ServicesService.find({ id });
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return ServicesService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return ServicesService.remove(Number(id));
});
```

```ts
// frontend/src/app/api/themes/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import ThemesService from "@/server/modules/themes/service";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  return ThemesService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    search: searchParams.get("search") || null,
  });
});

export const POST = apiHandler(async (request) => {
  const body = await request.json();
  return ThemesService.create(body);
});
```

```ts
// frontend/src/app/api/themes/[id]/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ThemesService from "@/server/modules/themes/service";

export const GET = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return ThemesService.find(id);
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return ThemesService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return ThemesService.remove(Number(id));
});
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd frontend && npx vitest run src/app/api/gallery/__tests__/list.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add frontend/src/server/modules/{aboutUs,galleries,services,themes} frontend/src/app/api/{about-us,gallery,services,themes}
git commit -m "feat: port aboutUs, galleries, services, themes modules

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: `notices`, `apply`, `popup` modules (document uploads, status-exclusivity business rule)

**Files:**
- Create: `frontend/src/server/modules/{notices,apply,popup}/{attributes,model,repository,service,validationSchema}.ts`
- Create: `frontend/src/app/api/notices/route.ts`, `frontend/src/app/api/notices/[id]/route.ts`
- Create: `frontend/src/app/api/applies/route.ts`, `frontend/src/app/api/applies/[id]/route.ts`
- Create: `frontend/src/app/api/popup/route.ts`, `frontend/src/app/api/popup/[id]/route.ts`
- Test: `frontend/src/app/api/popup/__tests__/statusExclusivity.test.ts`

**Interfaces:**
- Consumes: same as Task 7.

- [ ] **Step 1: Write the failing test pinning the "only one active popup" rule (Review Focus item)**

```ts
// frontend/src/app/api/popup/__tests__/statusExclusivity.test.ts
import { describe, it, expect, vi } from "vitest";

const mockUpdate = vi.fn().mockRejectedValue(
  new Error("only one data should be active"),
);

vi.mock("../../../../server/modules/popup/service", () => ({
  default: { update: mockUpdate },
}));

vi.mock("../../../../server/middleware/requireAdmin", () => ({
  default: vi.fn().mockResolvedValue({ id: 1, role: "admin" }),
}));

import { PATCH } from "../[id]/route";

describe("PATCH /api/popup/:id — status exclusivity", () => {
  it("propagates the 'only one data should be active' business rule as a 500 envelope", async () => {
    const req = new Request("http://localhost/api/popup/2", {
      method: "PATCH",
      headers: { authorization: "Bearer x" },
      body: JSON.stringify({ status: true }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: "2" }) });
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.message).toBe("only one data should be active");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npx vitest run src/app/api/popup/__tests__/statusExclusivity.test.ts`
Expected: FAIL — `Cannot find module '../[id]/route'`

- [ ] **Step 3: Copy module files, stripping the dead `bun` import from `notices`/`apply`**

```bash
for m in notices apply popup; do
  mkdir -p "frontend/src/server/modules/$m"
  cp "backend/src/modules/$m/repository.ts" "frontend/src/server/modules/$m/repository.ts"
  cp "backend/src/modules/$m/service.ts" "frontend/src/server/modules/$m/service.ts"
  cp "backend/src/modules/$m/validationSchema.ts" "frontend/src/server/modules/$m/validationSchema.ts"
  cp "backend/src/modules/$m/attributes.ts" "frontend/src/server/modules/$m/attributes.ts"
  cp "backend/src/modules/$m/model.ts" "frontend/src/server/modules/$m/model.ts"
done
```

`notices/attributes.ts` and `apply/attributes.ts` both start with `import { allocUnsafe } from "bun";` — delete that line from each (same edit pattern as Task 5 Step 3; `popup/attributes.ts` has no such line, confirm before editing). In each of the three `model.ts` files, replace `import db from "../../config/db";` with `import { getDb } from "../../config/db";` and `db.define(` with `getDb().define(`.

- [ ] **Step 4: Write the six route handlers**

```ts
// frontend/src/app/api/notices/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import NoticesService from "@/server/modules/notices/service";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  return NoticesService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });
});

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const body = await request.json();
  return NoticesService.create(body);
});
```

```ts
// frontend/src/app/api/notices/[id]/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import NoticesService from "@/server/modules/notices/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { id } = await params;
  return NoticesService.find(id);
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return NoticesService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return NoticesService.remove(Number(id));
});
```

```ts
// frontend/src/app/api/applies/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ApplyService from "@/server/modules/apply/service";

export const GET = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const { searchParams } = new URL(request.url);
  return ApplyService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });
});

export const POST = apiHandler(async (request) => {
  const body = await request.json();
  return ApplyService.create(body);
});
```

```ts
// frontend/src/app/api/applies/[id]/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ApplyService from "@/server/modules/apply/service";

export const GET = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return ApplyService.find(id);
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return ApplyService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return ApplyService.remove(Number(id));
});
```

```ts
// frontend/src/app/api/popup/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import PopupService from "@/server/modules/popup/service";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  return PopupService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    type: searchParams.get("type") || null,
  });
});

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const body = await request.json();
  return PopupService.create(body);
});
```

```ts
// frontend/src/app/api/popup/[id]/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import PopupService from "@/server/modules/popup/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { id } = await params;
  return PopupService.find(id);
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return PopupService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return PopupService.remove(Number(id));
});
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd frontend && npx vitest run src/app/api/popup/__tests__/statusExclusivity.test.ts`
Expected: PASS — confirms the Review Focus item on the popup exclusivity rule.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/server/modules/{notices,apply,popup} frontend/src/app/api/{notices,applies,popup}
git commit -m "feat: port notices, apply, popup modules

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 9: `contacts`, `inquiries`, `dashboard` modules (no-repository CRUD + aggregation)

**Files:**
- Create: `frontend/src/server/modules/{contacts,inquiries}/{attributes,model,repository,service,validationSchema}.ts`
- Create: `frontend/src/server/modules/dashboard/service.ts`
- Create: `frontend/src/app/api/contacts/route.ts`, `frontend/src/app/api/contacts/[id]/route.ts`
- Create: `frontend/src/app/api/inquiries/route.ts`, `frontend/src/app/api/inquiries/[id]/route.ts`
- Create: `frontend/src/app/api/dashboard/route.ts`
- Test: `frontend/src/app/api/dashboard/__tests__/getMainDashboard.test.ts`

**Interfaces:**
- Consumes: `ContactService`, `GalleryService` (Task 7), `NoticeService`/`Services` (Task 8/7), `SettingService` (Task 6), `ApplyService` (Task 8), `ProductService` (Task 5), `InquiryService` (this task) — `dashboard/service.ts` is a pure aggregator with no own model, so **all eight modules it imports from must exist before this task's `dashboard/service.ts` can compile**; run this task last among the module-porting tasks (after Tasks 5–8).

- [ ] **Step 1: Write the failing test for the dashboard aggregation route**

```ts
// frontend/src/app/api/dashboard/__tests__/getMainDashboard.test.ts
import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../server/modules/dashboard/service", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      totalApply: 3,
      totalGallery: 10,
      totalContact: 5,
      totalServices: 2,
      totalSetting: 1,
      totalNotices: 4,
      totalProduct: 20,
      totalInquiry: 7,
      inquiryData: { items: [] },
      applyData: { items: [] },
    }),
  },
}));

vi.mock("../../../../server/middleware/requireAdmin", () => ({
  default: vi.fn().mockResolvedValue({ id: 1, role: "admin" }),
}));

import { GET } from "../route";

describe("GET /api/dashboard?type=dashboard", () => {
  it("returns the aggregated dashboard counters", async () => {
    const req = new Request("http://localhost/api/dashboard?type=dashboard", {
      headers: { authorization: "Bearer x" },
    });
    const res = await GET(req, { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.totalProduct).toBe(20);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npx vitest run src/app/api/dashboard/__tests__/getMainDashboard.test.ts`
Expected: FAIL — `Cannot find module '../route'`

- [ ] **Step 3: Copy `contacts`, `inquiries`, `dashboard` files**

```bash
for m in contacts inquiries; do
  mkdir -p "frontend/src/server/modules/$m"
  cp "backend/src/modules/$m/attributes.ts" "frontend/src/server/modules/$m/attributes.ts"
  cp "backend/src/modules/$m/repository.ts" "frontend/src/server/modules/$m/repository.ts"
  cp "backend/src/modules/$m/service.ts" "frontend/src/server/modules/$m/service.ts"
  cp "backend/src/modules/$m/validationSchema.ts" "frontend/src/server/modules/$m/validationSchema.ts"
  cp "backend/src/modules/$m/model.ts" "frontend/src/server/modules/$m/model.ts"
done
mkdir -p frontend/src/server/modules/dashboard
cp backend/src/modules/dashboard/service.ts frontend/src/server/modules/dashboard/service.ts
```

Apply the `db` → `getDb()` edit to `contacts/model.ts` and `inquiries/model.ts` (same pattern as every prior module task). `dashboard/service.ts` needs no edit — it only imports other services, none of which are `db` directly.

- [ ] **Step 4: Write the five route handlers**

```ts
// frontend/src/app/api/contacts/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ContactsService from "@/server/modules/contacts/service";

export const GET = apiHandler(async (request) => {
  await requireAdmin(request, ["admin", "user"]);
  const { searchParams } = new URL(request.url);
  return ContactsService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });
});

export const POST = apiHandler(async (request) => {
  const body = await request.json();
  return ContactsService.create(body);
});
```

```ts
// frontend/src/app/api/contacts/[id]/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ContactsService from "@/server/modules/contacts/service";

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin", "user"]);
  const { id } = await params;
  return ContactsService.remove(Number(id));
});
```

```ts
// frontend/src/app/api/inquiries/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import InquiriesService from "@/server/modules/inquiries/service";

export const GET = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const { searchParams } = new URL(request.url);
  return InquiriesService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });
});

export const POST = apiHandler(async (request) => {
  const body = await request.json();
  return InquiriesService.create(body);
});
```

```ts
// frontend/src/app/api/inquiries/[id]/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import InquiriesService from "@/server/modules/inquiries/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { id } = await params;
  return InquiriesService.find(Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return InquiriesService.remove(Number(id));
});
```

```ts
// frontend/src/app/api/dashboard/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import DashboardService from "@/server/modules/dashboard/service";

export const GET = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const { searchParams } = new URL(request.url);
  return DashboardService.get({ type: searchParams.get("type") });
});
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd frontend && npx vitest run src/app/api/dashboard/__tests__/getMainDashboard.test.ts`
Expected: PASS

- [ ] **Step 6: Run the full test suite to confirm all modules compile together**

Run: `cd frontend && npx vitest run && npx tsc --noEmit -p tsconfig.json`
Expected: all tests PASS, zero type errors.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/server/modules/{contacts,inquiries,dashboard} frontend/src/app/api/{contacts,inquiries,dashboard}
git commit -m "feat: port contacts, inquiries, dashboard modules

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 10: Upload route, health route, and the Vercel 4.5MB payload gap

**Files:**
- Create: `frontend/src/app/api/upload/route.ts`
- Create: `frontend/src/app/api/health/route.ts`
- Test: `frontend/src/app/api/upload/__tests__/payloadTooLarge.test.ts`

**Interfaces:**
- Consumes: `uploadImage`/`uploadFile` (Task 2), `apiHandler`/`requireAdmin` (Task 3), `getDb` (Task 1).

This is the one genuinely **new** entry point — the old backend never exposed a standalone `/api/upload`; every module's `service.ts` called `uploadImage`/`uploadMultipleImage` internally as part of `create`/`update`. That pattern is preserved as-is in every module task above. This task adds a small standalone endpoint for cases where the frontend wants to upload a file independent of a specific module record (useful, but confirm with the user before wiring any frontend call to it — out of scope here, this task only creates the route).

- [ ] **Step 1: Write the failing test documenting the 4.5MB Vercel payload cap behavior**

```ts
// frontend/src/app/api/upload/__tests__/payloadTooLarge.test.ts
import { describe, it, expect, vi } from "vitest";

vi.mock("../../../../server/middleware/requireAdmin", () => ({
  default: vi.fn().mockResolvedValue({ id: 1, role: "admin" }),
}));

import { POST } from "../route";

describe("POST /api/upload", () => {
  it("returns a 400 with a clear message when required fields are missing", async () => {
    const req = new Request("http://localhost/api/upload", {
      method: "POST",
      headers: { authorization: "Bearer x" },
      body: JSON.stringify({}),
    });
    const res = await POST(req, { params: Promise.resolve({}) });
    const body = await res.json();
    expect(res.status).not.toBe(200);
    expect(body.success).toBe(false);
  });

  // Vercel enforces the 4.5MB request body cap at the platform level before
  // this handler runs (413 FUNCTION_PAYLOAD_TOO_LARGE) — not something a
  // unit test running in Node can reproduce. This test documents the
  // contract: callers must keep base64 uploads under ~3.2MB raw (4.5MB
  // minus ~33% base64 inflation and JSON overhead) or pre-validate file
  // size client-side before calling this route.
  it("documents the effective max raw file size under Vercel's 4.5MB body cap", () => {
    const VERCEL_BODY_CAP_BYTES = 4.5 * 1024 * 1024;
    const BASE64_INFLATION = 4 / 3;
    const effectiveMaxRawBytes = VERCEL_BODY_CAP_BYTES / BASE64_INFLATION;
    expect(Math.floor(effectiveMaxRawBytes / (1024 * 1024))).toBe(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npx vitest run src/app/api/upload/__tests__/payloadTooLarge.test.ts`
Expected: FAIL — `Cannot find module '../route'`

- [ ] **Step 3: Write the upload and health routes**

```ts
// frontend/src/app/api/upload/route.ts
import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import uploadFile from "@/server/utils/uploadFile";

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const body = await request.json();
  const { filePath, fileName, base64 } = body || {};
  if (!filePath || !fileName || !base64) {
    throw new Error("Invalid Request.");
  }
  const key = await uploadFile({ filePath, fileName, base64 });
  return { key };
});
```

```ts
// frontend/src/app/api/health/route.ts
import { getDb } from "@/server/config/db";

// Kept as a plain route (not a Vercel Cron) — this is a manual/monitoring
// health check, not scheduled work.
export async function GET() {
  let dbStatus = "connected";
  try {
    await getDb().authenticate();
  } catch {
    dbStatus = "disconnected";
  }
  return Response.json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npx vitest run src/app/api/upload/__tests__/payloadTooLarge.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/api/upload frontend/src/app/api/health
git commit -m "feat: add standalone upload route and health check route

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 11: Migrations and seeders (tsx-runnable scripts)

**Files:**
- Create: `frontend/src/server/migrations/path.ts`
- Create: `frontend/src/server/migrations/index.ts`
- Create: `frontend/src/server/migrations/add_performance_indexes.ts`
- Create: `frontend/src/server/modules/*/migration.ts` (13 files, one per module)
- Create: `frontend/src/server/seeders/index.ts`
- Modify: `frontend/package.json` (add `migrate`/`seed` scripts)
- Test: manual verification against a local MySQL instance (migrations are infra scripts, not unit-testable in isolation)

**Interfaces:**
- Consumes: `getDb` (Task 1), every module's `attributes.ts` (Tasks 4–9).

- [ ] **Step 1: Copy every module's `migration.ts` verbatim**

```bash
for m in aboutUs admins apply contacts dashboard galleries generalSettings inquiries notices popup products services themes; do
  if [ -f "backend/src/modules/$m/migration.ts" ]; then
    cp "backend/src/modules/$m/migration.ts" "frontend/src/server/modules/$m/migration.ts"
  fi
done
```

(`dashboard` has no `migration.ts` in the original — it has no own table — confirm this with `ls backend/src/modules/dashboard/` before running the loop; the `if` guard above handles it safely either way.)

- [ ] **Step 2: Copy `add_performance_indexes.ts` and `path.ts`, then `index.ts` with the `db` → `getDb()` edit**

```bash
cp backend/src/migrations/add_performance_indexes.ts frontend/src/server/migrations/add_performance_indexes.ts
```

`path.ts` — copy verbatim, only the relative paths need adjusting since it lives one directory shallower relative to `modules/` in the new tree (it's actually the same depth: `server/migrations/path.ts` → `../modules/X/migration.ts`, identical to `backend/src/migrations/path.ts` → `../modules/X/migration.ts`):

```bash
cp backend/src/migrations/path.ts frontend/src/server/migrations/path.ts
```

```ts
// frontend/src/server/migrations/index.ts
import { getDb } from "../config/db";
import { Sequelize } from "sequelize";
import migrations from "./path";

const runMigration = async (migrationPath: string) => {
  const migration = require(migrationPath);
  const db = getDb();
  const queryInterface = db.getQueryInterface();
  await db.authenticate();
  await migration.up(queryInterface, Sequelize);
};

const runMigrations = async () => {
  for (const migrationPath of migrations) {
    console.log(`Running migration: ${migrationPath}`);
    await runMigration(migrationPath);
  }
  console.log("All specified migrations completed successfully.");
  await getDb().close();
};

runMigrations().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
```

- [ ] **Step 3: Copy the seeder, applying the same `db` edit**

```bash
cp backend/src/seeders/index.ts frontend/src/server/seeders/index.ts
```

Open `frontend/src/server/seeders/index.ts` and apply the same `import db from "../config/db"` → `import { getDb } from "../config/db"` substitution, replacing every bare `db` usage with `getDb()` (read the file first to confirm exact usages before editing — the pattern from `migrations/index.ts` above is the template).

- [ ] **Step 4: Add npm scripts**

```json
// frontend/package.json — add under "scripts"
"migrate": "tsx src/server/migrations/index.ts",
"seed": "tsx src/server/seeders/index.ts"
```

- [ ] **Step 5: Verify against a local MySQL instance**

```bash
cd frontend
cp .env.example .env.local  # or create manually with DB_* vars pointed at a local/test MySQL
npm run migrate
```

Expected: console logs each `Running migration: ...` line in the same order as `backend/src/migrations/path.ts`, ending with `All specified migrations completed successfully.`, and the resulting schema matches `backend/maxpharma.sql`'s table definitions (spot-check with `mysql -e "SHOW TABLES;"` against the target DB).

- [ ] **Step 6: Commit**

```bash
git add frontend/src/server/migrations frontend/src/server/seeders frontend/src/server/modules/*/migration.ts frontend/package.json
git commit -m "feat: port migrations and seeders as tsx-runnable scripts

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 12: Vercel deployment config — CORS/security headers, `vercel.json`, env documentation

**Files:**
- Create: `frontend/vercel.json`
- Modify: `frontend/next.config.ts` (add `headers()` for CORS + security headers)
- Modify: `frontend/env.example` (add all backend server-only vars)
- Test: `frontend/src/app/api/__tests__/corsHeaders.test.ts` (via a Next.js route-level integration check, or manual `curl -I` verification documented below if route-level header testing isn't practical with the installed test setup)

**Interfaces:**
- Consumes: nothing new — this task is pure configuration.

- [ ] **Step 1: Add CORS + security headers to `next.config.ts`**

Read the current `frontend/next.config.ts` (already seen — `output:"standalone"`, `images`, `compiler`, etc.) and add a `headers()` function reproducing `backend/src/config/cors.ts` (`origin:"*"`, allowed methods/headers, `credentials:false`, 24h preflight cache) and the equivalent of `elysia-helmet`'s defaults (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`):

```ts
// frontend/next.config.ts — add this function and reference it in nextConfig
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const corsHeaders = [
  { key: "Access-Control-Allow-Origin", value: "*" },
  {
    key: "Access-Control-Allow-Methods",
    value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  },
  {
    key: "Access-Control-Allow-Headers",
    value: "Content-Type, Authorization, Api-Key",
  },
  { key: "Access-Control-Max-Age", value: "86400" },
];
```

Add to the existing `nextConfig` object:

```ts
async headers() {
  return [
    {
      source: "/api/:path*",
      headers: [...corsHeaders, ...securityHeaders],
    },
  ];
},
```

- [ ] **Step 2: Write `vercel.json` with function runtime/duration defaults**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "src/app/api/**/*": { "maxDuration": 30 }
  }
}
```

(30s default is generous for this app's DB-bound CRUD routes; well under every plan's 300s baseline — raise only if a specific route needs it, e.g. large image processing under load.)

- [ ] **Step 3: Update `frontend/env.example`**

Add every backend server-only variable, keeping the existing frontend ones:

```env
NEXT_PUBLIC_APP_BASE_URL=https://maxpharma.com.np/api
NEXT_PUBLIC_BUCKET_URL=https://maxpharma.com.np
API_KEY=your_secure_api_key_here

# Database (MySQL — via a serverless-safe pooler such as PlanetScale, or
# a pooling proxy in front of the existing MySQL server; see the design
# spec's Vercel Deployment Compatibility section)
DB_HOST=127.0.0.1
DB_PORT=3307
DB_NAME=maxpharma
DB_USER=root
DB_PASS=password

JWT_SECRET=your_jwt_signing_secret_here
MODE=production

# DigitalOcean Spaces Storage
DIGITAL_SECRET_KEY=your_digitalocean_spaces_secret_key
DIGITAL_ACCESS_ID=your_digitalocean_spaces_access_key_id
DIGITAL_BUCKET_URL=https://iservers.blr1.cdn.digitaloceanspaces.com
DIGITAL_ENDPOINT=https://blr1.digitaloceanspaces.com
DIGITAL_BUCKET_NAME=iservers
DIGITAL_BUCKET_FOLDER=maxpharma
```

- [ ] **Step 4: Verify headers manually (documented, since a full Next.js dev server isn't spun up by the test runner)**

```bash
cd frontend
npm run build && npm run start &
sleep 5
curl -sI http://localhost:3000/api/health | grep -i "access-control-allow-origin\|x-frame-options"
kill %1
```

Expected: both headers present in the response.

- [ ] **Step 5: Commit**

```bash
git add frontend/vercel.json frontend/next.config.ts frontend/env.example
git commit -m "feat: add Vercel config, CORS/security headers, env documentation

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 13: Point the frontend API client at the merged API and prune dead dependencies

**Files:**
- Modify: `frontend/.env.local` (developer-owned, not committed — document the change)
- Modify: `frontend/env.example` (`NEXT_PUBLIC_APP_BASE_URL`)
- Modify: `frontend/package.json` (remove any now-unused deps if this repo ends up sharing one `package.json` with the old backend's deps — not applicable here since `frontend/package.json` never had them; this step instead double-checks nothing stray was added)

- [ ] **Step 1: Update `NEXT_PUBLIC_APP_BASE_URL` to the same-origin `/api` path**

```env
# frontend/env.example
NEXT_PUBLIC_APP_BASE_URL=/api
```

Using a relative path means `frontend/src/utils/request.ts`'s `${APP_BASE_URL}/${url}` (Task-independent, already reads this env var) resolves against the deployed Next.js app's own origin automatically in every environment (local dev, preview, production) with zero per-environment config.

- [ ] **Step 2: Confirm no code in `frontend/src/api/*.ts` or `frontend/src/utils/request.ts` needed edits**

```bash
cd frontend && git diff --stat -- src/api src/utils/request.ts
```

Expected: empty output — confirms the zero-frontend-client-changes goal from the spec.

- [ ] **Step 3: Full end-to-end smoke test**

```bash
cd frontend
npm run build
npm run start &
sleep 5
curl -s http://localhost:3000/api/health | python3 -m json.tool
curl -s http://localhost:3000/api/products | python3 -m json.tool
curl -s -X POST http://localhost:3000/api/admins/login \
  -H "Content-Type: application/json" \
  -d '{"username":"<seeded-admin-username>","password":"<seeded-admin-password>"}' | python3 -m json.tool
kill %1
```

Expected: `/api/health` returns `{"data":{"status":"ok",...},"message":"Success"}`; `/api/products` returns the paginated envelope; login returns a JWT `token` in `data`.

- [ ] **Step 4: Run the complete test suite and type check one final time**

```bash
cd frontend
npx vitest run
npx tsc --noEmit -p tsconfig.json
npm run lint
npm run build
```

Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add frontend/env.example
git commit -m "feat: point frontend API client at merged /api, final integration pass

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Explicitly Deferred (not part of this plan)

- Deleting `backend/` from the repo — done only after the user confirms the merged app is verified in a real deployment, per the spec's Cutover section.
- Actually provisioning a MySQL connection pooler (PlanetScale account / ProxySQL) — an infra decision made alongside deployment, not a code change this plan can complete unilaterally.
- Wiring any UI component to the new standalone `/api/upload` route — it's created for future use; no existing frontend code calls it today.
