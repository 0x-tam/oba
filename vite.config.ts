import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';
import { existsSync, readFileSync } from 'node:fs';

export default defineConfig(async () => {
  const useNitro = process.env.VERCEL === '1' || !!process.env.NITRO_PRESET || !existsSync('.openai/hosting.json');
  const shared = {
    ssr: { noExternal: ['tailwindcss', 'tw-animate-css', 'shadcn'] },
    worker: { format: 'es' as const },
    css: { postcss: { plugins: [tailwindcss()] } },
    server: process.env.CODEX_SANDBOX === 'seatbelt'
      ? { watch: { useFsEvents: false, usePolling: true } } : undefined,
  };
  if (useNitro) {
    const { nitro } = await import('nitro/vite');
    return { ...shared, plugins: [vinext(), nitro()] };
  }
  // Sites uses its own Worker output; it is independent of the Vercel build.
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';
  const { cloudflare } = await import('@cloudflare/vite-plugin');
  const { d1, r2 } = JSON.parse(readFileSync('.openai/hosting.json', 'utf8'));
  return {
    ...shared,
    plugins: [vinext(), sites(), cloudflare({
      viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
      config: {
        main: 'vinext/server/fetch-handler', compatibility_flags: ['nodejs_compat'],
        d1_databases: d1 ? [{ binding: d1, database_name: 'site-creator-d1', database_id: '00000000-0000-4000-8000-000000000000' }] : [],
        r2_buckets: r2 ? [{ binding: r2, bucket_name: 'site-creator-r2' }] : [],
      },
    })],
  };
});
