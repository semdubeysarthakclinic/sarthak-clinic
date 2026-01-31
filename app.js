document.addEventListener("DOMContentLoaded", () => {

const instructionMap = {
  "Tooth Pain": {
    en: "Avoid hard food. Maintain oral hygiene.",
    hi: "कठोर भोजन से बचें। मुँह की सफ़ाई रखें।"
  },
  "Post Extraction": {
    en: "Do not rinse for 24 hours. Soft & liquid diet.",
    hi: "24 घंटे कुल्ला न करें। नरम व तरल आहार लें।"
  },
  "RCT": {
    en: "Avoid chewing on treated side.",
    hi: "इलाज वाली साइड से न चबाएँ।"
  },
  "Acne": {
    en: "Do not squeeze acne.",
    hi: "मुहांसों को हाथ से न फोड़ें।"
  },
  "Scar (All Types)": {
    en: "Do not scratch scar.",
    hi: "निशान को न खुजलाएँ।"
  },
  "Pigmentation": {
    en: "Avoid sun exposure. Use sunscreen.",
    hi: "धूप से बचें। सनस्क्रीन लगाएँ।"
  },
  "Laser Hair Removal": {
    en: "Avoid waxing. Use sunscreen.",
    hi: "वैक्सिंग से बचें। सनस्क्रीन लगाएँ।"
  }
};

const problem = document.getElementById("problem");
const lang = document.getElementById("lang");
const instructions = document.getElementById("instructions");

function updateInstructions() {
  if (instructionMap[problem.value]) {
    instructions.value = instructionMap[problem.value][lang.value];
  }
}

problem.onchange = updateInstructions;
lang.onchange = updateInstructions;

/* Signature */
const canvas = document.getElementById("signature-pad");
canvas.style.touchAction = "none";
const ratio = Math.max(window.devicePixelRatio || 1, 1);
canvas.width *= ratio;
canvas.height *= ratio;
canvas.getContext("2d").scale(ratio, ratio);
const signaturePad = new SignaturePad(canvas);

window.clearSignature = () => signaturePad.clear();

/* History */
function getHistory() {
  return JSON.parse(localStorage.getItem("history") || "[]");
}
function saveHistory(data) {
  const h = getHistory();
  h.unshift(data);
  localStorage.setItem("history", JSON.stringify(h));
  renderHistory();
}
function renderHistory(filter="") {
  const ul = document.getElementById("historyList");
  ul.innerHTML = "";
  getHistory().filter(r =>
    r.name.toLowerCase().includes(filter.toLowerCase())
  ).forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.date} - ${r.name} (${r.problem})`;
    ul.appendChild(li);
  });
}

document.getElementById("searchHistory").oninput = e =>
  renderHistory(e.target.value);

renderHistory();

/* PDF */
window.generatePDF = function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const name = nameInput = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const prob = problem.value;
  const diag = document.getElementById("diagnosis").value;
  const inst = instructions.value;
  const date = new Date().toLocaleDateString();

  let y = 20;
  doc.text("Sarthak Dental & Facial Aesthetic Clinic", 105, y, {align:"center"});
  y+=10;
  doc.text(`Patient: ${name}`,10,y);
  doc.text(`Age: ${age}`,150,y);
  y+=8;
  doc.text(`Date: ${date}`,10,y);
  y+=10;
  doc.text(`Problem: ${prob}`,10,y); y+=8;
  doc.text(`Diagnosis: ${diag}`,10,y); y+=10;
  doc.text("Instructions:",10,y); y+=6;
  doc.text(doc.splitTextToSize(inst,180),10,y); y+=20;

  if (!signaturePad.isEmpty()) {
    doc.addImage(signaturePad.toDataURL(),"PNG",140,y,50,20);
  }

  doc.text("Valid for 1 month. Not valid for medico-legal purposes.",10,280);

  doc.save(`Prescription_${name}.pdf`);

  saveHistory({name, age, problem:prob, diagnosis:diag, date});
};

});
