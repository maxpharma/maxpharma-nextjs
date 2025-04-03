import { Elysia } from "elysia";
import corsOptions from "./cors";
import helmetOptions from "./helmet";
import checkApiKey from "../middleware/checkApiKey";
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
  return new Response(Bun.gzipSync(new TextEncoder().encode(text)), {
    status,
    headers: {
      "Content-Type": `${
        isJson ? "application/json" : "text/plain"
      }; charset=utf-8`,
    },
  });
});

server
  .use(corsOptions)
  .use(helmetOptions)
  .onRequest(async (context: any) => {
    const client = server?.server!?.requestIP(context.request);
    const address = `${client?.address}-${context.request.path}`;
    const currentTime = Date.now();
    if (!client) {
      throw new Error("Client Id not found");
    }
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

  .get("/test", () => {
    return {
      message: "Api is Working",
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
