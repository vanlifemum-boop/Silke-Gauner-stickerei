export const LOGO_BRANDS=[{id:'forster',name:'Forster'},{id:'benimar',name:'Benimar'},{id:'karmann',name:'Karmann Club'},{id:'eura-mobil',name:'Eura Mobil'},{id:'waumobil',name:'Waumobil'},{id:'own',name:'Eigenes Firmen- oder Vereinslogo'}];
export const DESIGN_SIZES=[{id:'small',label:'Kleines Logo',detail:'Dezent & persönlich'},{id:'large',label:'Großes Logo',detail:'Größere Stickfläche · höherer Aufwand'}];
export const DESIGN_THREADS=['Wie im Logo','Rot','Weiß','Anthrazit','Navy','Silber'];
const positions={
 horse:[['left','Links seitlich'],['right','Rechts seitlich'],['custom-position','Position nach Absprache']],
 upper:[['chest','Vorne auf der Brust'],['sleeve','Am Ärmel'],['lower-left','Unten links']],
 vest:[['chest','Vorne auf der Brust'],['back','Auf dem Rücken'],['lower-left','Unten links']],
 apron:[['chest','Vorne auf dem Latz'],['pocket','Auf der Tasche'],['lower-left','Unten links']],
 mask:[['left','Links außen'],['right','Rechts außen'],['custom-position','Position nach Absprache']],
 trousers:[['thigh','Vorne am Oberschenkel'],['back-pocket','Auf der Gesäßtasche'],['lower-leg','Unten am Hosenbein']],
 cap:[['front','Vorne mittig'],['side','Seitlich'],['back','Hinten']],
 flat:[['corner','Unten links / Ecke'],['center','Mittig'],['border','Am Rand / auf der Bordüre']],
 bag:[['front','Vorne'],['side','Seitlich'],['lower-left','Unten links']],
 braces:[['front','Vorne auf dem Träger'],['back','Hinten auf dem Träger'],['custom-position','Position nach Absprache']],
 socks:[['shaft','Am Schaft'],['side','Seitlich'],['custom-position','Position nach Absprache']]
};
export function textileKind(p){
 const name=p.name.toLowerCase();
 if(/schabracke|absch witzdecke|abschwitzdecke|pferdedecke|fliegenhaube|satteldecke/.test(name))return 'horse';
 if(/hosenträger/.test(name))return 'braces';
 if(/weste|\bvest\b/.test(name))return 'vest';
 if(/schürze/.test(name))return 'apron';
 if(/gesichtsmaske|mund.*nas|maske/.test(name))return 'mask';
 if(/hose|pants|bermuda|shorts/.test(name))return 'trousers';
 if(/sock/.test(name))return 'socks';
 if(/cap|beanie|mütze/.test(name))return 'cap';
 if(/tasche|korb|hülle/.test(name))return 'bag';
 if(/handtuch|handtücher|tisch|matte|schal|halstuch|schonbezug|decke|hundetuch/.test(name))return 'flat';
 return 'upper';
}
export const canEmbroider=p=>!!p&&p.embroideryAvailable!==false&&!/gutschein/i.test(p.name);
export const logoPositions=p=>positions[textileKind(p)].map(([id,label])=>({id,label,short:label,detail:label}));
export function createEmbroidery(p,previous={}){
 previous=previous||{};
 const choices=logoPositions(p);
 return {mode:canEmbroider(p)&&previous.mode==='custom'?'custom':'standard',brand:LOGO_BRANDS.some(b=>b.id===previous.brand)?previous.brand:p.club||'own',position:choices.some(x=>x.id===previous.position)?previous.position:choices[0].id,size:DESIGN_SIZES.some(x=>x.id===previous.size)?previous.size:'small',thread:DESIGN_THREADS.includes(previous.thread)?previous.thread:'Wie im Logo',text:String(previous.text||'').slice(0,20),logoNote:String(previous.logoNote||'').slice(0,150)};
}
export function embroideryError(p,design){
 if(!design)return '';
 if(!['standard','custom'].includes(design.mode))return 'Bitte wähle eine Bestickungsart.';
 if(design.mode==='standard')return '';
 if(!canEmbroider(p)||!LOGO_BRANDS.some(b=>b.id===design.brand)||!logoPositions(p).some(x=>x.id===design.position)||!DESIGN_SIZES.some(x=>x.id===design.size)||!DESIGN_THREADS.includes(design.thread))return 'Bitte wähle Logo, Position, Größe und Garnfarbe vollständig aus.';
 if(typeof design.text!=='string'||design.text.length>20||typeof design.logoNote!=='string'||design.logoNote.length>150)return 'Bitte kürze deinen Wunschtext oder die Logo-Beschreibung.';
 return '';
}
export function embroideryLabels(p,design){
 if(!design||design.mode!=='custom')return [];
 const labels=[{name:'Wunschlogo',value:LOGO_BRANDS.find(b=>b.id===design.brand)?.name||''},{name:'Stickposition',value:logoPositions(p).find(x=>x.id===design.position)?.label||''},{name:'Logogröße',value:DESIGN_SIZES.find(x=>x.id===design.size)?.label||''},{name:'Garnfarbe',value:design.thread}];
 if(design.text?.trim())labels.push({name:'Zusätzlicher Wunschtext',value:design.text.trim()});
 if(design.logoNote?.trim())labels.push({name:'Logo-Beschreibung',value:design.logoNote.trim()});
 labels.push({name:'Individuelle Bestickung',value:'Aufpreis nach Angebot; noch nicht im Grundpreis enthalten'});
 return labels;
}
export const embroideryKey=d=>d?.mode==='custom'?[d.brand,d.position,d.size,d.thread,d.text?.trim()||'',d.logoNote?.trim()||'']:null;
