import { Elysia } from "elysia";
import corsOptions from "./cors";
import helmetOptions from "./helmet";
import checkApiKey from "../middleware/checkApiKey";
import db from "./db";
const requestCounts = new Map<string, { count: number; timestamp: number }>();
const windowMs: number = 60 * 1000;
const maxRequests: number = 80;

// Periodic cleanup of expired rate limiter records to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now - record.timestamp > windowMs) {
      requestCounts.delete(key);
    }
  }
}, 60 * 1000).unref();

const server: any = new Elysia({
  serve: {
    maxRequestBodySize: 1024 * 1024 * 32, // 32MB max request body to prevent OOM
  },
}).mapResponse(({ response, set, request }) => {
  const isJson = typeof response === "object";
  const text = isJson ? JSON.stringify(response) : (response?.toString() ?? "");
  const status: any = set.status || 200;
  const contentType = isJson ? "application/json; charset=utf-8" : "text/plain; charset=utf-8";

  // Only compress large responses (> 1KB) if client accepts gzip, saving CPU on small payloads
  const acceptEncoding = request?.headers?.get?.("accept-encoding") || "";
  const shouldCompress = text.length > 1024 && acceptEncoding.includes("gzip");

  if (shouldCompress) {
    set.headers["Content-Encoding"] = "gzip";
    return new Response(Bun.gzipSync(new TextEncoder().encode(text)) as unknown as BodyInit, {
      status,
      headers: {
        "Content-Type": contentType,
        "Content-Encoding": "gzip",
      },
    });
  }

  return new Response(text, {
    status,
    headers: {
      "Content-Type": contentType,
    },
  });
});

server
  .use(corsOptions)
  .use(helmetOptions)
  .onRequest(async (context: any) => {
    const path = context.request?.url ? new URL(context.request.url).pathname : (context.request?.path || "");
    if (path === "/health" || path === "/api/health") {
      return;
    }
    const client = server?.server?.requestIP ? server.server.requestIP(context.request) : null;
    const ip = client?.address || context.request?.headers?.get?.("x-forwarded-for") || "127.0.0.1";
    const address = `${ip}-${path}`;
    const currentTime = Date.now();
    const record: any = requestCounts.get(address);
    if (!record) {
      requestCounts.set(address, { count: 1, timestamp: currentTime });
    } else {
      const timeElapsed = currentTime - record.timestamp;
      if (timeElapsed > windowMs) {
        requestCounts.set(address, { count: 1, timestamp: currentTime });
      } else if (record.count >= maxRequests) {
        throw new Error("You have exceeded you limit");
      } else {
        record.count++;
      }
    }
  })
  .onBeforeHandle(async ({ request }: any) => {
    // await checkApiKey(request);
  })

  .get("/api", () => {
    return {
      message: "Api is Working",
    };
  })
  .get("/health", async () => {
    let dbStatus = "connected";
    try {
      await db.authenticate();
    } catch {
      dbStatus = "disconnected";
    }
    return {
      status: "ok",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: dbStatus,
    };
  })
  .get("/api/health", async () => {
    let dbStatus = "connected";
    try {
      await db.authenticate();
    } catch {
      dbStatus = "disconnected";
    }
    return {
      status: "ok",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: dbStatus,
    };
  });

server.onError(({ error, set }: any) => {
  switch (error.message) {
    case "jwt expired":
      set.status = 401;
      break;
    case "Unauthorized":
      set.status = 401;
      break;
    case "Invalid API Key":
      set.status = 401;
      break;
    default:
      set.status = 500;
      break;
  }
  console.log(error.message, set.status);
  return {
    message: error.message.replaceAll("Error: ", "") || "Forbidden",
    success: false,
    statusCode: set.status,
  };
});
export default server;
