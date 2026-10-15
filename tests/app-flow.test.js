import * as legalui from '../legal-content.js';
import * as storage from '../cart-storage.js';
import * as assortments from '../assortment-core.js';
import * as assortmentui from '../assortment-ui.js';
import * as catalogoptions from '../catalog-options.js';
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
 const nodes=new Map(),saved=new Map(),localSaved=new Map(),documentEvents=new Map(),queries=new Map();
 const node=()=>({innerHTML:'',textContent:'',style:{},hidden:false,value:'',open:false,dataset:{},events:new Map(),attributes:{},classList:{toggle(){},add(){},remove(){}},setAttribute(k,v){this.attributes[k]=v;},getAttribute(k){return this.attributes[k];},addEventListener(k,v){this.events.set(k,v);},focus(){},close(){this.open=false;},showModal(){this.open=true;},querySelector(){return node();}});
 const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);};
 const staticIds=new Set(['main','cart-dialog','cart-content','toast','mobile-menu','cart-count']);
 const select=id=>staticIds.has(id)||[...nodes.values()].some(n=>n.innerHTML.includes('id=\"'+id+'\"'))?get(id):null;
 const context={...legalui,...storage,...assortments,...assortmentui,...catalogoptions,...core,...clubs,...ui,...embroidery,...art,...contacts,e:core.escapeHtml,document:{getElementById:select,querySelector:get,querySelectorAll:s=>queries.get(s)||[],addEventListener:(k,v)=>documentEvents.set(k,v)},sessionStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v),removeItem:k=>saved.delete(k)},localStorage:{getItem:k=>localSaved.get(k)||null,setItem:(k,v)=>localSaved.set(k,v),removeItem:k=>localSaved.delete(k)},location:{hash},window:{scrollTo(){},addEventListener(){}},URLSearchParams,FormData:class{constructor(form){this.fields=form.fields;}get(k){const v=this.fields[k];return Array.isArray(v)?v[0]||null:v??null;}getAll(k){const v=this.fields[k];return Array.isArray(v)?v:v?[v]:[];}},setTimeout:()=>0,clearTimeout(){}};
 vm.createContext(context);vm.runInContext(readFileSync(new URL('../app.js',import.meta.url),'utf8').replace(/^import[^\n]+\n/gm,''),context);
 return {get,saved,localSaved,queries,submit:(fields,valid=true)=>{let prevented=false;get('main').events.get('submit')({target:{id:'newsletter-form',fields,reportValidity:()=>valid},preventDefault(){prevented=true;}});return prevented;},run:source=>vm.runInContext(source,context),click:dataset=>documentEvents.get('click')({target:{closest:()=>({dataset,matches:()=>false})}}),input:(id,value)=>get('main').events.get('input')({target:{id,value,dataset:{}}}),change:(id,value,dataset={})=>get('main').events.get('change')({target:{id,value,dataset}})};
}

test('Club product event flow transfers the full requested logo design to cart and email',()=>{
 const app=application('#/produkt/club-forster-755');
 for(const c of clubs.CLUBS)assert.ok(app.get('main').innerHTML.includes(`<img src="${c.logo}" alt=""`),`${c.id} has an image in the logo picker`);
 app.click({embroideryMode:'custom'});app.click({designBrand:'karmann'});app.click({designPosition:'sleeve'});app.click({designSize:'large'});
 app.change('design-thread','Silber');app.input('design-text','Team Nord');app.input('design-logo-note','Weiß auf Navy');app.change('product-qty','2');
 assert.equal(app.get('embroidery-fields').hidden,false);assert.match(app.get('club-selection-summary').textContent,/Karmann Club/);
 assert.match(app.get('club-design-preview').innerHTML,/assets\/clubs\/karmann-logo.png/);
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
 const shop=application('#/shop');assert.equal((shop.get('shop-grid').innerHTML.match(/<article/g)||[]).length,24);
 const tailor=application('#/masshemden');assert.match(tailor.get('main').innerHTML,/Maßhemd gestalten/);assert.match(tailor.get('main').innerHTML,/Maßbluse gestalten/);
});

test('The cart remembers a selection only after opt-in and privacy deletion clears both stores',()=>{
 const app=application('#/produkt/club-forster-755');
 app.click({action:'add-club-cart'});
 assert.equal(app.saved.size,1);assert.equal(app.localSaved.size,0);
 assert.match(app.get('cart-content').innerHTML,/id="cart-remember" type="checkbox" >/);
 const remember={id:'cart-remember',checked:true};
 app.get('cart-dialog').events.get('change')({target:remember});
 assert.equal(remember.checked,true);assert.equal(app.localSaved.size,2);
 remember.checked=false;app.get('cart-dialog').events.get('change')({target:remember});
 assert.equal(app.localSaved.size,0);assert.equal(app.saved.size,1);
 remember.checked=true;app.get('cart-dialog').events.get('change')({target:remember});
 app.run("location.hash='#/datenschutz';route()");
 assert.match(app.get('main').innerHTML,/data-action="clear-cart"/);
 app.click({action:'clear-cart'});
 assert.equal(app.saved.size,0);assert.equal(app.localSaved.size,0);
 assert.equal(app.run('cart.length'),0);
});

test('Combined shop filters and page controls update results and reset pagination',()=>{
 const app=application('#/shop?source=arbeitsbekleidung');
 assert.match(app.get('result-count').textContent,/322 Produkte/);
 const first=app.get('shop-grid').innerHTML;
 app.click({shopPage:'2'});assert.match(app.get('result-count').textContent,/25–48/);assert.notEqual(app.get('shop-grid').innerHTML,first);
 app.change('shop-source','tischdecke');assert.match(app.get('result-count').textContent,/60 Produkte · 1–24/);
 assert.equal(app.get('shop-title').textContent,'Meine Tischdecke');
 app.change('shop-manufacturer','Dyckhoff');assert.match(app.get('result-count').textContent,/4 Produkte/);
 app.input('shop-search','absichtlich-kein-treffer');assert.match(app.get('result-count').textContent,/Keine Produkte/);
 app.click({action:'reset-search'});assert.match(app.get('result-count').textContent,/633 Produkte/);
 assert.equal(app.get('shop-source').value,'');assert.equal(app.get('shop-manufacturer').value,'');
});

test('An included embroidery request carries its text through the product controls to the cart',()=>{
 const p=assortments.ASSORTMENT_PRODUCTS.find(p=>p.customFields?.some(f=>f.id==='included-text'));
 const app=application(`#/produkt/${p.id}`);
 app.click({action:'add-club-cart'});assert.equal(app.saved.size,0);
 app.change('native-field-0','Sylke Gauder',{nativeOption:'included-text'});
 assert.equal(app.get('club-selection-error').hidden,true);
 app.click({action:'add-club-cart'});
 const cart=JSON.parse(app.saved.get('gauder-design-cart-v1'));assert.equal(cart[0].sourceFields['included-text'],'Sylke Gauder');
 app.click({action:'cart-enquiry'});assert.match(app.get('cart-content').innerHTML,/Sylke Gauder/);
});

test('Logo choice on the product card updates the artwork and continues through configurator and cart',()=>{
 const app=application('#/');
 const initial=app.run('productCard(PRODUCTS[0])');
 assert.doesNotMatch(initial,/assets\/tshirt\.svg/);
 for(const c of clubs.CLUBS)assert.ok(initial.includes(c.logo),`${c.id} logo is available on the card`);
 const preview={},name={},links=[{setAttribute(k,v){this[k]=v;}},{setAttribute(k,v){this[k]=v;}}];
 const buttons=core.CAMPER_BRANDS.map(b=>({dataset:{cardBrand:b.id},setAttribute(k,v){this[k]=v;}}));
 const card={querySelector:s=>s==='[data-card-preview]'?preview:name,querySelectorAll:s=>s==='[data-card-link]'?links:buttons};
 app.queries.set('[data-preview-product="camper-tshirt"]',[card]);
 for(const c of clubs.CLUBS){
  app.click({cardBrand:c.id,cardProductId:'camper-tshirt'});
  assert.ok(preview.innerHTML.includes(`<image href="${c.logo}"`));assert.equal(name.textContent,c.fullName);
  assert.equal(buttons.filter(b=>b['aria-pressed']).length,1);
  assert.ok(links.every(a=>a.href.endsWith(`edition=camper&brand=${c.id}`)));
 }
 app.click({cardBrand:'benimar',cardProductId:'camper-tshirt'});
 app.run(`location.hash=${JSON.stringify(links[0].href)};route()`);
 assert.equal(app.run('selection.brand'),'benimar');
 assert.match(app.get('main').innerHTML,/class="brand-options logo-image-options"/);
 for(const c of clubs.CLUBS)assert.ok(app.get('main').innerHTML.includes(`<img src="${c.logo}" alt=""`));
 app.click({brand:'eura-mobil'});app.click({logoPosition:'lower-left'});app.click({logoSize:'large'});app.click({color:'Navy'});
 assert.match(app.get('garment-preview').innerHTML,/eura-mobil-logo.webp/);
 assert.doesNotMatch(app.get('garment-preview').innerHTML,/benimar-logo.svg/);
 assert.match(app.get('preview-logo-detail').innerHTML,/Eura Mobil Club/);
 app.click({action:'add-cart'});
 const cart=JSON.parse(app.saved.get('gauder-design-cart-v1'));
 assert.equal(cart[0].brand,'eura-mobil');assert.equal(cart[0].logoPosition,'lower-left');assert.equal(cart[0].logoSize,'large');assert.equal(cart[0].color,'Navy');
 assert.match(app.get('cart-content').innerHTML,/eura-mobil-logo.webp/);
 app.click({edition:'classic'});assert.equal(app.get('preview-logo-detail').hidden,true);assert.doesNotMatch(app.get('garment-preview').innerHTML,/<image/);
 app.click({edition:'camper'});app.click({brand:'own'});assert.match(app.get('preview-logo-detail').innerHTML,/Dein eigenes Logo/);assert.doesNotMatch(app.get('garment-preview').innerHTML,/eura-mobil-logo.webp/);
});


test('Newsletter prepares an email request only with consent and never stores subscription data',()=>{
 const app=application('#/newsletter'),html=app.get('main').innerHTML;
 assert.match(html,/id="newsletter-email"[^>]*type="email"[^>]*required/);
 assert.match(html,/id="newsletter-consent"[^>]*required/);assert.doesNotMatch(html,/id="newsletter-consent"[^>]*checked/);
 assert.match(html,/#\/datenschutz/);assert.match(html,/kein automatischer Eintrag/);
 const fields={'newsletter-name':'Anna <3','newsletter-email':'anna+club@example.com','newsletter-interest':['Camper & Club-Kollektionen'],'newsletter-consent':'yes'};
 app.submit(fields,false);assert.equal(app.get('newsletter-result').hidden,true);
 app.submit({...fields,'newsletter-consent':null});assert.equal(app.get('newsletter-result').hidden,true);
 assert.equal(app.submit(fields),true);
 const result=app.get('newsletter-result').innerHTML;
 assert.match(result,/Anfrage ist vorbereitet/);assert.match(result,/noch nicht automatisch angemeldet/);assert.match(result,/Anna &lt;3/);
 const href=result.match(/id="newsletter-mail-link"[^>]+href="([^"]+)"/)[1].replaceAll('&amp;','&');
 const url=new URL(href);assert.equal(url.protocol,'mailto:');assert.equal(url.pathname,'info@handelsvertretung-gauder.de');
 const text=url.searchParams.get('body');assert.match(text,/anna\+club@example.com/);assert.match(text,/Meine Themen: Camper & Club-Kollektionen/);assert.match(text,/Meine Einwilligung/);assert.match(text,/widerrufen/);
 assert.equal(app.saved.size,0);assert.equal(app.run('location.hash'),'#/newsletter');
 app.input('newsletter-email','andere@example.com');assert.equal(app.get('newsletter-result').hidden,true);assert.equal(app.get('newsletter-result').innerHTML,'');
 app.submit({...fields,'newsletter-name':'','newsletter-interest':[]});
 const all=app.get('newsletter-result').innerHTML;for(const topic of ['Geschenkideen','Club-Kollektionen','Maßhemden'])assert.ok(all.includes(topic));
 app.change('newsletter-consent','');assert.equal(app.get('newsletter-result').hidden,true);
 assert.match(application('#/').get('main').innerHTML,/id="newsletter-form"/);
});
