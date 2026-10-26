// Erzeugt src/data/audio.ts mit statischen require()-Aufrufen für alle MP3s in assets/audio/<stimme>/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'assets/audio');
const zeilen = ['// Automatisch erzeugt von scripts/audio-index.mjs – nicht von Hand bearbeiten.', 'export const AUDIO: Record<string, Record<string, number>> = {'];
for (const stimme of fs.readdirSync(dir).sort()) {
  zeilen.push(`  ${stimme}: {`);
  for (const f of fs.readdirSync(path.join(dir, stimme)).filter((f) => f.endsWith('.mp3')).sort()) {
    zeilen.push(`    '${f.replace(/\.mp3$/, '')}': require('../../assets/audio/${stimme}/${f}'),`);
  }
  zeilen.push('  },');
}
zeilen.push('};', '');
fs.writeFileSync(path.join(root, 'src/data/audio.ts'), zeilen.join('\n'));
console.log('✔ src/data/audio.ts');
