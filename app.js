const els = {
  oar: document.getElementById("oarSelect"),
  interval: document.getElementById("timeSelect"),
  limit: document.getElementById("limit"),
  recovery: document.getElementById("recovery"),
  dose1: document.getElementById("dose1"),
  fx1: document.getElementById("fx1"),
  dose2: document.getElementById("dose2"),
  fx2: document.getElementById("fx2"),
  ab: document.getElementById("ab"),
  eqd21: document.getElementById("eqd21"),
  eqd21corr: document.getElementById("eqd21corr"),
  eqd22: document.getElementById("eqd22"),
  total: document.getElementById("total"),
  reserve: document.getElementById("reserve"),
  summary: document.getElementById("summary"),
  copyBtn: document.getElementById("copyBtn")
};

OAR_DATA.forEach((row) => {
  const opt = document.createElement("option");
  opt.value = row.OAR;
  opt.text = row.OAR;
  els.oar.appendChild(opt);
});

function round(x) {
  return Number(x).toFixed(2);
}

function getNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function findRecovery(row, intervalKey) {
  if (!row) return 0;

  if (row[intervalKey] !== undefined && row[intervalKey] !== null && row[intervalKey] !== "") {
    return row[intervalKey];
  }

  const target = String(intervalKey).trim();
  for (const key of Object.keys(row)) {
    if (String(key).trim() === target) {
      return row[key];
    }
  }

  return 0;
}

function updateSuggestion() {

  const row = OAR_DATA.find((x) => x.OAR === els.oar.value);
  if (!row) return;

  els.limit.value = row["D0.1cc EQD2 limit"] ?? "";
  els.recovery.value = findRecovery(row, els.interval.value);

  compute();
}

function compute() {

  const d1 = getNumber(els.dose1.value);
  const f1 = getNumber(els.fx1.value);
  const d2 = getNumber(els.dose2.value);
  const f2 = getNumber(els.fx2.value);
  const ab = getNumber(els.ab.value);
  const rec = getNumber(els.recovery.value);
  const limit = getNumber(els.limit.value);

  if (f1 <= 0 || f2 <= 0 || ab <= 0) {
    els.eqd21.innerText = "Invalid";
    els.eqd21corr.innerText = "Invalid";
    els.eqd22.innerText = "Invalid";
    els.total.innerText = "Invalid";
    els.reserve.innerText = "Invalid";
    els.summary.textContent = "Please enter valid fractions and alpha/beta values.";
    return;
  }

  const dpf1 = d1 / f1;
  const dpf2 = d2 / f2;

  const bed1 = d1 * (1 + dpf1 / ab);
  const bed2 = d2 * (1 + dpf2 / ab);

  const eqd21 = bed1 / (1 + 2 / ab);
  const eqd22 = bed2 / (1 + 2 / ab);

  const corrected = eqd21 * (1 - rec / 100);
  const total = corrected + eqd22;

  const reserve = limit - total;

  els.eqd21.innerText = round(eqd21) + " Gy";
  els.eqd21corr.innerText = round(corrected) + " Gy";
  els.eqd22.innerText = round(eqd22) + " Gy";
  els.total.innerText = round(total) + " Gy";

  els.reserve.innerText =
    reserve < 0 ? "NO EQD2 Reserve" : round(reserve) + " Gy";

  els.summary.textContent =
`OAR: ${els.oar.value}
Time interval: ${els.interval.options[els.interval.selectedIndex].text}
D0.1cc EQD2 limit: ${round(limit)} Gy
Recovery factor: ${round(rec)} %

Course 1 dose: ${round(d1)} Gy in ${f1} fractions
Course 1 EQD2: ${round(eqd21)} Gy
Course 1 EQD2 time corrected: ${round(corrected)} Gy

Course 2 dose: ${round(d2)} Gy in ${f2} fractions
Course 2 EQD2: ${round(eqd22)} Gy

Total EQD2: ${round(total)} Gy
EQD2 Reserve: ${reserve < 0 ? "NO EQD2 Reserve" : round(reserve) + " Gy"}`;
}

els.oar.addEventListener("change", updateSuggestion);
els.interval.addEventListener("change", updateSuggestion);

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", compute);
});

els.copyBtn.addEventListener("click", async () => {

  await navigator.clipboard.writeText(els.summary.textContent);

  const oldText = els.copyBtn.innerText;
  els.copyBtn.innerText = "Copied";

  setTimeout(() => {
    els.copyBtn.innerText = oldText;
  }, 1200);

});

updateSuggestion();