import { ASSORTMENTS, assortmentProducts, manufacturerNames, manufacturerName, ASSORTMENT_PRODUCTS } from './assortment-core.js?v=20261012-catalog';
import { escapeHtml as e } from './shop-core.js?v=20261012-catalog';

const arrow='<span aria-hidden="true">↗</span>';
const shopLink=id=>`#/shop?source=${encodeURIComponent(id)}`;
function assortmentCard(s){
 const products=assortmentProducts(s.id),picture=products.find(p=>p.image)?.image;
 return `<a class="assortment-card" href="${shopLink(s.id)}"><div class="assortment-card-picture">${picture?`<img src="${e(picture)}" alt="Beispiel aus ${e(s.name)}" loading="lazy" decoding="async">`:`<span aria-hidden="true">${s.symbol}</span>`}<span class="assortment-count">${products.length} Artikel</span></div><div class="assortment-card-copy"><span class="eyebrow red">${s.eyebrow}</span><h3>${s.name}</h3><p>${s.description}</p><span class="text-link">Sortiment entdecken ${arrow}</span></div></a>`;
}
export function assortmentOverview({page=false}={}){
 const heading=page?'h1':'h2';
 return `<section class="wrap assortment-section"><div class="section-top"><div><span class="eyebrow red">DIE WELT VON SYLKE GAUDER</span><${heading} class="${page?'page-title':'section-heading'}">Alles, was zu<br>dir gehört.</${heading}></div><div><p>Unsere Shops, ihre Marken und deine Lieblingsstücke.<br>Jetzt gemeinsam an einem Ort.</p>${page?'':`<a class="text-link" href="#/sortimente">Alle Marken & Sortimente ${arrow}</a>`}</div></div><div class="assortment-grid">${ASSORTMENTS.map(assortmentCard).join('')}</div>${page?manufacturerOverview():''}</section>`;
}
export function manufacturerOverview(){
 const names=manufacturerNames();
 return `<div class="manufacturer-section"><span class="eyebrow red">DEINE MARKEN IM SHOP</span><h2 class="section-heading">Qualität hat viele Namen.</h2><div class="manufacturer-list">${names.map(name=>{const p=ASSORTMENT_PRODUCTS.find(p=>manufacturerName(p)===name);const logo=p.manufacturerLogo||p.manufacturer?.logo;return `<a href="#/shop?manufacturer=${encodeURIComponent(name)}">${logo?`<img src="${e(logo)}" alt="" loading="lazy" decoding="async">`:''}<span>${e(name)}</span>${arrow}</a>`;}).join('')}</div><p class="fine-note">Die Marken werden anhand der Herstellerangaben in unseren bestehenden Shops zugeordnet. Bei Artikeln ohne Herstellerangabe steht das Sortiment im Vordergrund.</p></div>`;
}
