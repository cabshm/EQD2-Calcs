const data=OAR_DATA;

const oar=document.getElementById("oar");
const interval=document.getElementById("interval");
const limit=document.getElementById("limit");
const recovery=document.getElementById("recovery");

data.forEach(r=>{
 let opt=document.createElement("option");
 opt.value=r.OAR;
 opt.text=r.OAR;
 oar.appendChild(opt);
});

function getRecovery(row,i){
 if(row[i]!=undefined) return row[i];
 for(let k in row){
  if(k.trim()==i.trim()) return row[k];
 }
 return "";
}

function update(){

let row=data.find(r=>r.OAR==oar.value);
if(!row) return;

limit.value=row["D0.1cc EQD2 limit"];
recovery.value=getRecovery(row,interval.value);

compute();
}

oar.onchange=update;
interval.onchange=update;

function compute(){

let d1=Number(dose1.value);
let f1=Number(fx1.value);
let d2=Number(dose2.value);
let f2=Number(fx2.value);
let abv=Number(ab.value);
let rec=Number(recovery.value);

let dpf1=d1/f1;
let dpf2=d2/f2;

let bed1=d1*(1+dpf1/abv);
let bed2=d2*(1+dpf2/abv);

let eqd21=bed1/(1+2/abv);
let eqd22=bed2/(1+2/abv);

let corrected=eqd21*(1-rec/100);
let total=corrected+eqd22;

result.innerText=total.toFixed(2)+" Gy";
}

document.querySelectorAll("input").forEach(i=>i.oninput=compute);

update();
