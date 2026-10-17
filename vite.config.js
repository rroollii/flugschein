import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Alles (JS, CSS, Inhalte) wird in eine einzige index.html eingebettet. Dadurch läuft die Seite
// per Doppelklick (file://) ebenso wie unter https://rroollii.github.io/flugschein/.
// BASE_PATH steuert nur Manifest/Service-Worker-Scope (siehe scripts/postbuild.mjs).
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile({ removeViteModuleLoader: true })],
  build: { outDir: 'dist', emptyOutDir: true, chunkSizeWarningLimit: 5000, assetsInlineLimit: 100_000_000 },
});
