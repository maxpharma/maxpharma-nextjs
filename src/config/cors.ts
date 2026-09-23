import { cors } from "@elysiajs/cors";
const corsOptions = cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Api-Key"],
  // Cannot use credentials:true with origin:"*" — browsers block it (CORS spec)
  credentials: false,
  maxAge: 86400, // cache preflight for 24h instead of 5s
});

export default corsOptions;