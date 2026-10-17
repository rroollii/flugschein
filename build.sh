#!/usr/bin/env bash
# Baut die Flugschein-Plattform aus den aktuellen Inhalten in docs/.
#
#   bash build.sh                 → baut nach ../../docs/plattform (Standard)
#   bash build.sh --repo <ordner> → stellt zusätzlich ein push-fertiges Repo für rroollii/flugschein zusammen
#
# Umgebungsvariablen (optional):
#   CONTENT_DIR  Inhaltsordner (Standard: ../../docs relativ zu diesem Skript)
#   OUT_DIR      Ausgabeordner (Standard: ../../docs/plattform)
#   BASE_PATH    Hosting-Pfad für Manifest/PWA (Standard: /flugschein/ für GitHub Pages; ./ = relativ)
#   WORK_DIR     temporäres Arbeitsverzeichnis für node_modules (Standard: $TMPDIR/flugschein-build)
#
# Hintergrund: Der Projekt-Store erlaubt keine Symlinks, daher wird in einem temporären
# Arbeitsverzeichnis installiert und gebaut; das Ergebnis wird nach OUT_DIR geschrieben.
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR=""
if [[ "${1:-}" == "--repo" ]]; then REPO_DIR="${2:?Zielordner fehlt}"; fi

# Im exportierten Repo (Ordner inhalte/ vorhanden) gelten inhalte/ → _site/ als Standard
if [[ -d "$SRC/inhalte" ]]; then DEF_CONTENT="$SRC/inhalte"; DEF_OUT="$SRC/_site"; else DEF_CONTENT="$SRC/../../docs"; DEF_OUT="$SRC/../../docs/plattform"; fi
export CONTENT_DIR="$(cd "${CONTENT_DIR:-$DEF_CONTENT}" && pwd)"
export OUT_DIR="${OUT_DIR:-$DEF_OUT}"
mkdir -p "$OUT_DIR"
export OUT_DIR="$(cd "$OUT_DIR" && pwd)"
export BASE_PATH="${BASE_PATH:-/flugschein/}"
WORK="${WORK_DIR:-${TMPDIR:-/tmp}/flugschein-build}"

command -v node >/dev/null || { echo "Node.js (≥ 18) wird benötigt." >&2; exit 1; }

echo "▶ Quellen:  $SRC"
echo "▶ Inhalte:  $CONTENT_DIR"
echo "▶ Ausgabe:  $OUT_DIR"
# Kopiert Quellen ohne node_modules/Build-Artefakte (Node statt tar/cp: robust auf dem Store-Dateisystem)
copy_src() {
  node -e '
    const fs = require("fs"), path = require("path");
    const [src, dst] = process.argv.slice(1);
    const skip = new Set(["node_modules", "dist", "_site", "generated"]);
    const copy = (s, d) => {
      if (skip.has(path.basename(s))) return;
      if (fs.statSync(s).isDirectory()) {
        fs.mkdirSync(d, { recursive: true });
        for (const f of fs.readdirSync(s)) copy(path.join(s, f), path.join(d, f));
      } else fs.writeFileSync(d, fs.readFileSync(s));
    };
    copy(src, dst);
  ' "$1" "$2"
}
mkdir -p "$WORK"
copy_src "$SRC" "$WORK"

cd "$WORK"
if [[ ! -d node_modules ]] || ! cmp -s package-lock.json node_modules/.package-lock-src.json; then
  echo "▶ Installiere Abhängigkeiten …"
  npm ci --no-audit --no-fund
  cp package-lock.json node_modules/.package-lock-src.json
fi
npm run build

if [[ -n "$REPO_DIR" ]]; then
  echo "▶ Stelle Repo-Inhalt zusammen: $REPO_DIR"
  mkdir -p "$REPO_DIR"
  copy_src "$SRC" "$REPO_DIR"
  rm -rf "$REPO_DIR/inhalte" && mkdir -p "$REPO_DIR/inhalte"
  for x in "$CONTENT_DIR"/*.md "$CONTENT_DIR"/skripte "$CONTENT_DIR"/fragen "$CONTENT_DIR"/zusatzausbildungen "$CONTENT_DIR"/checklisten "$CONTENT_DIR"/funkuebungen; do
    [[ -e "$x" ]] && copy_src "$x" "$REPO_DIR/inhalte/$(basename "$x")"
  done
  echo "  Fertig. Im Repo baut .github/workflows/pages.yml automatisch nach GitHub Pages."
fi
echo "✔ Fertig."
