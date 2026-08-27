import { defineConfig } from "vite";
export default defineConfig({
  // GitHub Actions supplies the repository path. Local previews use the root.
  base: process.env.VITE_BASE_PATH || "/",
  server: process.env.CODEX_SANDBOX === "seatbelt"
    ? { watch: { useFsEvents: false, usePolling: true } }
    : undefined,
});
