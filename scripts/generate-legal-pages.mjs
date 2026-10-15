import {writeFileSync} from 'node:fs';
import {LEGAL_TITLES,legalContent} from '../legal-content.js';
for(const [id,title] of Object.entries(LEGAL_TITLES)){
 const html=`<!doctype html>
<html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><meta name="theme-color" content="#e83443"><meta name="description" content="${title} von Handelsvertretung und Stickerei Sylke Gauder."><title>${title} – Sylke Gauder Stickerei</title><link rel="icon" type="image/svg+xml" href="assets/favicon.svg"><link rel="stylesheet" href="styles.css?v=20261014-catalog"><link rel="stylesheet" href="legal.css?v=20261015-legal"></head><body><a class="skip-link" href="#main">Zum Inhalt springen</a><header class="legal-header"><div class="wrap"><a href="index.html#/"><b>SYLKE GAUDER<span class="red-word">.</span></b></a><a href="index.html#/shop">Zurück zum Sortiment ↗</a></div></header><main id="main" tabindex="-1" class="wrap prose legal-page">${legalContent(id,{standalone:true})}</main><footer class="legal-footer"><div class="wrap"><span>Handelsvertretung &amp; Stickerei Sylke Gauder</span><a href="index.html#/kontakt">Kontakt</a>${Object.entries(LEGAL_TITLES).map(([key,label])=>`<a href="${key}.html">${label}</a>`).join('')}</div></footer></body></html>\n`;
 writeFileSync(new URL(`../${id}.html`,import.meta.url),html);
}
console.log('Generated four standalone legal pages.');
