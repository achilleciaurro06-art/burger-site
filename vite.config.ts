import { defineConfig, createServer, type Plugin, type ResolvedConfig, type ViteDevServer } from 'vite';

/**
 * Pre-render: inietta nell'index.html l'HTML generato da src/render (contenuti da src/config).
 * Risultato: pagina indicizzabile, primo paint immediato e nessuna duplicazione del markup.
 * Il codice client (src/main.ts) si limita ad "attivare" il DOM esistente.
 */
function prerender(): Plugin {
  let config: ResolvedConfig;
  let dev: ViteDevServer | undefined;
  const load = async () => {
    if (dev) return { mod: await dev.ssrLoadModule('/src/render/index.ts'), close: async () => {} };
    const s = await createServer({
      configFile: false,
      root: config.root,
      base: config.base,
      appType: 'custom',
      logLevel: 'silent',
      server: { middlewareMode: true, hmr: false, watch: null },
      optimizeDeps: { noDiscovery: true },
    });
    return { mod: await s.ssrLoadModule('/src/render/index.ts'), close: () => s.close() };
  };
  return {
    name: 'prerender-html',
    configResolved(c) {
      config = c;
    },
    configureServer(s) {
      dev = s;
    },
    handleHotUpdate({ file, server }) {
      if (/\/src\/(config|render)\//.test(file)) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
    async transformIndexHtml(html) {
      const { mod, close } = await load();
      try {
        return html.replace('<!--seo-->', mod.renderHead()).replace('<!--app-->', mod.renderApp());
      } finally {
        await close();
      }
    },
  };
}

export default defineConfig({
  plugins: [prerender()],
  build: { target: 'es2022', cssMinify: true },
});
