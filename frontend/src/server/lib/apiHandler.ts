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
