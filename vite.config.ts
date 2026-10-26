// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

function validateEnvPlugin(): Plugin {
  return {
    name: "validate-site-url",
    configResolved(config) {
      if (config.command === "build" && config.mode === "production") {
        const siteUrl = process.env.VITE_SITE_URL || config.env?.VITE_SITE_URL;
        if (!siteUrl || !String(siteUrl).trim()) {
          throw new Error(
            "\n\n❌ [BUILD ERROR] La variable d'environnement VITE_SITE_URL est obligatoire en production (ex: https://landryit.com).\n" +
            "Veuillez définir VITE_SITE_URL dans vos variables de déploiement Vercel ou dans votre .env.\n\n"
          );
        }
      }
    },
  };
}

function sitemapRobotsPlugin(): Plugin {
  return {
    name: "generate-sitemap-robots",
    async buildStart() {
      try {
        const { generateSitemapAndRobots } = await import("./scripts/generate-sitemap-robots.mjs");
        await generateSitemapAndRobots();
      } catch (err) {
        console.warn("⚠️ [sitemapRobotsPlugin] Note:", (err as Error).message);
      }
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [validateEnvPlugin(), sitemapRobotsPlugin()],
  },
});
