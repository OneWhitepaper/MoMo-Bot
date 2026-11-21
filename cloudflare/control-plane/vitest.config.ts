import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));
const TEST_AUTH_SECRET = "test-only-better-auth-secret-with-more-than-32-characters";
const TEST_CLOUDFLARE_TOKEN = "test-only-cloudflare-api-token-with-no-real-access";
const wranglerPath = fileURLToPath(new URL("./wrangler.local.jsonc", import.meta.url));
process.env.BETTER_AUTH_SECRET = TEST_AUTH_SECRET;
process.env.CLOUDFLARE_API_TOKEN = TEST_CLOUDFLARE_TOKEN;

export default defineConfig({
  plugins: [
    cloudflareTest(async () => ({
      wrangler: { configPath: wranglerPath },
      miniflare: {
        bindings: {
          BETTER_AUTH_SECRET: TEST_AUTH_SECRET,
          CLOUDFLARE_API_TOKEN: TEST_CLOUDFLARE_TOKEN,
          BETTER_AUTH_URL: "https://auth.momobot.test",
          OMB_DNS_RECORD_LIMIT: "3500",
          OMB_TUNNEL_RECLAIM: "on",
          OMB_CLEANUP_SWEEP_LIMIT: "20",
          TEST_MIGRATIONS: await readD1Migrations(`${root}migrations`),
        },
        // An empty database for migration tests that need data written by an
        // older schema before the next migration runs.
        d1Databases: ["MIGRATION_DB", "PUSH_MIGRATION_DB"],
      },
    })),
  ],
  test: {
    include: ["test/**/*.test.ts"],
    setupFiles: ["./test/setup.ts"],
  },
});
