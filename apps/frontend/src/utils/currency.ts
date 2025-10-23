export interface Money { amountCents: number; currency: string; }

export const centsToDisplay = (c:number|null|undefined)=>((c??0)/100).toFixed(2);
export const centsToAmount  = (c:number|null|undefined)=> (c??0)/100;

export function amountToCents(a:string|number){
  const n = typeof a==='string' ? parseFloat(a.replace(/,/g,'')) : a;
  return isNaN(n) ? 0 : Math.round(n*100);
}

export function formatMoney(
  amountCents:number|null|undefined,
  currency='USD',
  locale='en-US'
){
  return new Intl.NumberFormat(locale,{style:'currency',currency}).format((amountCents??0)/100);
}

export function formatMoneyPlain(amountCents:number|null|undefined,locale='en-US'){
  return new Intl.NumberFormat(locale,{minimumFractionDigits:2,maximumFractionDigits:2})
    .format((amountCents??0)/100);
}

export function validateMoneyInput(input:string){
  const cleaned = input.replace(/[^0-9.]/g,'');
  const num = parseFloat(cleaned);
  if (isNaN(num) || num < 0) return null;
  return Math.round(num*100);
}

export const createMoney=(amountCents:number,currency='USD'):Money=>({amountCents,currency});

