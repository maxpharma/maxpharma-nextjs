import { helmet } from "elysia-helmet";
const helmetOptions = helmet({
  contentSecurityPolicy: false,
  frameguard: { action: "deny" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  // Allow cross-origin fetch from Next.js frontend
  crossOriginResourcePolicy: { policy: "cross-origin" },
  // elysia-helmet bug: originAgentCluster also writes Cross-Origin-Resource-Policy: ?1
  // which overwrites our crossOriginResourcePolicy setting — disable it
  originAgentCluster: false,
  // Disable COOP — same-origin can break cross-origin window features
  crossOriginOpenerPolicy: false,
});

export default helmetOptions;