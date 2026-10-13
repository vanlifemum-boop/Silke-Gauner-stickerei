import { ASSORTMENT_PRODUCTS, CATALOG_GROUPS, CATALOG_CORRECTIONS } from './assortment-products.js?v=20261012-catalog';
export { ASSORTMENT_PRODUCTS, CATALOG_GROUPS, CATALOG_CORRECTIONS };

export const ASSORTMENTS=[
 {id:'stoelzinga',name:'Stölzinga',fullName:'Stölzinga',shopName:'Stölzinga Shop',sourceUrl:'https://stoelzinga.de/',eyebrow:'FÜR DEINEN ALLTAG',description:'Bekleidung, Heimtextilien, Taschen und persönliche Begleiter.',symbol:'S',image:'assets/polo.webp'},
 {id:'arbeitsbekleidung',name:'Arbeitsbekleidung',fullName:'Arbeitsbekleidung besticken',shopName:'Arbeitsbekleidung besticken',sourceUrl:'https://arbeitsbekleidung-besticken.de/',eyebrow:'FÜR DEIN TEAM',description:'Shirts, Hemden, Hosen, Jacken und Westen für euren gemeinsamen Auftritt.',symbol:'A',image:'assets/hoodie.webp'},
 {id:'tischdecke',name:'Meine Tischdecke',fullName:'Meine Tischdecke',shopName:'Meine Tischdecke',sourceUrl:'https://www.meinetischdecke.de/',eyebrow:'FÜR DEIN ZUHAUSE',description:'Tischwäsche, Wunschmaße, Tischschutz und Küchenaccessoires.',symbol:'T',image:'assets/table.webp'},
 {id:'bestickungen',name:'Bestickungen nach Maß',fullName:'Bestickungen nach Maß',shopName:'Bestickungen nach Maß',sourceUrl:'https://bestickungen-nach-mass.de/',eyebrow:'FÜR DEINE IDEEN',description:'Textilien mit Schrift, Logo oder Motiv – und persönliche Geschenkideen.',symbol:'B',image:'assets/towel.webp'},
 {id:'pferdezubehoer',name:'Pferdezubehör',fullName:'Pferdezubehör besticken',shopName:'Pferdezubehör besticken',sourceUrl:'https://pferdezubehoer-besticken.de/',eyebrow:'FÜR PFERD & REITER',description:'Schabracken, Pferdedecken und Zubehör mit deiner persönlichen Stickerei.',symbol:'P',image:null}
];
export const assortmentById=id=>ASSORTMENTS.find(s=>s.id===id);
export const productSources=p=>p.sources?.length?p.sources:p.catalog?[p.catalog]:p.club?[p.club]:p.tailored?['masshemden']:['produktideen'];
export const assortmentProducts=id=>ASSORTMENT_PRODUCTS.filter(p=>productSources(p).includes(id));
export const manufacturerName=p=>typeof p.manufacturer==='string'?p.manufacturer:p.manufacturer?.name||'';
export const manufacturerNames=()=>[...new Set(ASSORTMENT_PRODUCTS.map(manufacturerName).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'de'));
export const PAGE_SIZE=24;
export function paginateProducts(items,page=1){
 const pages=Math.max(1,Math.ceil(items.length/PAGE_SIZE));
 const current=Math.min(pages,Math.max(1,Number.parseInt(page,10)||1));
 return {items:items.slice((current-1)*PAGE_SIZE,current*PAGE_SIZE),page:current,pages,total:items.length,start:items.length?(current-1)*PAGE_SIZE+1:0,end:Math.min(current*PAGE_SIZE,items.length)};
}
