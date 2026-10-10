import test from 'node:test';
import assert from 'node:assert/strict';
import {clubById,clubProducts,createClubSelection,clubPrice,clubSourceUrl} from '../club-core.js';
import {PRODUCTS,createSelection,sanitizeCart,addItem,enquiryText,itemKey} from '../shop-core.js';
import {clubCatalog} from '../club-ui.js';
import {garmentPreview} from '../garment-preview.js';
import {logoPositions} from '../embroidery-core.js';

test('Waumobil is a full catalogue tab and a selectable logo on existing textile designs',()=>{
 const c=clubById('waumobil');assert.equal(c.status,'ready');assert.equal(clubProducts(c.id).length,32);
 assert.doesNotMatch(JSON.stringify(clubProducts(c.id)),/05663|938[ -]*548|Knaus/i);
 assert.match(clubCatalog(c),/32 Produkte/);assert.match(clubCatalog(c),/waumobil-logo.svg/);
 const p=PRODUCTS.find(p=>p.id==='camper-tshirt'),item=createSelection(p,{edition:'camper',brand:'waumobil',logoPosition:'sleeve',logoSize:'large'});
 assert.equal(item.brand,'waumobil');assert.equal(sanitizeCart([item])[0].brand,'waumobil');assert.match(garmentPreview(p,item),/assets\/clubs\/waumobil-logo.svg/);
 assert.match(enquiryText([item]),/Waumobil/);
 for(const name of ['Fleece Decke mit Waumobil Logo','Hundetuch mit Waumobil Logo'])assert.equal(logoPositions({name})[0].id,'corner');
 assert.ok(!logoPositions({name:'Baumwoll Gesichtsmaske'}).some(p=>p.id==='chest'));
});

test('Verified Waumobil chest and large back logo prices are distinct and persist in the enquiry',()=>{
 const p=PRODUCTS.find(p=>p.id==='club-waumobil-406');
 const chest={...createClubSelection(p),qty:2,options:{'7':'216','9':'192','12':'218'}};
 const back={...chest,options:{...chest.options,'12':'217'}};
 assert.equal(clubPrice(p,chest).amount,2495);assert.equal(clubPrice(p,chest).from,false);
 assert.equal(clubPrice(p,back).amount,3521);assert.equal(clubPrice(p,back).from,false);
 assert.notEqual(itemKey(chest),itemKey(back));
 const cart=addItem(addItem([],chest),back);assert.equal(cart.length,2);assert.deepEqual(sanitizeCart(JSON.parse(JSON.stringify(cart))),cart);
 const body=enquiryText(cart);for(const text of ['Waumobil','nur Brustlogo','Brust und Rücken groß','24,95','35,21','49,90','70,42'])assert.ok(body.includes(text),text);
 assert.equal(new URL(clubSourceUrl(p,back)).searchParams.get('group[12]'),'217');
 const unknown={...back,options:{...back.options,'7':'219'}};assert.equal(clubPrice(p,unknown).from,true);
});
