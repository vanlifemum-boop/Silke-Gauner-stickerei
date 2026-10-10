import { CLUB_PRODUCTS } from './club-products.js';
export { CLUB_PRODUCTS };

export const CLUBS=[
 {id:'eura-mobil',name:'Eura Mobil',fullName:'Eura Mobil Club',shopName:'Eura Mobil Club Shop',status:'ready',logo:'assets/clubs/eura-mobil-logo.webp',wordmark:'assets/clubs/eura-mobil-wordmark.webp',sourceUrl:'https://euramobilclub-shop.de/',headline:'Dein Club. Dein Auftritt.',description:'Clubkleidung, persönliche Begleiter und Textilien für dein Zuhause auf Rädern. Entdecke das Sortiment aus unserem Eura Mobil Club Shop.'},
 {id:'forster',name:'Forster',fullName:'Forster Fahrer & Fans',shopName:'Forster Fahrer & Fans Shop',status:'ready',logo:'assets/clubs/forster-logo.webp',sourceUrl:'https://forster-fahrer-shop.de/',headline:'Für Fahrer. Für Fans. Für dich.',description:'Vom bestickten Polo bis zum praktischen Begleiter für unterwegs: Hier findest du die Produkte aus unserem Forster Fahrer & Fans Shop.'},
 {id:'benimar',name:'Benimar',fullName:'Benimar Fans',shopName:'Benimar-Fans-Shop',status:'coming',logo:'assets/clubs/benimar-logo.svg',sourceUrl:'https://benimar-fans-shop.de/',headline:'Deine nächste Kollektion kommt.',description:'Die Benimar-Kollektion ergänzen wir als Nächstes. Für deine Club-Bestickung und besondere Wünsche kannst du dich schon jetzt bei uns melden.'},
 {id:'knaus',name:'Knaus',fullName:'Knaus Club',status:'coming',logo:null,headline:'Bald gemeinsam unterwegs.',description:'Der eigene Bereich für den Knaus Club ist vorbereitet. Die Produkte und das passende Club-Logo ergänzen wir später.'}
];
export const clubById=id=>CLUBS.find(c=>c.id===id);
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
 const old=sameProduct?previous.customization||{}:{};
 const customization=p.customization?{enabled:old.enabled===true,text:String(old.text||'').slice(0,p.customization.maxLength),thread:p.customization.threads.includes(old.thread)?old.thread:p.customization.threads[0],font:p.customization.fonts.includes(old.font)?old.font:p.customization.fonts[0]}:null;
 return {productId:p.id,edition:'club',qty:Math.max(1,Math.min(99,Number.parseInt(previous.qty,10)||1)),options,note:sameProduct?String(previous.note||'').slice(0,250):'',customization};
}
export function clubSelectionError(p,item){
 if(item?.edition!=='club'||!p.options.every(g=>validValue(g,item.options?.[g.id])))return 'Bitte wähle eine verfügbare Ausführung.';
 if(p.invalidCombinations?.some(combo=>Object.entries(combo.requested).every(([id,value])=>item.options?.[id]===value)))return 'Diese Kombination ist im bisherigen Shop nicht verfügbar. Bitte ändere Farbe, Größe oder Logo-Ausführung.';
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
 return labels;
}
export function clubPrice(p,item){
 if(p.invalidCombinations?.some(combo=>Object.entries(combo.requested).every(([id,value])=>item.options?.[id]===value)))return {amount:null,from:false,sku:p.articleNumber,unavailable:true};
 const variant=p.variants.find(v=>p.options.every(g=>v.options[g.id]===item.options?.[g.id]));
 const extra=p.customization&&item.customization?.enabled?p.customization.price:0;
 if(variant&&Number.isInteger(variant.price)&&variant.price>=0)return {amount:variant.price+extra,from:false,sku:variant.sku||p.articleNumber,extra};
 return {amount:p.price===null?null:p.price+extra,from:p.options.length>0||p.priceType==='from',sku:p.articleNumber,extra};
}
export function clubLogoFor(p,item){
 const club=clubById(p.club);
 const logoGroup=p.options.find(g=>/logo/i.test(g.name));
 const label=logoGroup?.values.find(v=>v.id===item.options?.[logoGroup.id])?.label||'';
 return /schriftzug/i.test(label)&&club.wordmark?club.wordmark:club.logo;
}
export function clubSourceUrl(p,item){
 const url=new URL(p.sourceUrl);
 for(const group of p.options){const value=item.options?.[group.id];if(validValue(group,value))url.searchParams.set(`group[${group.id}]`,value);}
 return url.href;
}
