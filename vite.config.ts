import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from 'vite-plugin-pwa'
import { minimal2023Preset } from '@vite-pwa/assets-generator/config'
import { visualizer } from "rollup-plugin-visualizer";
import { displayNetworkUrlWithHostnamePlugin } from './config/vite-plugins/vite-display-network-url-hostname-plugin';
import { selfSignedHttpsSupportPlugin } from './config/vite-plugins/vite-self-signed-https-support-plugin';

const isSentryDisabled = !(process.env.SENTRY_PLUGIN_ENABLED == "true")

const externalLibs = ['canvg', 'html2canvas', 'dompurify']; // Exclude from bundling and dependency optimization

// https://vite.dev/config/
export default ({ mode }: {mode: never}) => {
  const {
    VITE_APP_NAME
  } = loadEnv(mode, process.cwd());

  return defineConfig({
      base: "/little-gitster-girl",
      build: {
        sourcemap: true,
        rollupOptions: {
          external: externalLibs,
        },
      },
      optimizeDeps: {
        exclude: externalLibs,
      },
      plugins: [
        !isSentryDisabled && sentryVitePlugin({
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          authToken: process.env.SENTRY_AUTH_TOKEN,
          disable: isSentryDisabled, // Seems like the sentry-vite-plugin not perfectly adapts to the disable option: https://github.com/getsentry/sentry-javascript-bundler-plugins/blob/main/packages/bundler-plugin-core/src/index.ts#L83-L101
        }),
        visualizer({
          template: "treemap",
          open: false,
          gzipSize: true,
          brotliSize: true,
          filename: "generated/analyse.html",
        }),
        react(),
        displayNetworkUrlWithHostnamePlugin(),
        selfSignedHttpsSupportPlugin(),
        VitePWA({
          includeAssets: ['favicon.svg'],
          manifest: {
            "short_name": VITE_APP_NAME,
            "name": VITE_APP_NAME,
            "icons": [
                {
                  src: 'pwa-64x64.png',
                  sizes: '64x64',
                  type: 'image/png'
                },
                {
                  src: 'pwa-192x192.png',
                  sizes: '192x192',
                  type: 'image/png'
                },
                {
                  src: 'pwa-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'any'  
                },
                {
                  src: 'maskable-icon-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'maskable'
                }
            ],
            "start_url": ".",
            "display": "standalone",
            "theme_color": "#000000",
            "background_color": "#ffffff"
          },
          pwaAssets: {
            preset: minimal2023Preset,
            disabled: false
            // image: "public/imgs/android_512x512.png"
          }
        })
      ],
      preview: {
        port: 3000,
        strictPort: true
      },
      server: {
        port: 3000,
        strictPort: true
      },
      worker: {
        format: 'es',
        rollupOptions: {
          external: externalLibs,
        },
      }
    });
};