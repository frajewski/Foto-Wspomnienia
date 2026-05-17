#!/usr/bin/env node
/**
 * Generuje ikony aplikacji z `assets/images/icon-source.svg`.
 *
 * Użycie:
 *   node scripts/generate-icons.mjs
 *
 * Wymaga: devDependency `sharp` (już w package.json).
 * Jeśli sharp jest niedostępny (np. środowisko bez native deps), skrypt
 * wyświetla instrukcję manualnej konwersji i wraca z kodem 1.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const sourceSvg = resolve(projectRoot, 'assets/images/icon-source.svg');
const outDir = resolve(projectRoot, 'assets/images');

if (!existsSync(sourceSvg)) {
  console.error(`✗ Brak źródłowego SVG: ${sourceSvg}`);
  process.exit(1);
}

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (e) {
  console.error('✗ Pakiet "sharp" jest niedostępny.');
  console.error('  Konwersja manualna:');
  console.error('  1. Otwórz assets/images/icon-source.svg w Inkscape/Figma/online converter.');
  console.error('  2. Wyeksportuj jako PNG 1024x1024 → assets/images/icon.png');
  console.error('  3. Powtórz dla splash-icon.png (1024x1024) i favicon.png (48x48).');
  console.error('');
  console.error('Lub zainstaluj sharp: npm install --save-dev sharp');
  process.exit(1);
}

const svgBuffer = readFileSync(sourceSvg);

/**
 * Konfiguracja ikon:
 * - icon.png: główna ikona aplikacji (iOS i Android base)
 * - splash-icon.png: ekran startowy (Expo skaluje do imageWidth z app.json)
 * - favicon.png: web (mała)
 * - android-icon-foreground.png: warstwa pierwszego planu Android adaptive icon
 *   (transparent background — Android dokłada własne tło + maskę)
 */
const targets = [
  { name: 'icon.png', size: 1024, background: false },
  { name: 'splash-icon.png', size: 1024, background: false },
  { name: 'favicon.png', size: 48, background: false },
  { name: 'android-icon-foreground.png', size: 1024, background: 'transparent' },
];

for (const target of targets) {
  let pipeline = sharp(svgBuffer).resize(target.size, target.size);
  if (target.background === 'transparent') {
    // Adaptive icon foreground: zrezygnuj z gradientu tła zachowanego w SVG.
    // Sharp nie usuwa wewnętrznego tła z SVG; tu po prostu generujemy ten sam
    // obraz i zostawiamy Androidowi maskowanie. Można przyciąć w przyszłości.
  }
  await pipeline.png().toFile(resolve(outDir, target.name));
  console.log(`✓ ${target.name} (${target.size}×${target.size})`);
}

console.log('\nGotowe. Jeśli zmodyfikujesz icon-source.svg, uruchom ten skrypt ponownie.');
