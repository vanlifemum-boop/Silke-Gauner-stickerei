import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {CLUB_PRODUCTS,CLUBS,clubProducts,filterClubProducts,clubCategories,createClubSelection,clubSelectionError,clubPrice,clubSelectionLabels,clubSourceUrl} from '../club-core.js';
import {PRODUCTS,addItem,sanitizeCart,unitPrice,itemKey,enquiryText,cartPriceInfo,createSelection} from '../shop-core.js';
import {clubProduct,clubCatalog,clubHighlights} from '../club-ui.js';
const get=id=>CLUB_PRODUCTS.find(p=>p.id===id);
const polo=get('club-forster-755');
const poloChoice=(logo='227')=>({...createClubSelection(polo),options:{'7':'448','9':'192','13':logo}});

test('All source catalogues are complete, individually routed and backed by local images',()=>{
 assert.equal(clubProducts('eura-mobil').length,39);
 assert.equal(clubProducts('forster').length,51);
 assert.equal(clubProducts('waumobil').length,32);
 assert.equal(clubProducts('benimar').length,0);
 assert.equal(clubProducts('karmann').length,0);
 assert.equal(new Set(PRODUCTS.map(p=>p.id)).size,131);
 for(const p of CLUB_PRODUCTS){
  const expected={'eura-mobil':'euramobilclub-shop.de',forster:'forster-fahrer-shop.de',waumobil:'waumobil.handelsvertretung-gauder.de'}[p.club];
  assert.equal(new URL(p.sourceUrl).hostname,expected);
  if(p.image)assert.ok(existsSync(new URL('../'+p.image,import.meta.url)),p.image);
  else assert.equal(p.imageMissing,true);
  assert.ok(p.price===null||Number.isInteger(p.price)&&p.price>=0);
  assert.equal(clubSelectionError(p,createClubSelection(p)),'',p.id);
 }
 assert.equal(CLUB_PRODUCTS.filter(p=>!p.image).length,2);
 for(const club of CLUBS)if(club.logo)assert.ok(existsSync(new URL('../'+club.logo,import.meta.url)));
 assert.ok(CLUBS.find(c=>c.id==='karmann').logo.endsWith('karmann-logo.png'));
 assert.equal(CLUBS.find(c=>c.id==='knaus'),undefined);
});
test('Club, category, search and price sorting combine without mixing catalogues',()=>{
 const items=filterClubProducts('forster',{category:'T-Shirts & Polos',query:'herren',sort:'price-asc'});
 assert.ok(items.length>0);
 assert.ok(items.every(p=>p.club==='forster'&&p.categories.includes('T-Shirts & Polos')));
 assert.deepEqual(items.map(p=>p.price),items.map(p=>p.price).sort((a,b)=>a-b));
 assert.equal(filterClubProducts('eura-mobil',{query:'absichtlich-kein-ergebnis-xyz'}).length,0);
 assert.ok(clubCategories('eura-mobil').includes('Jacken & Westen'));
});
test('Imported logo variants use verified prices, including the original 5 euro difference',()=>{
 const logo=poloChoice('227'),wordmark=poloChoice('225');
 assert.equal(clubPrice(polo,logo).amount,3495);
 assert.equal(clubPrice(polo,wordmark).amount,2995);
 assert.equal(clubPrice(polo,logo).from,false);
 assert.equal(unitPrice({...logo,logoSize:'large',text:'extra request'}),3495);
 const unverified={...logo,options:{...logo.options,'7':'449'}};
 assert.equal(clubPrice(polo,unverified).from,true);
 assert.equal(clubPrice(polo,unverified).amount,2995);
 const url=new URL(clubSourceUrl(polo,wordmark));
 assert.equal(url.searchParams.get('group[13]'),'225');
 assert.equal(url.searchParams.get('group[9]'),'192');
});
test('Known unsupported combinations cannot enter or survive the request cart',()=>{
 const p=get('club-eura-mobil-652'),item={...createClubSelection(p),options:{'7':'364','9':'186','13':'366'}};
 assert.match(clubSelectionError(p,item),/nicht verfügbar/);
 assert.equal(clubPrice(p,item).unavailable,true);
 assert.deepEqual(sanitizeCart([item]),[]);
 assert.match(clubProduct(p,item),/data-action="add-club-cart" disabled/);
});
test('Miami custom embroidery adds 10 euros per item, validates text and retains all choices',()=>{
 const p=get('club-eura-mobil-543'),base=createClubSelection(p);
 assert.equal(unitPrice(base),399);
 const custom={...base,qty:3,customization:{enabled:true,text:'Familie Müller',thread:'Rot',font:'Helvetica'}};
 assert.equal(clubSelectionError(p,custom),'');
 assert.equal(unitPrice(custom),1399);
 assert.equal(cartPriceInfo([custom]).amount,4197);
 assert.match(clubSelectionError(p,{...custom,customization:{...custom.customization,text:''}}),/Wunschtext/);
 assert.match(clubSelectionError(p,{...custom,customization:{...custom.customization,text:'x'.repeat(16)}}),/15/);
 assert.equal(sanitizeCart([custom])[0].customization.font,'Helvetica');
 assert.notEqual(itemKey(base),itemKey(custom));
 const body=enquiryText([custom]);
 for(const s of ['Familie Müller','Helvetica','Rot','10,00','13,99','41,97'])assert.ok(body.includes(s),s);
 assert.ok(clubSelectionLabels(p,custom).some(v=>v.name==='Wunschtext'));
});
test('Request cart stores independent snapshots and merges only identical club configurations',()=>{
 const item=poloChoice();let cart=addItem([],item);
 item.options['9']='194';assert.equal(cart[0].options['9'],'192');
 cart=addItem(cart,poloChoice());assert.equal(cart.length,1);assert.equal(cart[0].qty,2);
 cart=addItem(cart,poloChoice('225'));assert.equal(cart.length,2);
 cart=addItem(cart,{...poloChoice(),note:'Name auf Ärmel'});assert.equal(cart.length,3);
 const restored=sanitizeCart(JSON.parse(JSON.stringify(cart)));
 assert.deepEqual(restored,cart);
 const body=enquiryText(restored);
 for(const s of ['Forster Fahrer & Fans','Forster Fahrer & Fans Schriftzug','Name auf Ärmel','noch nicht eingepreist','Originalartikel','Stand 10.10.2026'])assert.ok(body.includes(s),s);
});
test('Mixed cart preserves example prices and flags imported from-prices',()=>{
 const example=createSelection(PRODUCTS.find(p=>p.id==='camper-tshirt'),{edition:'camper'});
 const club={...poloChoice(),options:{'7':'449','9':'192','13':'227'},qty:2};
 const cart=[example,club];
 assert.deepEqual(cartPriceInfo(cart),{amount:3280+2*2995,from:true,unknown:0,hasClub:true,pendingEmbroidery:0});
 assert.match(enquiryText(cart),/Orientierungssumme bekannter Preise: ab 92,70/);
 assert.match(enquiryText(cart),/Beispielpreis pro Stück/);
 assert.match(enquiryText(cart),/Grundpreis pro Stück laut Club-Shop/);
});
test('Club pages render all real options safely and missing photos have a deliberate placeholder',()=>{
 for(const p of CLUB_PRODUCTS){
  const page=clubProduct(p,createClubSelection(p));
  assert.equal((page.match(/<h1[ >]/g)||[]).length,1,p.id);
  assert.ok(!/src="(?:null|undefined|)"/.test(page),p.id);
  for(const g of p.options)assert.ok(page.includes(`id="club-option-${g.id}"`),p.id);
  if(!p.image)assert.ok(page.includes('Produktbild folgt'));
 }
 const safe=clubProduct(polo,{...poloChoice(),note:'<img src=x onerror="alert(1)">'});
 assert.ok(!safe.includes('<img src=x'));
 assert.ok(safe.includes('&lt;img src=x'));
 assert.ok(clubHighlights().includes('OFFIZIELLE CLUB-BESTICKUNG'));
 assert.ok(clubCatalog(CLUBS.find(c=>c.id==='benimar')).includes('KOLLEKTION IN VORBEREITUNG'));
 assert.ok(clubCatalog(CLUBS.find(c=>c.id==='karmann')).includes('karmann-mobil-club.handelsvertretung-gauder.de'));
 const yearly=get('club-eura-mobil-761');assert.ok(!yearly.name.includes('Vorbestellen'));assert.match(yearly.notice,/endete am 27.09.2026/);
});
test('Every shipped module is included in the Pages deployment',()=>{
 const workflow=readFileSync(new URL('../.github/workflows/pages.yml',import.meta.url),'utf8');
 for(const file of ['app.js','shop-core.js','garment-preview.js','club-core.js','club-ui.js','club-products.js','waumobil-products.js','embroidery-core.js','embroidery-ui.js','tailored-products.js','contact.js'])assert.ok(workflow.includes(file),file);
});
