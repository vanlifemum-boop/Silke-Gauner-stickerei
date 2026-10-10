import test from 'node:test';
import assert from 'node:assert/strict';
import {PRODUCTS, PERSONALIZATION_PRICE, filterProducts, unitPrice, cartTotal, cartQuantity, addItem, sanitizeCart, enquiryText, escapeHtml} from '../shop-core.js';
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
 assert.equal(filterProducts({category:'Bekleidung'}).length,2);
 assert.equal(filterProducts({query:'  HANDTUCH '})[0].id,'namens-handtuch');
 assert.equal(filterProducts({query:'SHIRT',category:'Tischwäsche'}).length,0);
 const ascending=filterProducts({sort:'price-asc'}).map(p=>p.price);
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
