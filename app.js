
const els={oar:oarSelect,interval:timeSelect,limit:limit,recovery:recovery,dose1:dose1,fx1:fx1,dose2:dose2,fx2:fx2,ab:ab,eqd21:eqd21,eqd21corr:eqd21corr,eqd22:eqd22,total:total,reserve:reserve,summary:summary,copyBtn:copyBtn};
OAR_DATA.forEach(r=>{let o=document.createElement('option');o.value=r.OAR;o.text=r.OAR;els.oar.appendChild(o);});
function round(x){return Number(x).toFixed(2);}
function updateSuggestion(){let r=OAR_DATA.find(x=>x.OAR===els.oar.value);if(!r)return;els.limit.value=r['D0.1cc EQD2 limit'];els.recovery.value=r[els.interval.value]||'';compute();}
function compute(){let d1=+els.dose1.value,f1=+els.fx1.value,d2=+els.dose2.value,f2=+els.fx2.value,ab=+els.ab.value,rec=+els.recovery.value,limit=+els.limit.value;let dpf1=d1/f1,dpf2=d2/f2;let bed1=d1*(1+dpf1/ab),bed2=d2*(1+dpf2/ab);let eqd21=bed1/(1+2/ab),eqd22=bed2/(1+2/ab);let corrected=eqd21*(1-rec/100),total=corrected+eqd22;els.eqd21.innerText=round(eqd21)+' Gy';els.eqd21corr.innerText=round(corrected)+' Gy';els.eqd22.innerText=round(eqd22)+' Gy';els.total.innerText=round(total)+' Gy';els.reserve.innerText=round(limit-total)+' Gy';els.summary.textContent=`OAR: ${els.oar.value}
Course1 EQD2: ${round(eqd21)}
Course1 EQD2 corrected: ${round(corrected)}
Course2 EQD2: ${round(eqd22)}
Total EQD2: ${round(total)}
EQD2 Reserve: ${round(limit-total)}`;}
oarSelect.onchange=updateSuggestion;timeSelect.onchange=updateSuggestion;document.querySelectorAll('input').forEach(i=>i.oninput=compute);copyBtn.onclick=()=>navigator.clipboard.writeText(els.summary.textContent);updateSuggestion();
