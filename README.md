# 00danielcruz11-lang.github.io

Personal site of Daniel Cruz Gutiérrez — environmental data scientist working on
climate, energy and geospatial risk.

Live at **https://00danielcruz11-lang.github.io/**

## Contents

| Path | What it is |
| --- | --- |
| `index.html` | Homepage — the general-purpose PhD CV. Canonical public version. |
| `cv/CV_Daniel_Cruz_PhD.pdf` | Print version of the homepage CV (A4, 3 pages). |
| `research/phd_proposal_bogota_2column_onepage.pdf` | One-page PhD research proposal on climate spells and urban resilience in Bogotá. |

Supervisor-tailored CVs are deliberately **not** published here — they're sent as
direct attachments to the application in question.

Research code and project write-ups live in a separate repository:
[phd-data-science-portfolio](https://github.com/00danielcruz11-lang/phd-data-science-portfolio).

## Regenerating the PDFs

The PDFs are rendered from the HTML with headless Chromium, so the print
stylesheet in each file is the single source of truth for layout.

```bash
npx puppeteer browsers install chrome
npm install puppeteer-core
node print.mjs   # printBackground: true, preferCSSPageSize: true,
                 # and prefers-color-scheme forced to light
```

Forcing the light colour scheme matters: both pages carry a
`prefers-color-scheme: dark` block, and without the override a PDF printed from a
dark-themed browser comes out dark.
