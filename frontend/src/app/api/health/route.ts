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
