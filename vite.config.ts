import { defineConfig, CommonServerOptions } from "vite";
import process from "node:process";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import fs from 'fs';
import path from 'path';

const getHttpsOptions = () => {
  try{
    return {
      key: fs.readFileSync(path.resolve(__dirname, 'certs', 'private.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs', 'certificate.crt')),
    }
  } catch(e){
    const errorCause = e instanceof Error ? e : new Error(String(e));
    throw new Error(`Could not find certificate files for https. Be sure, that you created them before: "${errorCause}"`, {cause: errorCause})
  }
}
const isHttps = process.env.VITE_HTTPS === 'true';
const https: CommonServerOptions['https'] | undefined = isHttps ? getHttpsOptions() : undefined;
import { displayNetworkUrlWithHostnamePlugin } from './config/vite-plugins/vite-display-network-url-hostname-plugin';

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
      displayNetworkUrlWithHostnamePlugin(),
    ],
    preview: {
      port: 3000,
      https,
      strictPort: true,
    },
    server: {
      https,
      port: 3000,
      strictPort: true
    },
  });
