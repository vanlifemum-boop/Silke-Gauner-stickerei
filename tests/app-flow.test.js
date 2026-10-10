import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import * as core from '../shop-core.js';
import * as clubs from '../club-core.js';
import * as ui from '../club-ui.js';
import * as embroidery from '../embroidery-core.js';
import * as art from '../garment-preview.js';
import * as contacts from '../contact.js';

// Exercises the actual route and event handlers with in-memory DOM endpoints.
// Layout, native browser behavior and rendering are outside this test's scope.
function application(hash){
 const nodes=new Map(),saved=new Map(),documentEvents=new Map();
 const node=()=>({innerHTML:'',textContent:'',style:{},hidden:false,value:'',open:false,dataset:{},events:new Map(),attributes:{},classList:{toggle(){},add(){},remove(){}},setAttribute(k,v){this.attributes[k]=v;},getAttribute(k){return this.attributes[k];},addEventListener(k,v){this.events.set(k,v);},focus(){},close(){this.open=false;},showModal(){this.open=true;},querySelector(){return node();}});
 const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);};
 const staticIds=new Set(['main','cart-dialog','cart-content','toast','mobile-menu','cart-count']);
 const select=id=>staticIds.has(id)||[...nodes.values()].some(n=>n.innerHTML.includes('id=\"'+id+'\"'))?get(id):null;
 const context={...core,...clubs,...ui,...embroidery,...art,...contacts,e:core.escapeHtml,document:{getElementById:select,querySelector:get,querySelectorAll:()=>[],addEventListener:(k,v)=>documentEvents.set(k,v)},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},location:{hash},window:{scrollTo(){},addEventListener(){}},URLSearchParams,setTimeout:()=>0,clearTimeout(){}};
 vm.createContext(context);vm.runInContext(readFileSync(new URL('../app.js',import.meta.url),'utf8').replace(/^import[^\n]+\n/gm,''),context);
 return {get,saved,run:source=>vm.runInContext(source,context),click:dataset=>documentEvents.get('click')({target:{closest:()=>({dataset,matches:()=>false})}}),input:(id,value)=>get('main').events.get('input')({target:{id,value,dataset:{}}}),change:(id,value,dataset={})=>get('main').events.get('change')({target:{id,value,dataset}})};
}

test('Club product event flow transfers the full requested logo design to cart and email',()=>{
 const app=application('#/produkt/club-forster-755');
 app.click({embroideryMode:'custom'});app.click({designBrand:'karmann'});app.click({designPosition:'sleeve'});app.click({designSize:'large'});
 app.change('design-thread','Silber');app.input('design-text','Team Nord');app.input('design-logo-note','Weiß auf Navy');app.change('product-qty','2');
 assert.equal(app.get('embroidery-fields').hidden,false);assert.match(app.get('club-selection-summary').textContent,/Karmann Club/);
 app.click({action:'add-club-cart'});
 const cart=JSON.parse(app.saved.get('gauder-design-cart-v1'));
 assert.equal(cart.length,1);assert.equal(cart[0].qty,2);assert.equal(cart[0].embroidery.size,'large');assert.equal(cart[0].embroidery.logoNote,'Weiß auf Navy');assert.equal(cart[0].embroidery.thread,'Silber');
 assert.match(app.get('cart-content').innerHTML,/Großes Logo/);assert.match(app.get('cart-content').innerHTML,/noch nicht in der Summe/);
 app.click({action:'cart-enquiry'});assert.match(app.get('cart-content').innerHTML,/Team Nord/);assert.match(app.get('cart-content').innerHTML,/Karmann Club/);
});

test('Tailored product event flow handles short sleeves, custom fabric and an unpriced inquiry',()=>{
 const app=application('#/produkt/massbluse');
 app.change('club-option-sleeve','1',{clubOption:'sleeve'});assert.equal(app.get('club-option-cuff').disabled,true);
 app.input('fabric-wish','Weiß mit Kontrastkragen');app.click({embroideryMode:'custom'});app.input('design-text','SG');
 app.click({action:'add-club-cart'});
 const cart=JSON.parse(app.saved.get('gauder-design-cart-v1'));
 assert.equal(cart[0].edition,'tailored');assert.equal(cart[0].fabricWish,'Weiß mit Kontrastkragen');assert.equal(cart[0].embroidery.text,'SG');
 assert.ok(!app.get('cart-content').innerHTML.includes('0,00'));assert.match(app.get('cart-content').innerHTML,/Preis auf Anfrage/);
 assert.match(app.get('cart-content').innerHTML,/Entfällt bei Kurzarm/);
});

test('The full shop and the dedicated tailoring route render through the router',()=>{
 const shop=application('#/shop');assert.equal((shop.get('shop-grid').innerHTML.match(/<article/g)||[]).length,99);
 const tailor=application('#/masshemden');assert.match(tailor.get('main').innerHTML,/Maßhemd gestalten/);assert.match(tailor.get('main').innerHTML,/Maßbluse gestalten/);
});
