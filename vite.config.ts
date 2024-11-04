import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import process from "node:process";

// https://vite.dev/config/
export default defineConfig({
    base: "/little-gitster-girl",
    build: {
      sourcemap: true,
    },
    plugins: [
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        disable: process.env.SENTRY_PLUGIN_DISABLED == "true"
      }),
      react(),
    ],
    preview: {
      port: 3000,
    },
    server: {
      port: 3000,
    },
  });
