import { ASSORTMENT_PRODUCTS, ASSORTMENTS, CATALOG_GROUPS, productSources, manufacturerName } from './assortment-core.js?v=20261012-catalog';
import { LOGO_BRANDS, logoPositions, embroideryKey, canEmbroider } from './embroidery-core.js?v=20261012-catalog';
import { CLUB_PRODUCTS, TAILORED_PRODUCTS, isCatalogProduct, catalogGroupFor, createClubSelection, validClubSelection, clubSelectionLabels, clubPrice, clubById } from './club-core.js?v=20261012-catalog';
export const CATEGORIES = ['Alle Produkte','Bekleidung','T-Shirts & Polos','Hosen & Shorts','Jacken & Westen','Pullover & Hoodies','Maßhemden','Badtextilien','Accessoires','Taschen','Caps & Mützen','Tischwäsche','Tischschutz','Küche','Pferdezubehör','Gutscheine','Camper Edition'];
export const PRODUCTS = [
 {id:'camper-tshirt',name:'Dein T-Shirt',category:'Bekleidung',tag:'DEIN CAMPER. DEIN SHIRT.',price:2490,image:'tshirt',color:'Anthrazit',colors:['Anthrazit','Schwarz','Weiß','Navy','Rot','Royalblau','Tannengrün'],sizes:['XS','S','M','L','XL','XXL','3XL'],camper:true,garment:'tshirt',description:'Dein Lieblingsshirt für unterwegs. Wähle Farbe und Größe – und gestalte die Camper Edition mit deiner Marke, deiner Wunschposition und einem kleinen oder großen Logo.',details:['T-Shirt mit Rundhalsausschnitt als Produktidee','Camper Edition mit wählbarer Marke, Position und Logogröße','Alle Varianten und Preise sind Beispiele für den Shop-Entwurf'],position:'Linke Brust'},
 {id:'team-polo',name:'Das Team-Polo',category:'Bekleidung',tag:'FÜR DEIN TEAM',price:2990,image:'polo',color:'Anthrazit',colors:['Anthrazit','Weiß','Rot'],sizes:['XS','S','M','L','XL','XXL','3XL'],description:'Ein gemeinsamer Auftritt beginnt mit den kleinen Details. Dieses Polo ist unsere Entwurfsidee für deinen Verein, dein Unternehmen oder dein nächstes Teamevent.',details:['Klassischer Polokragen mit Knopfleiste','Bestickung auf der linken Brust vorgesehen','Einzelstück oder Team-Ausstattung anfragen'],position:'Linke Brust'},
 {id:'lieblings-hoodie',name:'Dein Lieblings-Hoodie',category:'Bekleidung',tag:'DEIN NAME. DEIN STIL.',price:4990,image:'hoodie',color:'Navy',colors:['Navy','Anthrazit','Rot'],sizes:['XS','S','M','L','XL','XXL'],description:'Für Lieblingsmenschen und Lieblingsmomente. Ein unkomplizierter Hoodie, der mit einem Namen oder kurzen Wunschtext ganz persönlich wird.',details:['Entwurf mit Kapuze und Kängurutasche','Kurzer Wunschtext als persönliche Stickerei','Als Geschenk oder für dich selbst'],position:'Linke Brust'},
 {id:'namens-handtuch',name:'Handtuch mit Herz',category:'Badtextilien',tag:'KLEINE GESTE. GROSSE FREUDE.',price:2490,image:'towel',color:'Weiß',colors:['Weiß','Rot','Anthrazit'],sizes:['50 × 100 cm','70 × 140 cm'],description:'Ein Name macht aus einem Handtuch ein Lieblingsstück. Eine persönliche Geschenkidee für Geburtstage, einen Einzug oder einfach so.',details:['Entwurf für ein einzelnes besticktes Handtuch','Dein Wunschname auf dem Bordürenbereich','Die Abbildung zeigt eine mögliche Farbkombination'],position:'Bordüre'},
 {id:'statement-cap',name:'Die Statement-Cap',category:'Accessoires',tag:'KOPFSACHE MIT CHARAKTER',price:1990,image:'cap',color:'Schwarz',colors:['Schwarz','Navy','Rot'],sizes:['Einheitsgröße'],description:'Ein kleines Wort, das viel sagt. Gestalte die Vorderseite mit einem kurzen Wunschtext oder frage dein eigenes Motiv an.',details:['Klassische Form mit gebogenem Schirm','Kurzer Schriftzug auf der Vorderseite','Auch als Idee für einen gemeinsamen Teamlook'],position:'Vorderseite'},
 {id:'kuechen-schuerze',name:'Schürze für Lieblingsköche',category:'Accessoires',tag:'MIT LIEBE GEMACHT',price:3290,image:'apron',color:'Tannengrün',colors:['Tannengrün','Anthrazit','Rot'],sizes:['Einheitsgröße'],description:'Für Menschen, die mit Liebe kochen. Mit Namen oder einer kleinen Botschaft wird diese Schürze zu einer persönlichen Geschenkidee.',details:['Latzschürze als Produktentwurf','Wunschtext mittig auf dem Brustbereich','Für die heimische Küche oder das Gastronomie-Team'],position:'Brustbereich'},
 {id:'tischwaesche',name:'Tischwäsche mit Initialen',category:'Tischwäsche',tag:'DEIN TISCH. DEIN DETAIL.',price:3990,image:'table',color:'Weiß',colors:['Weiß','Hellgrau'],sizes:['140 × 140 cm','140 × 180 cm','Wunschmaß anfragen'],description:'Ein schön gedeckter Tisch trägt deine Handschrift. Feine Initialen geben der Tischwäsche eine persönliche Note. Andere Maße stimmen wir mit dir ab.',details:['Beispiel für Tischwäsche mit Monogramm','Initialen auf einer Ecke vorgesehen','Individuelle Maße und Materialien auf Anfrage'],position:'Ecke'}
];
for(const p of PRODUCTS){if(p.id==='team-polo'){p.camper=true;p.garment='polo';}if(p.id==='lieblings-hoodie'){p.camper=true;p.garment='hoodie';}}
for(const p of PRODUCTS){p.camper=true;p.categories=[p.category];if(p.garment==='tshirt'||p.garment==='polo')p.categories.push('T-Shirts & Polos');if(p.garment==='hoodie')p.categories.push('Pullover & Hoodies');}
PRODUCTS.push(...CLUB_PRODUCTS,...TAILORED_PRODUCTS,...ASSORTMENT_PRODUCTS);
for(const p of PRODUCTS)p.groupId=CATALOG_GROUPS[p.id]||p.id;
export const catalogOffers=p=>PRODUCTS.filter(x=>x.groupId===p.groupId);
export const COLORS = {'Anthrazit':'#36383b','Schwarz':'#17181b','Weiß':'#ffffff','Rot':'#dc3343','Navy':'#263446','Royalblau':'#28569f','Tannengrün':'#244b42','Hellgrau':'#cfd2d8'};
export const THREADS = {'Rot':'#e83443','Weiß':'#ffffff','Anthrazit':'#292b30','Navy':'#203b6a','Silber':'#9aa3af'};
export const PERSONALIZATION_PRICE=790;
export const CAMPER_BRANDS = LOGO_BRANDS;
export const LOGO_POSITIONS = [
 {id:'chest',label:'Vorne auf der Brust',short:'Brust vorne',detail:'Auf der linken Brust'},
 {id:'sleeve',label:'Am Ärmel',short:'Ärmel',detail:'Auf dem linken Ärmel'},
 {id:'lower-left',label:'Unten links',short:'Unten links',detail:'Vorne am linken Saum'}
];
// Entwurfspreise in Cent. Ein großes Logo kostet 7,00 Euro mehr als ein kleines.
export const LOGO_SIZES = [
 {id:'small',label:'Kleines Logo',detail:'Dezent & persönlich',price:790},
 {id:'large',label:'Großes Logo',detail:'Sichtbar & ausdrucksstark',price:1490}
];
export function isCamper(item){return item?.edition==='camper'&&!!PRODUCTS.find(p=>p.id===item.productId)?.camper;}
export function camperLabels(item){return {
 brand:CAMPER_BRANDS.find(x=>x.id===item.brand)?.name||'',
 position:logoPositions(PRODUCTS.find(p=>p.id===item.productId)||{name:'T-Shirt'}).find(x=>x.id===item.logoPosition)?.label||'',
 logoSize:LOGO_SIZES.find(x=>x.id===item.logoSize)?.label||''
};}
export function createSelection(p,previous={}){
 if(isCatalogProduct(p))return createClubSelection(p,previous);
 const camper=p.camper&&previous.edition==='camper';
 return {productId:p.id,color:p.colors.includes(previous.color)?previous.color:p.color,size:p.sizes.includes(previous.size)?previous.size:p.sizes.includes('M')?'M':p.sizes[0],
 text:String(previous.text||'').slice(0,20),thread:Object.hasOwn(THREADS,previous.thread)?previous.thread:'Rot',font:['Schreibschrift','Druckschrift'].includes(previous.font)?previous.font:'Schreibschrift',
 qty:Math.max(1,Math.min(99,Number.parseInt(previous.qty,10)||1)),edition:camper?'camper':'classic',
 brand:camper?(CAMPER_BRANDS.some(x=>x.id===previous.brand)?previous.brand:'forster'):'',
 logoPosition:camper?(logoPositions(p).some(x=>x.id===previous.logoPosition)?previous.logoPosition:logoPositions(p)[0].id):'',
 logoSize:camper?(LOGO_SIZES.some(x=>x.id===previous.logoSize)?previous.logoSize:'small'):''};
}
export const money = cents => new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(cents/100);
export const escapeHtml = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function filterProducts({category='Alle Produkte',query='',sort='featured',source='',manufacturer=''}={}) {
 const q=query.toLocaleLowerCase('de-DE').trim();
 let items=PRODUCTS.filter(p=>(!source||productSources(p).includes(source))&&(!manufacturer||manufacturerName(p)===manufacturer)&&(category==='Alle Produkte'||(category==='Camper Edition'?(p.camper||p.club&&canEmbroider(p)):(p.categories||[p.category]).includes(category)))&&(!q||`${p.name} ${p.articleNumber||''} ${manufacturerName(p)} ${productSources(p).map(id=>ASSORTMENTS.find(s=>s.id===id)?.name||'').join(' ')} ${p.category} ${p.description||p.summary||''} ${(p.categories||[]).join(' ')} ${p.club?clubById(p.club)?.fullName||'':''} ${p.camper?'Camper Edition '+CAMPER_BRANDS.map(x=>x.name).join(' '):''}`.toLocaleLowerCase('de-DE').includes(q)));
 const grouped=new Map();for(const p of items){const old=grouped.get(p.groupId);if(!old||p.catalog&&!old.catalog)grouped.set(p.groupId,p);}items=[...grouped.values()];
 if(sort==='price-asc') items.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity));
 if(sort==='price-desc') items.sort((a,b)=>(b.price??-1)-(a.price??-1));
 if(sort==='name') items.sort((a,b)=>a.name.localeCompare(b.name,'de'));
 return items;
}
export function priceParts(item){const p=PRODUCTS.find(p=>p.id===item.productId);if(isCatalogProduct(p))return {base:clubPrice(p,item).amount??0,logo:0,text:0};return {
 base:p?.price||0,
 logo:isCamper(item)?(LOGO_SIZES.find(x=>x.id===item.logoSize)?.price||0):0,
 text:item.text?.trim()?PERSONALIZATION_PRICE:0
};}
export function unitPrice(item) {const p=PRODUCTS.find(p=>p.id===item.productId);if(!p)return 0;if(isCatalogProduct(p))return clubPrice(p,item).amount;const parts=priceParts(item);return parts.base+parts.logo+parts.text;}
export function cartTotal(cart) { return cart.reduce((sum,item)=>sum+(unitPrice(item)??0)*item.qty,0); }
export function cartQuantity(cart) { return cart.reduce((sum,item)=>sum+item.qty,0); }
export function itemKey(item) { const p=PRODUCTS.find(p=>p.id===item.productId);if(isCatalogProduct(p))return JSON.stringify([item.productId,p.options.map(g=>[g.id,item.options?.[g.id]]),item.note||'',item.fabricWish||'',item.measurementWish||'',Object.entries(item.sourceFields||{}).sort(([a],[b])=>a.localeCompare(b)),embroideryKey(item.embroidery),item.customization?.enabled?[item.customization.text,item.customization.thread,item.customization.font]:null]);return JSON.stringify([item.productId,item.color,item.size,item.text||'',item.thread||'Rot',item.font||'Schreibschrift',isCamper(item)?['camper',item.brand,item.logoPosition,item.logoSize]:['classic']]); }
export function addItem(cart,item) {
 const qty=Math.max(1,Math.min(99,Number.parseInt(item.qty,10)||1));
 const key=itemKey(item), existing=cart.find(x=>itemKey(x)===key);
 if(existing) return cart.map(x=>itemKey(x)===key?{...x,qty:Math.min(99,x.qty+qty)}:x);
 return [...cart,{...item,...(['club','tailored'].includes(item.edition)?{options:{...item.options},sourceFields:{...item.sourceFields},embroidery:item.embroidery?{...item.embroidery}:null,customization:item.customization?{...item.customization}:null}:{}),qty}];
}
export function sanitizeCart(raw) {
 if(!Array.isArray(raw)) return [];
 return raw.slice(0,50).flatMap(item=>{
  const p=PRODUCTS.find(p=>p.id===item?.productId);
  if(!p)return [];
  if(isCatalogProduct(p))return validClubSelection(p,item)?[createClubSelection(p,item)]:[];
  if(!p.colors.includes(item.color)||!p.sizes.includes(item.size))return [];
  if(item.edition==='camper'&&(!p.camper||!CAMPER_BRANDS.some(x=>x.id===item.brand)||!logoPositions(p).some(x=>x.id===item.logoPosition)||!LOGO_SIZES.some(x=>x.id===item.logoSize)))return [];
  if(item.edition&&!['classic','camper'].includes(item.edition))return [];
  return [createSelection(p,item)];
 });
}
export function itemPriceInfo(item){const p=PRODUCTS.find(p=>p.id===item.productId);return isCatalogProduct(p)?clubPrice(p,item):{amount:unitPrice(item),from:false};}
export function cartPriceInfo(cart){return {amount:cartTotal(cart),from:cart.some(i=>itemPriceInfo(i).from),unknown:cart.filter(i=>itemPriceInfo(i).amount===null).length,hasClub:cart.some(i=>isCatalogProduct(PRODUCTS.find(p=>p.id===i.productId))),pendingEmbroidery:cart.filter(i=>itemPriceInfo(i).pendingEmbroidery).length};}
export function enquiryText(cart) {
 const total=cartPriceInfo(cart);
 return 'Hallo Sylke,\n\nich interessiere mich für folgende Auswahl aus dem Website-Entwurf und bitte um ein unverbindliches Angebot:\n\n'+cart.map(i=>{
  const p=PRODUCTS.find(p=>p.id===i.productId),c=camperLabels(i),parts=priceParts(i);
  if(isCatalogProduct(p)){const price=clubPrice(p,i),prefix=price.from?'ab ':'';return `${i.qty} × ${p.name}\n${p.tailored?'Maßanfertigung':p.catalog?'Sortiment':'Club'}: ${catalogGroupFor(p).fullName}${price.sku?`\nArtikelnummer: ${price.sku}`:''}\n${clubSelectionLabels(p,i).map(v=>v.name+': '+v.value).join('\n')}${i.note?`\nZusätzliche Wünsche (noch nicht eingepreist): ${i.note}`:''}\n${p.tailored?'Preis für die Maßanfertigung':`Grundpreis pro Stück laut bestehendem Shop (Stand ${p.retrievedAt?p.retrievedAt.slice(0,10).split('-').reverse().join('.'):'10.10.2026'})`}: ${price.amount===null?'auf Anfrage':prefix+money(price.amount)}\nOrientierungspreis für ${i.qty} Stück: ${price.amount===null?'auf Anfrage':prefix+money(price.amount*i.qty)}${price.pendingNative?'\nZusatzoptionen/Bestickung: gesondertes Angebot; Aufpreise noch nicht im Grundpreis enthalten.':''}\nOriginalartikel: ${p.sourceUrl}`;}
  return `${i.qty} × ${p.name}\nFarbe: ${i.color} · Größe: ${i.size}${isCamper(i)?`\nEdition: Camper Edition\nMarkenlogo: ${c.brand}\nPosition: ${c.position}\nLogogröße: ${c.logoSize}\nLogo-Aufpreis pro Stück: ${money(parts.logo)}`:''}${i.text?`\nSticktext: ${i.text} · Garn: ${i.thread} · Schrift: ${i.font}`:''}\nBeispielpreis pro Stück: ${money(unitPrice(i))}\nBeispielpreis für ${i.qty} Stück: ${money(unitPrice(i)*i.qty)}`;
 }).join('\n\n')+`\n\n${total.hasClub?'Orientierungssumme bekannter Preise':'Summe der Beispielpreise'}: ${total.unknown===cart.length&&cart.length?'Preis auf Anfrage':`${total.from?'ab ':''}${money(total.amount)}`}${total.unknown?`\n${total.unknown} Position(en) mit Preis auf Anfrage sind noch nicht enthalten.`:''}${total.pendingEmbroidery?`\nIndividuelle Logo-Bestickung für ${total.pendingEmbroidery} Position(en) wird zusätzlich angeboten und ist noch nicht enthalten.`:''}\nBitte tatsächliche Verfügbarkeit, Preise, Bestickung, Logo-Ausführung und Versand bestätigen. Zusätzliche Wünsche bitte gesondert anbieten.\n\nMein Name:\nMeine Rückrufnummer:\nMein Wunschtermin:\n`;
}
