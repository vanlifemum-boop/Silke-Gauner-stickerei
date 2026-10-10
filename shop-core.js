export const CATEGORIES = ['Alle Produkte', 'Bekleidung', 'Badtextilien', 'Accessoires', 'Tischwäsche'];
export const PRODUCTS = [
 {id:'team-polo',name:'Das Team-Polo',category:'Bekleidung',tag:'FÜR DEIN TEAM',price:2990,image:'polo',color:'Anthrazit',colors:['Anthrazit','Weiß','Rot'],sizes:['XS','S','M','L','XL','XXL','3XL'],description:'Ein gemeinsamer Auftritt beginnt mit den kleinen Details. Dieses Polo ist unsere Entwurfsidee für deinen Verein, dein Unternehmen oder dein nächstes Teamevent.',details:['Klassischer Polokragen mit Knopfleiste','Bestickung auf der linken Brust vorgesehen','Einzelstück oder Team-Ausstattung anfragen'],position:'Linke Brust'},
 {id:'lieblings-hoodie',name:'Dein Lieblings-Hoodie',category:'Bekleidung',tag:'DEIN NAME. DEIN STIL.',price:4990,image:'hoodie',color:'Navy',colors:['Navy','Anthrazit','Rot'],sizes:['XS','S','M','L','XL','XXL'],description:'Für Lieblingsmenschen und Lieblingsmomente. Ein unkomplizierter Hoodie, der mit einem Namen oder kurzen Wunschtext ganz persönlich wird.',details:['Entwurf mit Kapuze und Kängurutasche','Kurzer Wunschtext als persönliche Stickerei','Als Geschenk oder für dich selbst'],position:'Linke Brust'},
 {id:'namens-handtuch',name:'Handtuch mit Herz',category:'Badtextilien',tag:'KLEINE GESTE. GROSSE FREUDE.',price:2490,image:'towel',color:'Weiß',colors:['Weiß','Rot','Anthrazit'],sizes:['50 × 100 cm','70 × 140 cm'],description:'Ein Name macht aus einem Handtuch ein Lieblingsstück. Eine persönliche Geschenkidee für Geburtstage, einen Einzug oder einfach so.',details:['Entwurf für ein einzelnes besticktes Handtuch','Dein Wunschname auf dem Bordürenbereich','Die Abbildung zeigt eine mögliche Farbkombination'],position:'Bordüre'},
 {id:'statement-cap',name:'Die Statement-Cap',category:'Accessoires',tag:'KOPFSACHE MIT CHARAKTER',price:1990,image:'cap',color:'Schwarz',colors:['Schwarz','Navy','Rot'],sizes:['Einheitsgröße'],description:'Ein kleines Wort, das viel sagt. Gestalte die Vorderseite mit einem kurzen Wunschtext oder frage dein eigenes Motiv an.',details:['Klassische Form mit gebogenem Schirm','Kurzer Schriftzug auf der Vorderseite','Auch als Idee für einen gemeinsamen Teamlook'],position:'Vorderseite'},
 {id:'kuechen-schuerze',name:'Schürze für Lieblingsköche',category:'Accessoires',tag:'MIT LIEBE GEMACHT',price:3290,image:'apron',color:'Tannengrün',colors:['Tannengrün','Anthrazit','Rot'],sizes:['Einheitsgröße'],description:'Für Menschen, die mit Liebe kochen. Mit Namen oder einer kleinen Botschaft wird diese Schürze zu einer persönlichen Geschenkidee.',details:['Latzschürze als Produktentwurf','Wunschtext mittig auf dem Brustbereich','Für die heimische Küche oder das Gastronomie-Team'],position:'Brustbereich'},
 {id:'tischwaesche',name:'Tischwäsche mit Initialen',category:'Tischwäsche',tag:'DEIN TISCH. DEIN DETAIL.',price:3990,image:'table',color:'Weiß',colors:['Weiß','Hellgrau'],sizes:['140 × 140 cm','140 × 180 cm','Wunschmaß anfragen'],description:'Ein schön gedeckter Tisch trägt deine Handschrift. Feine Initialen geben der Tischwäsche eine persönliche Note. Andere Maße stimmen wir mit dir ab.',details:['Beispiel für Tischwäsche mit Monogramm','Initialen auf einer Ecke vorgesehen','Individuelle Maße und Materialien auf Anfrage'],position:'Ecke'}
];
export const COLORS = {'Anthrazit':'#36383b','Schwarz':'#17181b','Weiß':'#ffffff','Rot':'#dc3343','Navy':'#263446','Tannengrün':'#244b42','Hellgrau':'#cfd2d8'};
export const THREADS = {'Rot':'#e83443','Weiß':'#ffffff','Anthrazit':'#292b30','Navy':'#203b6a','Silber':'#9aa3af'};
export const PERSONALIZATION_PRICE=790;
export const money = cents => new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(cents/100);
export const escapeHtml = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function filterProducts({category='Alle Produkte',query='',sort='featured'}={}) {
 const q=query.toLocaleLowerCase('de-DE').trim();
 let items=PRODUCTS.filter(p=>(category==='Alle Produkte'||p.category===category)&&(!q||`${p.name} ${p.category} ${p.description}`.toLocaleLowerCase('de-DE').includes(q)));
 if(sort==='price-asc') items.sort((a,b)=>a.price-b.price);
 if(sort==='price-desc') items.sort((a,b)=>b.price-a.price);
 if(sort==='name') items.sort((a,b)=>a.name.localeCompare(b.name,'de'));
 return items;
}
export function unitPrice(item) { const p=PRODUCTS.find(p=>p.id===item.productId); return p ? p.price+(item.text?.trim()?PERSONALIZATION_PRICE:0) : 0; }
export function cartTotal(cart) { return cart.reduce((sum,item)=>sum+unitPrice(item)*item.qty,0); }
export function cartQuantity(cart) { return cart.reduce((sum,item)=>sum+item.qty,0); }
export function itemKey(item) { return JSON.stringify([item.productId,item.color,item.size,item.text||'',item.thread||'Rot',item.font||'Schreibschrift']); }
export function addItem(cart,item) {
 const qty=Math.max(1,Math.min(99,Number.parseInt(item.qty,10)||1));
 const key=itemKey(item), existing=cart.find(x=>itemKey(x)===key);
 if(existing) return cart.map(x=>itemKey(x)===key?{...x,qty:Math.min(99,x.qty+qty)}:x);
 return [...cart,{...item,qty}];
}
export function sanitizeCart(raw) {
 if(!Array.isArray(raw)) return [];
 return raw.slice(0,50).flatMap(item=>{
  const p=PRODUCTS.find(p=>p.id===item?.productId);
  if(!p||!p.colors.includes(item.color)||!p.sizes.includes(item.size))return [];
  return [{productId:p.id,color:item.color,size:item.size,text:String(item.text||'').slice(0,20),thread:Object.hasOwn(THREADS,item.thread)?item.thread:'Rot',font:['Schreibschrift','Druckschrift'].includes(item.font)?item.font:'Schreibschrift',qty:Math.max(1,Math.min(99,Number.parseInt(item.qty,10)||1))}];
 });
}
export function enquiryText(cart) {
 return 'Hallo Sylke,\n\nich interessiere mich für folgende Auswahl aus dem Website-Entwurf und bitte um ein unverbindliches Angebot:\n\n'+cart.map(i=>{const p=PRODUCTS.find(p=>p.id===i.productId);return `${i.qty} × ${p.name}\nFarbe: ${i.color} · Größe: ${i.size}${i.text?`\nSticktext: ${i.text} · Garn: ${i.thread} · Schrift: ${i.font}`:''}\nBeispielpreis: ${money(unitPrice(i)*i.qty)}`;}).join('\n\n')+`\n\nSumme der Beispielpreise: ${money(cartTotal(cart))}\nBitte tatsächliche Verfügbarkeit, Preise, Bestickung und Versand bestätigen.\n\nMein Name:\nMeine Rückrufnummer:\nMein Wunschtermin:\n`;
}
