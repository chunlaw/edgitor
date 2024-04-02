import { ConfigEnv, defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({mode}: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), basicSsl(), VitePWA(pwaOptions)],
    server: {
      https: true,
      host: true,
      // port: parseInt(env.PORT ?? "9100", 10),
      // strictPort: true,
    },
  }
});

const pwaOptions: Partial<VitePWAOptions> = {
  mode: "development",
  base: "/",
  includeAssets: ["favicon.ico"], // as favicon.ico
  manifest: {
    short_name: "Edgitor",
    name: "Edgitor - Graph Editor",
    theme_color: "#aaa",
    icons: [
      {
        "src": "favicon.ico",
        "sizes": "64x64 32x32 24x24 16x16",
        "type": "image/x-icon"
      },
      {
        "src": "logo192.png",
        "type": "image/png",
        "sizes": "192x192"
      },
      {
        "src": "logo256.png",
        "type": "image/png",
        "sizes": "256x256"
      },
      {
        "src": "logo256.png",
        "type": "image/png",
        "sizes": "512x512"
      }
    ],
    display: 'standalone',
  },
  devOptions: {
    enabled: process.env.SW_DEV === "true",
    type: "module",
    navigateFallback: "index.html"
  },
  registerType: "autoUpdate",
  workbox: {
    runtimeCaching: [
      // for lazy caching anything
      // reference to https://vite-pwa-org.netlify.app/workbox/generate-sw.html#cache-external-resources 
    ]
  }
}
