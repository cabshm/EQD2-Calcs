
let data=[]

fetch('oar_recovery_data.json')
.then(r=>r.json())
.then(d=>{
data=d
init()
})

function init(){

const oarSelect=document.getElementById('oarSelect')

data.forEach(r=>{
let o=document.createElement('option')
o.value=r.OAR
o.text=r.OAR
oarSelect.appendChild(o)
})

updateSuggestion()

document.getElementById('oarSelect').addEventListener('change',updateSuggestion)
document.getElementById('timeSelect').addEventListener('change',updateSuggestion)

document.querySelectorAll('#dose1,#fx1,#dose2,#fx2,#ab,#recovery')
.forEach(e=>e.addEventListener('input',compute))

compute()

}

function updateSuggestion(){

let oar=document.getElementById('oarSelect').value
let interval=document.getElementById('timeSelect').value

let row=data.find(r=>r.OAR===oar)

if(!row)return

document.getElementById('limit').value=row["D0.1cc EQD2 limit"]

document.getElementById('recovery').value=row[interval]

compute()

}

function compute(){

let d1=Number(document.getElementById('dose1').value)
let f1=Number(document.getElementById('fx1').value)

let d2=Number(document.getElementById('dose2').value)
let f2=Number(document.getElementById('fx2').value)

let ab=Number(document.getElementById('ab').value)
let rec=Number(document.getElementById('recovery').value)

let dpf1=d1/f1
let dpf2=d2/f2

let bed1=d1*(1+dpf1/ab)
let bed2=d2*(1+dpf2/ab)

let eqd21=bed1/(1+2/ab)
let eqd22=bed2/(1+2/ab)

let corrected1=eqd21*(1-rec/100)

let total=corrected1+eqd22

document.getElementById('result').innerText=total.toFixed(2)+" Gy"

}
