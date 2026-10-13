const text=value=>String(value??'');
const decode=value=>{try{return decodeURIComponent(text(value));}catch{return text(value);}};
const normalize=value=>decode(value).replace(/_\d+$/,'').trim().toLocaleLowerCase('de');
export const sourceFieldsFor=p=>(p.customFields||[]);
export function sourceFieldDefaults(p,previous={}){
 const result={};
 for(const f of sourceFieldsFor(p)){
  const old=text(previous?.[f.id]);
  if(f.values?.length)result[f.id]=f.values.some(v=>v.id===old&&!v.disabled)?old:f.default||f.values.find(v=>v.selected&&!v.disabled)?.id||f.values.find(v=>/^nein\b/i.test(v.label))?.id||(f.values.length===1?f.values[0].id:'');
  else result[f.id]=old.slice(0,f.maxLength||250);
 }
 return result;
}
function conditionResult(p,item,condition){
 if(!condition||typeof condition!=='object'||!Array.isArray(condition.rules))return true;
 const checks=condition.rules.map(rule=>{
  const reference=(p.sourceCustomOptions||[]).find(f=>f.id.match(/_(\d+)$/)?.[1]===text(rule.element));
  const variantRule=p.variants?.some(v=>String(v.sourceVariantId)===String(rule.value));
  let value=reference&&!variantRule?item.sourceFields?.[reference.id]??item.options?.[reference.id]??'':p.variants.find(v=>p.options.filter(g=>g.id.startsWith('attribute_')).every(g=>v.options[g.id]===item.options?.[g.id]||v.wildcardOptions?.includes(g.id)))?.sourceVariantId||'';
  if(reference?.values?.length&&!variantRule)value=reference.values.find(v=>v.id===value)?.label||value;
  const actual=normalize(value),expected=normalize(rule.value);
  if(rule.operator==='isnotempty')return actual!=='';
  if(rule.operator==='isempty')return actual==='';
  if(rule.operator==='isnot')return actual!==expected;
  return actual===expected;
 });
 const match=condition.what==='any'?checks.some(Boolean):checks.every(Boolean);
 return condition.toggle==='hide'?!match:match;
}
export function sourceFieldVisible(p,item,f){
 return conditionResult(p,item,f.conditions)&&(f.ancestorConditions||[]).every(c=>conditionResult(p,item,c));
}
export function sourceFieldsError(p,item){
 for(const f of sourceFieldsFor(p)){
  if(f.type==='file'||!sourceFieldVisible(p,item,f))continue;
  const value=text(item.sourceFields?.[f.id]);
  if(f.required&&!value.trim())return `Bitte ergänze: ${f.name}.`;
  if(f.values?.length&&value&&!f.values.some(v=>v.id===value&&!v.disabled))return `Bitte wähle eine verfügbare Ausführung für ${f.name}.`;
  if(!f.values?.length&&value.length>(f.maxLength||250))return `Bitte kürze die Angabe für ${f.name}.`;
 }
 return '';
}
export function sourceFieldLabels(p,item){
 return sourceFieldsFor(p).filter(f=>f.type!=='file'&&sourceFieldVisible(p,item,f)&&text(item.sourceFields?.[f.id]).trim()).map(f=>({name:f.name,value:f.values?.find(v=>v.id===item.sourceFields[f.id])?.label||item.sourceFields[f.id]}));
}
