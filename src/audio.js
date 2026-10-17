// Natürliche Stimmen: vorab gerenderte Audiodateien (Branch `audio`, veröffentlicht unter ./audio/).
// Wird erst geladen, wenn ./audio/manifest.json existiert; sonst bleibt die Gerätestimme aktiv.
// Die Zuordnung Manifest → Clip (clipFor) wird an das endgültige Manifest-Schema angepasst.

let manifestPromise = null;
export function getManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch('audio/manifest.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return manifestPromise;
}

function clipFor(manifest, type, id, index) {
  const clips = manifest?.funk?.[id] || manifest?.clips?.[`${type}:${id}:${index}`];
  if (Array.isArray(clips)) return clips[index] || null;
  return clips || null;
}

export async function hasClip(type, id, index) {
  const m = await getManifest();
  return !!clipFor(m, type, id, index);
}

let current = null;
export async function playClip(type, id, index) {
  const m = await getManifest();
  const c = clipFor(m, type, id, index);
  if (!c) return false;
  current?.pause();
  const a = new Audio(`audio/${typeof c === 'string' ? c : c.file || c.src}`);
  current = a;
  return new Promise((resolve) => {
    a.onended = () => resolve(true);
    a.onerror = () => resolve(false);
    a.play().catch(() => resolve(false));
  });
}
export const stopClip = () => { current?.pause(); current = null; };
