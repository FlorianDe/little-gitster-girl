import { ViteDevServer, Plugin } from "vite";
import os from 'os';

export function displayNetworkUrlWithHostnamePlugin(): Plugin {
    return {
      name: 'hostname-display',
      configureServer(server: ViteDevServer) {
        const isHostFlagEnabled = server.config.server.host === true || server.config.server.host === '0.0.0.0';
        if(isHostFlagEnabled){
          const originalPrintUrls = server.printUrls;
          server.printUrls = () => {
            originalPrintUrls();
            const protocol = server.config.server.https ? 'https' : 'http';
            const hostname = os.hostname();
            const port = server.config.server.port;
            const base = server.config.base || '';
            const networkUrl = `${protocol}://${hostname}:${port}${base}`
  
            const green = (text: string) => `\x1b[32m${text}\x1b[0m`;
            const cyan = (text: string) => `\x1b[36m${text}\x1b[0m`;
            const bold = (text: string) => `\x1b[1m${text}\x1b[22m`;
  
            console.log(`  ${green("➜")}  ${bold("Network (via Hostname):")} ${cyan(networkUrl)}`);
          };
        }
      },
    };
  }