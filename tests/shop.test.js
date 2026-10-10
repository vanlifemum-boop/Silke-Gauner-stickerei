import test from 'node:test';
import assert from 'node:assert/strict';
import {PRODUCTS, PERSONALIZATION_PRICE, filterProducts, unitPrice, cartTotal, cartQuantity, addItem, sanitizeCart, enquiryText, escapeHtml, createSelection, CAMPER_BRANDS, LOGO_POSITIONS, LOGO_SIZES, priceParts, itemKey} from '../shop-core.js';
const base={productId:'team-polo',color:'Anthrazit',size:'M',text:'',thread:'Rot',font:'Schreibschrift',qty:2};
test('Price arithmetic includes embroidery once per unit and preserves integer cents',()=>{
 const personalized={...base,text:'Müller & Team',qty:3};
 assert.equal(unitPrice(base),2990);
 assert.equal(unitPrice(personalized),2990+PERSONALIZATION_PRICE);
 assert.equal(unitPrice({...base,text:'  '}),2990);
 assert.equal(cartTotal([base,personalized]),17320);
 assert.equal(cartQuantity([base,personalized]),5);
});
test('Equal variants merge while different personalization remains separate',()=>{
 let cart=addItem([],{...base});
 cart=addItem(cart,{...base,qty:1});assert.equal(cart.length,1);assert.equal(cart[0].qty,3);
 cart=addItem(cart,{...base,text:'Anna',qty:1});assert.equal(cart.length,2);
 cart=addItem(cart,{...base,size:'L',qty:1});assert.equal(cart.length,3);
 assert.equal(addItem(cart,{...base,qty:999})[0].qty,99);
 assert.equal(addItem([],{...base,qty:-2})[0].qty,1);
});
test('Persisted cart drops invalid entries, validates variants and does not trust stored prices',()=>{
 const restored=sanitizeCart([{...base,price:1,qty:999},{...base,productId:'missing'},{...base,color:'invalid'},null,{...base,text:'x'.repeat(200),thread:'invalid'}]);
 assert.equal(restored.length,2);assert.equal(restored[0].qty,99);assert.equal(unitPrice(restored[0]),2990);
 assert.equal(restored[1].text.length,20);assert.equal(restored[1].thread,'Rot');
 assert.deepEqual(sanitizeCart({}),[]);
});
test('Search, category and price sorting compose, including empty results',()=>{
 assert.ok(filterProducts({category:'Bekleidung'}).length>3);
 assert.ok(filterProducts({category:'Hosen & Shorts'}).some(p=>/hose|pants/i.test(p.name)));
 assert.equal(filterProducts({category:'Maßhemden'}).length,2);
 assert.equal(filterProducts({query:'  HANDTUCH '})[0].id,'namens-handtuch');
 assert.equal(filterProducts({query:'SHIRT',category:'Tischwäsche'}).length,0);
 const ascending=filterProducts({sort:'price-asc'}).map(p=>p.price??Infinity);
 assert.deepEqual(ascending,[...ascending].sort((a,b)=>a-b));
 assert.equal(filterProducts({query:'nonexistent-xyz'}).length,0);
 assert.equal(filterProducts().length,PRODUCTS.length);
});
test('Enquiry preserves configuration and explicitly identifies example prices',()=>{
 const result=enquiryText([{...base,text:'A&B <Team>',qty:2}]);
 assert.match(result,/A&B <Team>/);assert.match(result,/Größe: M/);assert.match(result,/Garn: Rot/);
 assert.match(result,/75,60/);assert.match(result,/Beispielpreise/);assert.match(result,/unverbindliches Angebot/);
});
test('User-controlled text is escaped before HTML interpolation',()=>{
 assert.equal(escapeHtml('<img src=x onerror="1"> & \'x\''),'&lt;img src=x onerror=&quot;1&quot;&gt; &amp; &#39;x&#39;');
});

const shirt=PRODUCTS.find(p=>p.id==='camper-tshirt');
const camper=createSelection(shirt,{edition:'camper',color:'Rot',size:'XL',brand:'benimar',logoPosition:'sleeve',logoSize:'small',qty:3});
test('All camper brands, positions and logo sizes survive storage with prices recomputed',()=>{
 let count=0;
 for(const brand of CAMPER_BRANDS)for(const position of LOGO_POSITIONS)for(const size of LOGO_SIZES){
  const item={...camper,brand:brand.id,logoPosition:position.id,logoSize:size.id,price:1};
  const restored=sanitizeCart(JSON.parse(JSON.stringify([item])));
  assert.equal(restored.length,1);assert.equal(itemKey(restored[0]),itemKey(item));
  assert.equal(unitPrice(restored[0]),2490+size.price);
  assert.equal(cartTotal(restored),(2490+size.price)*3);count++;
 }
 assert.equal(count,CAMPER_BRANDS.length*LOGO_POSITIONS.length*LOGO_SIZES.length);
});
test('Large-logo surcharge scales by quantity and is removed for classic edition',()=>{
 assert.equal(unitPrice(camper),3280);
 const large={...camper,logoSize:'large'};
 assert.equal(unitPrice(large),3980);
 assert.equal(cartTotal([large])-cartTotal([camper]),2100);
 assert.deepEqual(priceParts({...large,text:'Anna'}),{base:2490,logo:1490,text:790});
 assert.equal(unitPrice({...large,edition:'classic'}),2490);
 assert.equal(unitPrice({...large,edition:'classic',text:'Anna'}),3280);
});
test('Logo brand, placement and size create separate cart lines; identical configurations merge',()=>{
 let cart=addItem([],camper);
 cart=addItem(cart,{...camper,qty:2});assert.equal(cart[0].qty,5);
 cart=addItem(cart,{...camper,brand:'eura-mobil'});
 cart=addItem(cart,{...camper,logoPosition:'lower-left'});
 cart=addItem(cart,{...camper,logoSize:'large'});
 cart=addItem(cart,createSelection(shirt,{...camper,edition:'classic'}));
 assert.equal(cart.length,5);
 assert.equal(sanitizeCart(JSON.parse(JSON.stringify(cart))).length,5);
});
test('Product switching retains supported choices and drops unsupported camper options',()=>{
 const polo=createSelection(PRODUCTS.find(p=>p.id==='team-polo'),camper);
 assert.equal(polo.color,'Rot');assert.equal(polo.size,'XL');assert.equal(polo.edition,'camper');
 assert.equal(polo.brand,'benimar');assert.equal(polo.qty,3);
 const towel=createSelection(PRODUCTS.find(p=>p.id==='namens-handtuch'),camper);
 assert.equal(towel.edition,'camper');assert.equal(towel.brand,'benimar');assert.equal(towel.logoSize,'small');assert.equal(towel.logoPosition,'corner');
 assert.equal(priceParts(towel).logo,790);assert.equal(towel.size,'50 × 100 cm');
 assert.equal(createSelection(shirt).size,'M');
});
test('Invalid stored camper variants are rejected, and older carts remain classic',()=>{
 for(const invalid of [{brand:'missing'},{logoPosition:'back'},{logoSize:'huge'},{edition:'other'},{productId:'namens-handtuch',color:'Rot',size:'50 × 100 cm'}])assert.equal(sanitizeCart([{...camper,...invalid}]).length,0);
 assert.equal(sanitizeCart([base])[0].edition,'classic');
 const staleClassic=sanitizeCart([{...camper,edition:'classic'}])[0];
 assert.equal(staleClassic.brand,'');assert.equal(priceParts(staleClassic).logo,0);
 assert.equal(sanitizeCart([{...camper,qty:-1}])[0].qty,1);
});
test('Camper enquiry contains the full chosen variant and unit/multiple prices',()=>{
 const text=enquiryText([{...camper,logoSize:'large',text:'Anna'}]);
 for(const expected of ['Camper Edition','Benimar','Rot','XL','Am Ärmel','Großes Logo','14,90','47,70','143,10','Anna'])assert.ok(text.includes(expected),expected);
 assert.equal(filterProducts({category:'Camper Edition'}).length,127);
 assert.ok(filterProducts({category:'Camper Edition',query:'Eura Mobil'}).length>3);
});
