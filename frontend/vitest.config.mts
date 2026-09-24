import { defineConfig } from "vitest/config";
import path from "path";

// ponytail: mirrors tsconfig.json's "@/*" -> "./src/*" path alias for
// vitest's module resolver (tsc/Next.js resolve it themselves; vitest
// needs it spelled out here too). Add more aliases here only if
// tsconfig.json grows more of them.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
