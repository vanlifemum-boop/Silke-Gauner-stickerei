import { clubById } from './club-core.js?v=20261012-catalog';
import { COLORS, THREADS, escapeHtml as e, isCamper, camperLabels } from './shop-core.js?v=20261012-catalog';

let previewId=0;

export function logoChoiceContent(brand){
 const club=clubById(brand.id);
 return `<span class="brand-option-art" aria-hidden="true">${club?.logo?`<img src="${e(club.logo)}" alt="" loading="lazy" decoding="async">`:'<span class="own-logo-symbol">＋</span>'}</span><span class="brand-option-label">${e(club?.fullName||'Eigenes Logo')}</span>`;
}

export function selectedLogoPreview(item){
 if(!isCamper(item))return '';
 const club=clubById(item.brand);
 return `${club?.logo?`<img src="${e(club.logo)}" alt="${e(club.fullName)} Logo" decoding="async">`:'<span class="own-logo-symbol" aria-hidden="true">＋</span>'}<div><span>DEIN AUSGEWÄHLTES LOGO</span><b>${e(club?.fullName||'Dein eigenes Logo')}</b></div>`;
}

// Schematic garment artwork with verified club assets where available.
export function garmentPreview(product,item,{compact=false}={}) {
 const id=`garment-${++previewId}`;
 const color=COLORS[item.color]||COLORS.Anthrazit;
 const light=item.color==='Weiß'||item.color==='Hellgrau';
 const ink=light?'#25282e':'#fff';
 const camper=isCamper(item),labels=camperLabels(item);
 const hoodie=product.garment==='hoodie',polo=product.garment==='polo';
 const silhouette=hoodie
  ?'M182 94 Q250 68 318 94 L365 118 L418 242 L446 427 L389 443 L351 243 L351 467 Q250 484 149 467 L149 243 L111 443 L54 427 L82 242 L135 118 Z'
  :'M186 80 Q200 112 250 119 Q300 112 314 80 L368 105 L444 179 L391 231 L352 198 L352 464 Q250 484 148 464 L148 198 L109 231 L56 179 L132 105 Z';
 const position=item.logoPosition||'chest';
 const large=item.logoSize==='large';
 const point=position==='sleeve'?[hoodie?381:391,hoodie?213:181]:position==='lower-left'?[large?292:306,large?409:432]:[large?292:303,190];
 const logoWidth=position==='sleeve'?(large?72:46):(large?116:76);
 const clubLogo=camper?clubById(item.brand)?.logo:null;
 const logoHeight=clubLogo?logoWidth*.78:large?27:18;
 const title=`${product.name} in ${item.color}${camper?`, ${labels.brand}, ${labels.position}, ${labels.logoSize}`:''}`;
 const word=item.brand==='own'?'DEIN LOGO':labels.brand.toLocaleUpperCase('de-DE');
 const fontSize=Math.min(large?19:12,logoWidth/(Math.max(word.length,1)*.66));
 return `<svg class="garment-art${compact?' compact':''}" viewBox="0 0 500 560" role="img" aria-label="${e(title)}" xmlns="http://www.w3.org/2000/svg">
 <defs><linearGradient id="${id}-light" x1="0" y1="0" x2="1" y2=".7"><stop stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient><filter id="${id}-shadow" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="13" flood-color="#171c27" flood-opacity=".16"/></filter></defs>
 <ellipse cx="250" cy="500" rx="126" ry="12" fill="#222a38" opacity=".05"/>
 <g filter="url(#${id}-shadow)"><path d="${silhouette}" fill="${color}" stroke="${light?'#cdd2d9':'#13171e'}" stroke-width="1.4"/><path d="${silhouette}" fill="url(#${id}-light)" stroke="none"/></g>
 <g fill="none" stroke="${ink}" stroke-opacity=".17" stroke-width="1.5"><path d="M156 454 Q250 468 344 454" stroke-dasharray="2 3"/><path d="M156 205 Q171 310 161 439 M344 205 Q329 310 339 439" stroke-opacity=".08"/>${hoodie?'<path d="m66 416 41 12m286 0 41-12M204 344h92l26 81H178Z"/>':'<path d="m65 181 44 42m282 0 44-42M136 108l20 73m208-73-20 73"/>'}</g>
 ${hoodie?`<path d="M182 97 Q174 24 250 31 Q326 24 318 97 L282 144 Q250 124 218 144Z" fill="${color}" stroke="${ink}" stroke-opacity=".2" stroke-width="2"/><path d="M197 96 Q206 58 250 55 Q294 58 303 96 L278 123 Q250 112 222 123Z" fill="#000" opacity=".17"/><path d="M224 138v67m52-67v67" stroke="${ink}" stroke-width="2" stroke-opacity=".6"/>`:polo?`<path d="m186 80 30 53 34-21 34 21 30-53-44 26h-40Z" fill="${color}" stroke="${ink}" stroke-opacity=".26"/><path d="M244 119h12v60h-12Z" fill="#000" opacity=".15"/><g fill="${ink}" opacity=".65"><circle cx="250" cy="137" r="2"/><circle cx="250" cy="158" r="2"/></g>`:`<path d="M189 84 Q205 121 250 125 Q295 121 311 84" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="11"/><path d="M191 87 Q207 125 250 128 Q293 125 309 87" fill="none" stroke="${ink}" stroke-opacity=".22" stroke-width="1.2" stroke-dasharray="2 2"/>`}
 ${camper?`<g transform="translate(${point[0]} ${point[1]})${position==='sleeve'?' rotate(32)':''}"><rect x="${-logoWidth/2-7}" y="${-logoHeight/2-6}" width="${logoWidth+14}" height="${logoHeight+12}" rx="4" fill="${ink}" fill-opacity=".035" stroke="${ink}" stroke-opacity=".45" stroke-width=".8" stroke-dasharray="3 3"/>${clubLogo?`<image href="${e(clubLogo)}" x="${-logoWidth/2}" y="${-logoHeight/2}" width="${logoWidth}" height="${logoHeight}" preserveAspectRatio="xMidYMid meet"/>`:`<text x="0" y="1" dominant-baseline="middle" text-anchor="middle" fill="${ink}" stroke="none" font-family="Arial,sans-serif" font-weight="700" font-size="${fontSize}">${e(word)}</text>`}</g>`:''}
 ${item.text?.trim()?`<text x="250" y="${camper?290:196}" text-anchor="middle" fill="${THREADS[item.thread]||THREADS.Rot}" stroke="none" font-size="${Math.min(19,190/(Math.max(item.text.length,1)*.6))}" font-style="${item.font==='Schreibschrift'?'italic':'normal'}" font-family="${item.font==='Schreibschrift'?'Georgia,serif':'Arial,sans-serif'}">${e(item.text.trim())}</text>`:''}
 </svg>`;
}

export function positionGlyph(position) {
 const [x,y]=position==='chest'?[21,14]:position==='sleeve'?[28,11]:[22,28];
 return `<svg class="position-glyph" viewBox="0 0 36 36" aria-hidden="true"><path d="m12 4-9 6 4 7 4-2v17h14V15l4 2 4-7-9-6c-1 4-11 4-12 0Z"/><circle cx="${x}" cy="${y}" r="2.7"/></svg>`;
}
