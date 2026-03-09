
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
total:document.getElementById('total')
};

const data=OAR_DATA;

data.forEach(r=>{
let o=document.createElement("option");
o.value=r.OAR;
o.text=r.OAR;
els.oar.appendChild(o);
});

function findRecovery(row,i){
if(row[i]!=undefined) return row[i];
for(let k in row){ if(k.trim()==i.trim()) return row[k]; }
return "";
}

function update(){
let row=data.find(r=>r.OAR==els.oar.value);
if(!row) return;
els.limit.value=row["D0.1cc EQD2 limit"];
els.recovery.value=findRecovery(row,els.interval.value);
compute();
}

els.oar.onchange=update;
els.interval.onchange=update;

function compute(){
let d1=Number(els.dose1.value);
let f1=Number(els.fx1.value);
let d2=Number(els.dose2.value);
let f2=Number(els.fx2.value);
let ab=Number(els.ab.value);
let rec=Number(els.recovery.value);

let dpf1=d1/f1;
let dpf2=d2/f2;

let bed1=d1*(1+dpf1/ab);
let bed2=d2*(1+dpf2/ab);

let eqd21=bed1/(1+2/ab);
let eqd22=bed2/(1+2/ab);

let corrected=eqd21*(1-rec/100);
let total=corrected+eqd22;

els.eqd21.innerText=eqd21.toFixed(2)+" Gy";
els.eqd22.innerText=eqd22.toFixed(2)+" Gy";
els.total.innerText=total.toFixed(2)+" Gy";
}

document.querySelectorAll("input").forEach(i=>i.oninput=compute);

update();
