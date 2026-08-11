import puppeteer from 'puppeteer-core';

const CHROME = '/home/azul/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';

const jobs = [
  ['/home/azul/personal-site/index.html', '/home/azul/personal-site/cv/CV_Daniel_Cruz_PhD.pdf'],
  ['/home/azul/personal-site/cv/CV_Daniel_Cruz_PhD_UCD_Parnell.html',
   '/home/azul/personal-site/cv/CV_Daniel_Cruz_PhD_UCD_Parnell.pdf'],
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args: ['--no-sandbox', '--font-render-hinting=none'],
});

for (const [src, out] of jobs) {
  const page = await browser.newPage();
  // force the light scheme so the dark-mode block can never leak into print
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await page.goto('file://' + src, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });
  await page.close();
  console.log('wrote', out);
}

await browser.close();
