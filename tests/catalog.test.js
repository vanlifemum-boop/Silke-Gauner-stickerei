import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ASSORTMENT_PRODUCTS,ASSORTMENTS,manufacturerName,paginateProducts} from '../assortment-core.js';
import {PRODUCTS,filterProducts,catalogOffers,createSelection,addItem,sanitizeCart,enquiryText,itemKey} from '../shop-core.js';
import {clubPrice,clubSelectionError,clubSourceUrl,createClubSelection} from '../club-core.js';
import {canEmbroider,logoPositions} from '../embroidery-core.js';
import {sourceFieldVisible} from '../catalog-options.js';
import {clubProduct} from '../club-ui.js';
import {holidayPage,assortmentOverview} from '../assortment-ui.js';

test('All imported source articles remain reachable, while the overview removes true duplicates',()=>{
 assert.equal(ASSORTMENT_PRODUCTS.length,611);
 for(const [source,count] of Object.entries({arbeitsbekleidung:322,stoelzinga:107,tischdecke:60,bestickungen:122,pferdezubehoer:4}))assert.equal(filterProducts({source}).length,count,source);
 const all=filterProducts();assert.equal(all.length,633);assert.equal(new Set(all.map(p=>p.groupId)).size,all.length);
 const shared=PRODUCTS.find(p=>p.id==='shop-arbeitsbekleidung-745');
 assert.ok(catalogOffers(shared).some(p=>p.club==='forster'));
 assert.ok(catalogOffers(shared).some(p=>p.catalog==='stoelzinga'));
 assert.equal(all.filter(p=>p.groupId===shared.groupId).length,1);
 const branded=PRODUCTS.find(p=>p.id==='club-forster-470'),plain=PRODUCTS.find(p=>p.id==='shop-stoelzinga-470');
 assert.notEqual(branded.groupId,plain.groupId,'a scarf with included club embroidery is a distinct offer');
 assert.ok(!ASSORTMENT_PRODUCTS.some(p=>/Testprodukt/.test(p.name)));
});

test('Source, manufacturer, category, search and pagination work together',()=>{
 const list=filterProducts({source:'arbeitsbekleidung',manufacturer:'ID Identity',category:'T-Shirts & Polos',query:'PRO Wear',sort:'price-asc'});
 assert.ok(list.length>1);assert.ok(list.every(p=>manufacturerName(p)==='ID Identity'&&p.categories.includes('T-Shirts & Polos')));
 assert.deepEqual(list.map(p=>p.price),[...list].map(p=>p.price).sort((a,b)=>a-b));
 const all=filterProducts();const first=paginateProducts(all,1),next=paginateProducts(all,2),last=paginateProducts(all,1000);
 assert.equal(first.items.length,24);assert.equal(next.start,25);assert.equal(last.end,633);assert.equal(last.page,27);
 assert.ok(first.items.every(p=>!next.items.some(x=>x.id===p.id)));
 assert.equal(paginateProducts([],99).page,1);
});

test('Included text embroidery and native WooCommerce fields survive cart and enquiry without a second fee',()=>{
 const p=ASSORTMENT_PRODUCTS.find(p=>p.embroideryIncluded&&p.includedEmbroideryType==='Text'&&p.customFields?.some(f=>f.id==='included-text'));
 const item=createSelection(p);assert.match(clubSelectionError(p,item),/Wunschtext/);
 item.sourceFields['included-text']='Sylke & Team';
 assert.equal(clubSelectionError(p,item),'');
 const price=clubPrice(p,item);assert.equal(price.pendingEmbroidery,false);assert.ok(price.amount>0);
 const url=new URL(clubSourceUrl(p,item));
 for(const g of p.options){assert.equal(url.searchParams.get(g.parameter),item.options[g.id]);assert.ok(!url.searchParams.has(`group[${g.id}]`));}
 const cart=addItem([],item);item.sourceFields['included-text']='changed';assert.equal(cart[0].sourceFields['included-text'],'Sylke & Team');
 const restored=sanitizeCart(JSON.parse(JSON.stringify(cart)));assert.equal(restored.length,1);
 assert.match(enquiryText(restored),/Sylke & Team/);
 assert.notEqual(itemKey(item),itemKey(cart[0]));
 const wildcard=ASSORTMENT_PRODUCTS.find(p=>p.variants.some(v=>v.wildcardOptions?.length)&&!p.customFields?.some(f=>f.id.startsWith('tmcp')));
 const selection=createClubSelection(wildcard),variant=wildcard.variants.find(v=>Object.entries(v.options).every(([k,v])=>selection.options[k]===v));
 assert.equal(clubPrice(wildcard,selection).amount,variant.price);assert.equal(clubPrice(wildcard,selection).from,false);
});

test('Custom table measurements switch the exact variant price to an individual quote',()=>{
 const p=ASSORTMENT_PRODUCTS.find(p=>p.madeToMeasure&&p.variants.length);
 const item=createSelection(p),original=clubPrice(p,item);assert.ok(original.amount>0);
 item.measurementWish='125 × 172 cm';assert.equal(clubPrice(p,item).amount,null);
 const restored=sanitizeCart(addItem([],item));assert.equal(restored[0].measurementWish,'125 × 172 cm');
 assert.match(enquiryText(restored),/Wunschmaß – Preis auf Anfrage: 125 × 172 cm/);
 assert.match(clubProduct(p,item),/Preis auf Anfrage/);
});

test('Horse-specific source fields are conditional and nontextiles cannot be embroidered',()=>{
 for(const p of ASSORTMENT_PRODUCTS.filter(p=>p.embroideryAvailable===false)){assert.equal(canEmbroider(p),false);assert.ok(!clubProduct(p,createSelection(p)).includes('data-embroidery-mode'));}
 assert.deepEqual(logoPositions({name:'Schabracke'}).map(p=>p.id),['left','right','custom-position']);
 const p=ASSORTMENT_PRODUCTS.find(p=>p.id==='shop-bestickungen-5790'),item=createSelection(p);
 const yes=p.customFields.find(f=>/Wollen Sie eine Bestickung/.test(f.name));assert.ok(yes);
 item.sourceFields[yes.id]=yes.values.find(v=>/^nein/i.test(v.label)).id;
 const textField=p.customFields.find(f=>f.type==='text');assert.equal(sourceFieldVisible(p,item,textField),false);
 assert.equal(clubPrice(p,item).pendingNative,true);
});

test('All shops, holiday offers and correct business name are visible',()=>{
 const html=assortmentOverview({page:true});for(const s of ASSORTMENTS)assert.ok(html.includes(`source=${s.id}`));
 const holidays=holidayPage();for(const n of [3,4,7])assert.ok(holidays.includes(`Bis zu ${n} Personen`));
 assert.match(holidays,/mailto:info@fewogauder.de/);assert.ok(!holidays.includes('add-club-cart'));
 const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');assert.match(index,/<b>SYLKE GAUDER<\/b>/);
 assert.ok(!/Silke|Gauner|05663|Knaus/.test(index));
});
