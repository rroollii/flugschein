// Erzeugt App-Icons, Splash und Web-Icons aus assets/quellen/icon.svg: npm i --no-save sharp && node scripts/icons-erzeugen.cjs assets
const sharp = require('sharp'); const fs = require('fs');
const dir = process.argv[2];
const svg = fs.readFileSync(dir + '/quellen/icon.svg', 'utf8');
const motiv = svg.match(/<g id="motiv">[\s\S]*?<\/g>\s*<\/svg>/)[0].replace(/<\/svg>$/, '');
const nurMotiv = (scale, farbe) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><g transform="translate(${512 - 512 * scale} ${512 - 512 * scale}) scale(${scale})">${farbe ? motiv.replace(/#[0-9a-f]{6}/gi, farbe) : motiv}</g></svg>`;
(async () => {
  await sharp(Buffer.from(svg)).resize(1024, 1024).flatten({ background: '#070b10' }).png().toFile(dir + '/icon.png');
  await sharp(Buffer.from(svg)).resize(48, 48).png().toFile(dir + '/favicon.png');
  await sharp(Buffer.from(svg)).resize(192, 192).png().toFile(dir + '/../public/icon-192.png');
  await sharp(Buffer.from(svg)).resize(512, 512).png().toFile(dir + '/../public/icon-512.png');
  await sharp(Buffer.from(svg)).resize(180, 180).flatten({ background: '#070b10' }).png().toFile(dir + '/../public/apple-touch-icon.png');
  await sharp(Buffer.from(nurMotiv(0.62))).resize(512, 512).png().toFile(dir + '/android-icon-foreground.png');
  await sharp({ create: { width: 512, height: 512, channels: 4, background: '#070b10' } }).png().toFile(dir + '/android-icon-background.png');
  await sharp(Buffer.from(nurMotiv(0.62, '#ffffff'))).resize(432, 432).png().toFile(dir + '/android-icon-monochrome.png');
  await sharp(Buffer.from(nurMotiv(0.95))).resize(1024, 1024).png().toFile(dir + '/splash-icon.png');
  console.log('ok');
})();
