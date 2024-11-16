import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import process from "node:process";
import { defineConfig } from "vite";
import { displayNetworkUrlWithHostnamePlugin } from './config/vite-plugins/vite-display-network-url-hostname-plugin';
import { selfSignedHttpsSupportPlugin } from './config/vite-plugins/vite-self-signed-https-support-plugin';

const isSentryDisabled = !(process.env.SENTRY_PLUGIN_ENABLED == "true")

// https://vite.dev/config/
export default defineConfig({
    base: "/little-gitster-girl",
    build: {
      sourcemap: true,
    },
    plugins: [
      !isSentryDisabled && sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        disable: isSentryDisabled // Seems like the sentry-vite-plugin not perfectly adapts to the disable option: https://github.com/getsentry/sentry-javascript-bundler-plugins/blob/main/packages/bundler-plugin-core/src/index.ts#L83-L101
      }),
      react(),
      displayNetworkUrlWithHostnamePlugin(),
      selfSignedHttpsSupportPlugin(),
    ],
    preview: {
      port: 3000,
      strictPort: true
    },
    server: {
      port: 3000,
      strictPort: true
    },
  });
