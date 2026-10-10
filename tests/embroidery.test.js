import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PRODUCTS,createSelection,addItem,itemKey,sanitizeCart,cartPriceInfo,enquiryText,filterProducts} from '../shop-core.js';
import {TAILORED_PRODUCTS,CLUB_PRODUCTS,CLUBS,createClubSelection,clubPrice,clubSelectionError} from '../club-core.js';
import {logoPositions,canEmbroider,createEmbroidery,LOGO_BRANDS} from '../embroidery-core.js';
import {clubProduct,clubPriceSummary,tailoredPage} from '../club-ui.js';
import {WHATSAPP_URL,whatsappLink} from '../contact.js';

test('Every textile has embroidery choices that fit its construction',()=>{
 for(const p of PRODUCTS){
  if(/gutschein/i.test(p.name)){assert.equal(canEmbroider(p),false);continue;}
  assert.ok(canEmbroider(p),p.name);assert.equal(logoPositions(p).length,3,p.name);
  if(p.club||p.tailored){const item=createClubSelection(p);item.embroidery=createEmbroidery(p,{mode:'custom',brand:'own'});assert.equal(clubSelectionError(p,item),'',p.name);assert.ok(clubProduct(p,item).includes('data-design-size="large"'));}
  else assert.equal(createSelection(p,{edition:'camper'}).edition,'camper');
 }
 for(const category of ['Hosen & Shorts','Jacken & Westen','Pullover & Hoodies'])assert.ok(filterProducts({category}).length>0,category);
 assert.deepEqual(logoPositions({name:'Trekking Pants'}).map(x=>x.id),['thigh','back-pocket','lower-leg']);
 for(const name of ['Softshell Weste','Schürze','Cap','Handtuch'])assert.ok(!logoPositions({name}).some(x=>x.id==='sleeve'),name);
 const p=CLUB_PRODUCTS.find(p=>/Trekking Pants/.test(p.name)),item=createClubSelection(p);item.embroidery={...item.embroidery,mode:'custom',position:'chest'};
 assert.ok(clubSelectionError(p,item));assert.deepEqual(sanitizeCart([item]),[]);
});

test('Custom club logos preserve verified base prices and explicitly quote embroidery separately',()=>{
 const p=CLUB_PRODUCTS.find(p=>p.id==='club-forster-755');
 const base={...createClubSelection(p),options:{'7':'448','9':'192','13':'227'},qty:2};
 const custom={...base,embroidery:createEmbroidery(p,{mode:'custom',brand:'karmann',size:'large',position:'sleeve',thread:'Silber',text:'Team',logoNote:'Datei folgt'})};
 assert.equal(clubPrice(p,custom).amount,3495);assert.equal(clubPrice(p,custom).pendingEmbroidery,true);
 assert.equal(cartPriceInfo([custom]).amount,6990);assert.equal(cartPriceInfo([custom]).pendingEmbroidery,1);
 assert.match(clubPriceSummary(p,custom),/ohne Sonderbestickung/);
 const cart=addItem(addItem([],base),custom);assert.equal(cart.length,2);
 const small={...custom,embroidery:{...custom.embroidery,size:'small'}};
 assert.notEqual(itemKey(custom),itemKey(small));
 const saved=sanitizeCart(JSON.parse(JSON.stringify(cart)));assert.deepEqual(saved,cart);
 custom.embroidery.logoNote='changed after adding';assert.equal(cart[1].embroidery.logoNote,'Datei folgt');
 for(const fragment of ['Karmann Club','Großes Logo','Am Ärmel','Silber','Team','69,90','zusätzlich angeboten'])assert.ok(enquiryText(saved).includes(fragment),fragment);
});

test('Made-to-measure shirts and blouses retain source options, fabric wishes and embroidery without invented prices',()=>{
 assert.equal(TAILORED_PRODUCTS.length,2);
 const all=[];
 for(const p of TAILORED_PRODUCTS){
  assert.equal(p.price,null);
  let item=createClubSelection(p);item.fabricWish='Hellblau, feine Streifen';item.embroidery=createEmbroidery(p,{mode:'custom',brand:'own',position:'chest',size:'small',text:'SG'});item.qty=2;
  all.push(item);assert.equal(clubSelectionError(p,item),'');assert.equal(clubPrice(p,item).amount,null);
  assert.equal(p.options.some(g=>/größ/i.test(g.name)),false);
  const short=createClubSelection(p,{...item,options:{...item.options,sleeve:'1'}});
  const noCuff=p.options.find(g=>g.id==='cuff').values.at(-1).id;assert.equal(short.options.cuff,noCuff);
  const long=createClubSelection(p,{...short,options:{...short.options,sleeve:'0'}});assert.notEqual(long.options.cuff,noCuff);
  const page=clubProduct(p,item);assert.match(page,/id="fabric-wish"/);assert.match(page,/Maßaufnahme/);assert.match(page,/Logo individuell wählen/);
 }
 assert.deepEqual(sanitizeCart(JSON.parse(JSON.stringify(all))),all);
 const body=enquiryText(all);assert.ok(!body.includes('0,00'));for(const t of ['Maßhemd','Maßbluse','Hellblau, feine Streifen','Eigenes Firmen- oder Vereinslogo','SG','Preis auf Anfrage'])assert.ok(body.includes(t),t);
 assert.equal(cartPriceInfo(all).unknown,2);assert.match(tailoredPage(),/#\/produkt\/massbluse/);
});

test('Karmann replaces Knaus and old logo choices cannot silently become a different brand',()=>{
 assert.ok(CLUBS.some(c=>c.id==='karmann'&&c.logo));assert.ok(LOGO_BRANDS.some(c=>c.id==='karmann'));assert.ok(!LOGO_BRANDS.some(c=>c.id==='knaus'));
 const shirt=PRODUCTS.find(p=>p.id==='camper-tshirt');const item=createSelection(shirt,{edition:'camper',brand:'karmann'});
 assert.equal(sanitizeCart([item])[0].brand,'karmann');assert.deepEqual(sanitizeCart([{...item,brand:'knaus'}]),[]);
});

test('WhatsApp uses the supplied mobile number and published page source contains no landline',()=>{
 assert.equal(WHATSAPP_URL,'https://wa.me/491636997060');assert.match(whatsappLink(),/href="https:\/\/wa.me\/491636997060"/);assert.match(whatsappLink(),/<svg/);
 for(const file of ['index.html','app.js']){const text=readFileSync(new URL('../'+file,import.meta.url),'utf8');assert.ok(!/5663|938\s*548|Festnetz|Knaus/i.test(text),file);assert.match(text,/491636997060/);}
});
