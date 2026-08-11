// Renders the CV pages to A4 PDFs with headless Chromium.
//   npx puppeteer browsers install chrome && npm install puppeteer-core && node print.mjs
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import puppeteer from 'puppeteer-core';

const here = dirname(fileURLToPath(import.meta.url));

// puppeteer installs Chromium under ~/.cache/puppeteer/chrome/<build>/chrome-linux64/chrome
function findChrome() {
  const root = resolve(homedir(), '.cache/puppeteer/chrome');
  if (!existsSync(root)) return null;
  return readdirSync(root)
    .sort()
    .map((build) => resolve(root, build, 'chrome-linux64/chrome'))
    .filter(existsSync)
    .pop();
}
const CHROME = process.env.CHROME_PATH ?? findChrome();
if (!CHROME || !existsSync(CHROME)) {
  console.error('No Chromium found. Run: npx puppeteer browsers install chrome');
  process.exit(1);
}

const jobs = [
  ['index.html', 'cv/CV_Daniel_Cruz_PhD.pdf'],
  ['cv/CV_Daniel_Cruz_PhD_UCD_Parnell.html', 'cv/CV_Daniel_Cruz_PhD_UCD_Parnell.pdf'],
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args: ['--no-sandbox', '--font-render-hinting=none'],
});

for (const [src, out] of jobs) {
  const page = await browser.newPage();
  // Force the light scheme: both pages carry a prefers-color-scheme: dark block,
  // and without this a PDF printed from a dark-themed browser comes out dark.
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await page.goto('file://' + resolve(here, src), { waitUntil: 'networkidle0' });
  await page.pdf({
    path: resolve(here, out),
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });
  await page.close();
  console.log('wrote', out);
}

await browser.close();
