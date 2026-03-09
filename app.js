const els={
oar:document.getElementById('oarSelect'),
interval:document.getElementById('timeSelect'),
limit:document.getElementById('limit'),
recovery:document.getElementById('recovery'),
dose1:document.getElementById('dose1'),
fx1:document.getElementById('fx1'),
dose2:document.getElementById('dose2'),
fx2:document.getElementById('fx2'),
ab:document.getElementById('ab'),
eqd21:document.getElementById('eqd21'),
eqd22:document.getElementById('eqd22'),
total:document.getElementById('total'),
reserve:document.getElementById('reserve'),
statusCard:document.getElementById('statusCard'),
statusText:document.getElementById('statusText'),
summary:document.getElementById('summaryText'),
copyBtn:document.getElementById('copyBtn')
};

const data=OAR_DATA;

data.forEach(r=>{
 let o=document.createElement("option");
 o.value=r.OAR;
 o.text=r.OAR;
 els.oar.appendChild(o);
});

function round2(x){ return Number(x).toFixed(2); }

function findRecovery(row,i){
 if(row[i]!==undefined) return row[i];
 for(let k in row){ if(String(k).trim()===String(i).trim()) return row[k]; }
 return "";
}

function updateSuggestion(){
 let row=data.find(r=>r.OAR===els.oar.value);
 if(!row) return;
 els.limit.value=row["D0.1cc EQD2 limit"];
 els.recovery.value=findRecovery(row,els.interval.value);
 compute();
}

function setStatus(total, limit){
 const reserve = limit - total;
 els.statusCard.className = "status";
 if(limit<=0){
  els.statusCard.classList.add("neutral");
  els.statusText.innerText="Enter a valid D0.1cc EQD2 limit to compare the result.";
  return;
 }
 if(total < limit - 5){
  els.statusCard.classList.add("safe");
  els.statusText.innerText=`Within proposed limit: Total EQD2 ${round2(total)} Gy is below the D0.1cc EQD2 limit ${round2(limit)} Gy by ${round2(reserve)} Gy.`;
 } else if(total <= limit){
  els.statusCard.classList.add("caution");
  els.statusText.innerText=`Caution: Total EQD2 ${round2(total)} Gy is close to the D0.1cc EQD2 limit ${round2(limit)} Gy. EQD2 Reserve: ${round2(reserve)} Gy.`;
 } else {
  els.statusCard.classList.add("exceed");
  els.statusText.innerText=`Exceeds proposed limit: Total EQD2 ${round2(total)} Gy is above the D0.1cc EQD2 limit ${round2(limit)} Gy by ${round2(-reserve)} Gy.`;
 }
}

function compute(){
 let d1=Number(els.dose1.value);
 let f1=Number(els.fx1.value);
 let d2=Number(els.dose2.value);
 let f2=Number(els.fx2.value);
 let ab=Number(els.ab.value);
 let rec=Number(els.recovery.value);
 let limit=Number(els.limit.value);

 let dpf1=d1/f1;
 let dpf2=d2/f2;

 let bed1=d1*(1+dpf1/ab);
 let bed2=d2*(1+dpf2/ab);

 let eqd21=bed1/(1+2/ab);
 let eqd22=bed2/(1+2/ab);

 let corrected=eqd21*(1-rec/100);
 let total=corrected+eqd22;
 let reserve=limit-total;

 els.eqd21.innerText=round2(eqd21)+" Gy";
 els.eqd22.innerText=round2(eqd22)+" Gy";
 els.total.innerText=round2(total)+" Gy";
 els.reserve.innerText=round2(reserve)+" Gy";

 setStatus(total, limit);

 const intervalLabel = els.interval.options[els.interval.selectedIndex].text;
 els.summary.textContent =
`SMPC Re-irradiation EQD2 Summary

OAR: ${els.oar.value}
Time interval: ${intervalLabel}
D0.1cc EQD2 limit: ${round2(limit)} Gy
Recovery factor: ${round2(rec)} %
Alpha/Beta: ${round2(ab)} Gy

Course 1: ${round2(d1)} Gy in ${f1} fx
Course 1 EQD2: ${round2(eqd21)} Gy

Course 2: ${round2(d2)} Gy in ${f2} fx
Course 2 EQD2: ${round2(eqd22)} Gy

Total EQD2 (time-corrected): ${round2(total)} Gy
EQD2 Reserve: ${round2(reserve)} Gy

${els.statusText.innerText}`;
}

els.oar.onchange=updateSuggestion;
els.interval.onchange=updateSuggestion;
document.querySelectorAll("input").forEach(i=>i.oninput=compute);

els.copyBtn.onclick = async () => {
 await navigator.clipboard.writeText(els.summary.textContent);
 const old = els.copyBtn.innerText;
 els.copyBtn.innerText = "Copied";
 setTimeout(()=>els.copyBtn.innerText = old, 1200);
};

updateSuggestion();
