import { Elysia } from "elysia";
import corsOptions from "./cors";
import helmetOptions from "./helmet";
import checkApiKey from "../middleware/checkApiKey";
import db from "./db";
const requestCounts = new Map<string, { count: number; timestamp: number }>();
const windowMs: number = 60 * 1000;
const maxRequests: number = 80;
const server: any = new Elysia({
  serve: {
    maxRequestBodySize: 1024 * 1024 * 256,
  },
}).mapResponse(({ response, set }) => {
  const isJson = typeof response === "object";
  const text = isJson ? JSON.stringify(response) : (response?.toString() ?? "");
  set.headers["Content-Encoding"] = "gzip";
  const status: any = set.status || 200;
  return new Response(Bun.gzipSync(new TextEncoder().encode(text)) as unknown as BodyInit, {
    status,
    headers: {
      "Content-Type": `${isJson ? "application/json" : "text/plain"
        }; charset=utf-8`,
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
