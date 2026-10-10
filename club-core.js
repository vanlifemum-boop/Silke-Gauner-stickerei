import { createEmbroidery, embroideryError, embroideryLabels, textileKind } from './embroidery-core.js';
import { TAILORED_PRODUCTS } from './tailored-products.js';
export { TAILORED_PRODUCTS };
import { CLUB_PRODUCTS as ORIGINAL_CLUB_PRODUCTS } from './club-products.js';
import { WAUMOBIL_PRODUCTS } from './waumobil-products.js';
export const CLUB_PRODUCTS=[...ORIGINAL_CLUB_PRODUCTS,...WAUMOBIL_PRODUCTS];

export const CLUBS=[
 {id:'eura-mobil',name:'Eura Mobil',fullName:'Eura Mobil Club',shopName:'Eura Mobil Club Shop',status:'ready',logo:'assets/clubs/eura-mobil-logo.webp',wordmark:'assets/clubs/eura-mobil-wordmark.webp',sourceUrl:'https://euramobilclub-shop.de/',headline:'Dein Club. Dein Auftritt.',description:'Clubkleidung, persönliche Begleiter und Textilien für dein Zuhause auf Rädern. Entdecke das Sortiment aus unserem Eura Mobil Club Shop.'},
 {id:'forster',name:'Forster',fullName:'Forster Fahrer & Fans',shopName:'Forster Fahrer & Fans Shop',status:'ready',logo:'assets/clubs/forster-logo.webp',sourceUrl:'https://forster-fahrer-shop.de/',headline:'Für Fahrer. Für Fans. Für dich.',description:'Vom bestickten Polo bis zum praktischen Begleiter für unterwegs: Hier findest du die Produkte aus unserem Forster Fahrer & Fans Shop.'},
 {id:'benimar',name:'Benimar',fullName:'Benimar Fans',shopName:'Benimar-Fans-Shop',status:'coming',logo:'assets/clubs/benimar-logo.svg',sourceUrl:'https://benimar-fans-shop.de/',headline:'Deine nächste Kollektion kommt.',description:'Die Benimar-Kollektion ergänzen wir als Nächstes. Für deine Club-Bestickung und besondere Wünsche kannst du dich schon jetzt bei uns melden.'},
 {id:'karmann',name:'Karmann Club',fullName:'Karmann Club',shopName:'Karmann-Mobil-Club Shop',status:'coming',logo:'assets/clubs/karmann-logo.png',sourceUrl:'https://karmann-mobil-club.handelsvertretung-gauder.de/',headline:'Bald gemeinsam unterwegs.',description:'Der eigene Bereich für den Karmann Club ist vorbereitet. Die Produkte ergänzen wir nach und nach. Du kannst schon jetzt unseren bestehenden Karmann-Mobil-Club-Shop besuchen.'}
 ,{id:'waumobil',name:'Waumobil',fullName:'Waumobil Edition',shopName:'Waumobil Fanshop',status:'ready',logo:'assets/clubs/waumobil-logo.svg',sourceUrl:'https://waumobil.handelsvertretung-gauder.de/',brandSourceUrl:'https://waumobil.eu/gebrauchtes-wohnmobil-anbieten/',headline:'Gemeinsam unterwegs. Mit Hund.',description:'Entdecke Bekleidung, praktische Begleiter und Textilien für unterwegs aus dem bestehenden Waumobil Fanshop. Wähle deine Farbe, Größe und Logo-Ausführung – persönlich bestickt für deinen Auftritt.'}
];
export const TAILORING={id:'masshemden',tailored:true,name:'Maßhemden',fullName:'Maßhemden & Maßblusen',shopName:'Individuelle Maßhemden von Gauder',sourceUrl:'https://www.individuelle-masshemden.de/'};
export const clubById=id=>CLUBS.find(c=>c.id===id);
export const isCatalogProduct=p=>!!(p?.club||p?.tailored);
export const catalogGroupFor=p=>p.tailored?TAILORING:clubById(p.club);
for(const p of CLUB_PRODUCTS){
 let category=p.category;
 if(textileKind(p)==='trousers')category='Hosen & Shorts';
 else if(/jacke|jacket|weste/i.test(p.name))category='Jacken & Westen';
 else if(/pullover|hoodie|hoody/i.test(p.name))category='Pullover & Hoodies';
 else if(/bademantel|handtuch|handtücher/i.test(p.name))category='Badtextilien';
 else if(/cap|beanie/i.test(p.name))category='Caps & Mützen';
 if(category!==p.category){p.category=category;p.categories=[...new Set([...p.categories,category])];}
}

export const clubProducts=id=>CLUB_PRODUCTS.filter(p=>p.club===id);
export function clubCategories(id){return [...new Set(clubProducts(id).flatMap(p=>p.categories))];}
export function filterClubProducts(id,{category='Alle Produkte',query='',sort='featured'}={}){
 const q=query.trim().toLocaleLowerCase('de-DE');
 let items=clubProducts(id).filter(p=>(category==='Alle Produkte'||p.categories.includes(category))&&(!q||`${p.name} ${p.articleNumber} ${p.categories.join(' ')} ${p.details.join(' ')}`.toLocaleLowerCase('de-DE').includes(q)));
 if(sort==='price-asc')items.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity));
 if(sort==='price-desc')items.sort((a,b)=>(b.price??-1)-(a.price??-1));
 if(sort==='name')items.sort((a,b)=>a.name.localeCompare(b.name,'de'));
 return items;
}
const validValue=(group,value)=>group.values.some(v=>v.id===value&&!v.disabled);
export function createClubSelection(p,previous={}){
 const options={};
 const sameProduct=previous.productId===p.id;
 for(const group of p.options){
  const value=sameProduct?previous.options?.[group.id]:undefined;
  options[group.id]=validValue(group,value)?value:validValue(group,p.defaults[group.id])?p.defaults[group.id]:group.values.find(v=>!v.disabled)?.id||'';
 }
 if(p.tailored){const none=p.options.find(g=>g.id==='cuff').values.at(-1).id;if(options.sleeve==='1')options.cuff=none;else if(options.cuff===none)options.cuff='0';}
 const old=sameProduct?previous.customization||{}:{};
 const customization=p.customization?{enabled:old.enabled===true,text:String(old.text||'').slice(0,p.customization.maxLength),thread:p.customization.threads.includes(old.thread)?old.thread:p.customization.threads[0],font:p.customization.fonts.includes(old.font)?old.font:p.customization.fonts[0]}:null;
 return {productId:p.id,edition:p.tailored?'tailored':'club',embroidery:createEmbroidery(p,sameProduct?previous.embroidery:{}),fabricWish:p.tailored&&sameProduct?String(previous.fabricWish||'').slice(0,150):'',qty:Math.max(1,Math.min(99,Number.parseInt(previous.qty,10)||1)),options,note:sameProduct?String(previous.note||'').slice(0,250):'',customization};
}
export function clubSelectionError(p,item){
 if(item?.edition!==(p.tailored?'tailored':'club')||!p.options.every(g=>validValue(g,item.options?.[g.id])))return 'Bitte wähle eine verfügbare Ausführung.';
 if(p.invalidCombinations?.some(combo=>Object.entries(combo.requested).every(([id,value])=>item.options?.[id]===value)))return 'Diese Kombination ist im bisherigen Shop nicht verfügbar. Bitte ändere Farbe, Größe oder Logo-Ausführung.';
 const designError=embroideryError(p,item.embroidery);if(designError)return designError;
 if(p.tailored&&item.fabricWish!==undefined&&(typeof item.fabricWish!=='string'||item.fabricWish.length>150))return 'Bitte kürze deinen Stoff- und Farbwunsch auf 150 Zeichen.';
 const custom=item.customization;
 if(p.customization&&custom?.enabled){
  if(!custom.text?.trim()||custom.text.length>p.customization.maxLength)return `Bitte gib deinen Wunschtext mit höchstens ${p.customization.maxLength} Zeichen ein.`;
  if(!p.customization.threads.includes(custom.thread)||!p.customization.fonts.includes(custom.font))return 'Bitte wähle Garnfarbe und Schrift für deine Bestickung.';
 }
 return '';
}
export function validClubSelection(p,item){return !clubSelectionError(p,item);}
export function clubSelectionLabels(p,item){
 const labels=p.options.map(g=>({name:g.name,value:g.values.find(v=>v.id===item.options?.[g.id])?.label||'Bitte wählen'}));
 if(p.customization){
  labels.push({name:'Bestickung',value:item.customization?.enabled?`Wunschtext (+${(p.customization.price/100).toFixed(2).replace('.',',')} € pro Stück)`:'Ohne Wunschbestickung'});
  if(item.customization?.enabled)labels.push({name:'Wunschtext',value:item.customization.text},{name:'Garnfarbe',value:item.customization.thread},{name:'Schrift',value:item.customization.font});
 }
 if(p.tailored)labels.push({name:'Stoff- und Farbwunsch',value:item.fabricWish||'Auswahl in der Beratung'},{name:'Größe',value:'Anfertigung nach persönlicher Maßaufnahme'});
 labels.push(...embroideryLabels(p,item.embroidery));
 return labels;
}
export function clubPrice(p,item){
 const pendingEmbroidery=item.embroidery?.mode==='custom';
 if(p.tailored)return {amount:null,from:false,sku:'',extra:0,pendingEmbroidery};
 if(p.invalidCombinations?.some(combo=>Object.entries(combo.requested).every(([id,value])=>item.options?.[id]===value)))return {amount:null,from:false,sku:p.articleNumber,unavailable:true};
 const variant=p.variants.find(v=>p.options.every(g=>v.options[g.id]===item.options?.[g.id]));
 const extra=p.customization&&item.customization?.enabled?p.customization.price:0;
 if(variant&&Number.isInteger(variant.price)&&variant.price>=0)return {amount:variant.price+extra,from:false,sku:variant.sku||p.articleNumber,extra,pendingEmbroidery};
 return {amount:p.price===null?null:p.price+extra,from:p.options.length>0||p.priceType==='from',sku:p.articleNumber,extra,pendingEmbroidery};
}
export function clubLogoFor(p,item){
 if(p.tailored)return null;
 const club=clubById(p.club);
 const logoGroup=p.options.find(g=>/logo/i.test(g.name));
 const label=logoGroup?.values.find(v=>v.id===item.options?.[logoGroup.id])?.label||'';
 return /schriftzug/i.test(label)&&club.wordmark?club.wordmark:club.logo;
}
export function clubSourceUrl(p,item){
 if(p.tailored)return p.sourceUrl;
 const url=new URL(p.sourceUrl);
 for(const group of p.options){const value=item.options?.[group.id];if(validValue(group,value))url.searchParams.set(`group[${group.id}]`,value);}
 return url.href;
}
