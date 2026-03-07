const els = {
  dose1: document.getElementById('dose1'),
  fx1: document.getElementById('fx1'),
  dose2: document.getElementById('dose2'),
  fx2: document.getElementById('fx2'),
  ab: document.getElementById('ab'),
  preset: document.getElementById('preset'),
  dpf1: document.getElementById('dpf1'),
  bed1: document.getElementById('bed1'),
  eqd21: document.getElementById('eqd21'),
  dpf2: document.getElementById('dpf2'),
  bed2: document.getElementById('bed2'),
  eqd22: document.getElementById('eqd22'),
  bedTotal: document.getElementById('bedTotal'),
  eqd2Total: document.getElementById('eqd2Total'),
  summaryText: document.getElementById('summaryText'),
  copyBtn: document.getElementById('copyBtn'),
  pdfBtn: document.getElementById('pdfBtn'),
};

function num(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function round2(v) {
  return (Math.round(v * 100) / 100).toFixed(2);
}

function calcCourse(totalDose, fractions, ab) {
  if (fractions <= 0 || ab <= 0) return { dpf: 0, bed: 0, eqd2: 0 };
  const dpf = totalDose / fractions;
  const bed = totalDose * (1 + dpf / ab);
  const eqd2 = bed / (1 + 2 / ab);
  return { dpf, bed, eqd2 };
}

function updatePreset() {
  if (els.preset.value) els.ab.value = els.preset.value;
  compute();
}

function buildSummary(c1, c2, ab) {
  return [
    "Re-irradiation EQD2 Summary",
    `α/β: ${round2(ab)} Gy`,
    "",
    `Course 1: ${round2(num(els.dose1.value))} Gy in ${Math.round(num(els.fx1.value))} fx`,
    `Dose/fraction: ${round2(c1.dpf)} Gy`,
    `BED: ${round2(c1.bed)} Gy`,
    `EQD2: ${round2(c1.eqd2)} Gy`,
    "",
    `Course 2: ${round2(num(els.dose2.value))} Gy in ${Math.round(num(els.fx2.value))} fx`,
    `Dose/fraction: ${round2(c2.dpf)} Gy`,
    `BED: ${round2(c2.bed)} Gy`,
    `EQD2: ${round2(c2.eqd2)} Gy`,
    "",
    `Total BED: ${round2(c1.bed + c2.bed)} Gy`,
    `Total EQD2: ${round2(c1.eqd2 + c2.eqd2)} Gy`,
  ].join("\n");
}

function compute() {
  const dose1 = num(els.dose1.value);
  const fx1 = num(els.fx1.value);
  const dose2 = num(els.dose2.value);
  const fx2 = num(els.fx2.value);
  const ab = num(els.ab.value);

  const c1 = calcCourse(dose1, fx1, ab);
  const c2 = calcCourse(dose2, fx2, ab);

  els.dpf1.textContent = `${round2(c1.dpf)} Gy`;
  els.bed1.textContent = `${round2(c1.bed)} Gy`;
  els.eqd21.textContent = `${round2(c1.eqd2)} Gy`;
  els.dpf2.textContent = `${round2(c2.dpf)} Gy`;
  els.bed2.textContent = `${round2(c2.bed)} Gy`;
  els.eqd22.textContent = `${round2(c2.eqd2)} Gy`;
  els.bedTotal.textContent = `${round2(c1.bed + c2.bed)} Gy`;
  els.eqd2Total.textContent = `${round2(c1.eqd2 + c2.eqd2)} Gy`;
  els.summaryText.textContent = buildSummary(c1, c2, ab);
}

els.preset.addEventListener('change', updatePreset);
['dose1','fx1','dose2','fx2','ab'].forEach(id => {
  els[id].addEventListener('input', compute);
});

els.copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(els.summaryText.textContent);
  els.copyBtn.textContent = 'Copied';
  setTimeout(() => { els.copyBtn.textContent = 'Copy summary'; }, 1200);
});

els.pdfBtn.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });

  doc.setFontSize(18);
  doc.text('Re-irradiation EQD2 Calculator', 36, 36);
  doc.setFontSize(10);

  const lines = els.summaryText.textContent.split('\n');
  let y = 58;
  for (const line of lines) {
    doc.text(line, 36, y);
    y += 15;
  }

  doc.setFontSize(8);
  doc.text(
    'Disclaimer: This tool is provided for reference and convenience only and does not replace clinical judgment or verification against the original source material.',
    36,
    y + 16,
    { maxWidth: 520 }
  );

  doc.save('reirradiation_eqd2_summary.pdf');
});

compute();
