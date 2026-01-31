document.addEventListener("DOMContentLoaded", function () {

  // ===== Instructions Mapping =====
  const instructionMap = {
    "Post Extraction": {
      en: "Do not rinse or spit forcefully for 24 hours. Take soft and liquid diet.",
      hi: "24 घंटे तक ज़ोर से कुल्ला या थूकें नहीं। नरम व तरल आहार लें।"
    },
    "Tooth Pain": {
      en: "Avoid hard food. Maintain oral hygiene.",
      hi: "कठोर भोजन से बचें। मुँह की सफ़ाई रखें।"
    },
    "Acne": {
      en: "Do not squeeze acne. Wash face gently.",
      hi: "मुहांसों को हाथ से न फोड़ें। हल्के हाथ से चेहरा धोएँ।"
    },
    "Scar (All Types)": {
      en: "Do not scratch scar. Use prescribed cream.",
      hi: "निशान को न खुजलाएँ। बताई गई क्रीम लगाएँ।"
    },
    "Pigmentation": {
      en: "Avoid sun exposure. Use sunscreen.",
      hi: "धूप से बचें। सनस्क्रीन का उपयोग करें।"
    },
    "Laser Hair Removal": {
      en: "Avoid waxing. Use sunscreen after procedure.",
      hi: "वैक्सिंग से बचें। प्रक्रिया के बाद सनस्क्रीन लगाएँ।"
    }
  };

  const problemSelect = document.getElementById("problem");
  const langSelect = document.getElementById("lang");
  const instructionsBox = document.getElementById("instructions");

  function updateInstructions() {
    const problem = problemSelect.value;
    const lang = langSelect.value;
    if (instructionMap[problem]) {
      instructionsBox.value = instructionMap[problem][lang];
    }
  }

  problemSelect.addEventListener("change", updateInstructions);
  langSelect.addEventListener("change", updateInstructions);

  // ===== Signature Pad =====
  const canvas = document.getElementById("signature-pad");
  let signaturePad = null;

  if (canvas) {
    canvas.style.touchAction = "none"; // 🔥 VERY IMPORTANT FOR iOS

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);

    signaturePad = new SignaturePad(canvas);
  }

  window.clearSignature = function () {
    if (signaturePad) signaturePad.clear();
  };

  // ===== PDF Generation =====
  window.generatePDF = function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const diagnosis = document.getElementById("diagnosis").value;
    const problem = problemSelect.value;
    const instructions = instructionsBox.value;
    const today = new Date().toLocaleDateString();

    let y = 20;

    doc.setFontSize(16);
    doc.text("Sarthak Dental & Facial Aesthetic Clinic", 105, y, { align: "center" });
    y += 10;

    doc.setFontSize(11);
    doc.text("Dr. Shailendra Dubey", 105, y, { align: "center" });
    y += 10;

    doc.line(10, y, 200, y);
    y += 8;

    doc.text(`Patient Name: ${name}`, 10, y);
    doc.text(`Age: ${age}`, 150, y);
    y += 7;

    doc.text(`Date: ${today}`, 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text("Problem:", 10, y);
    y += 6;
    doc.setFontSize(11);
    doc.text(problem || "-", 10, y);
    y += 8;

    doc.setFontSize(12);
    doc.text("Diagnosis:", 10, y);
    y += 6;
    doc.setFontSize(11);
    doc.text(diagnosis || "-", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text("Instructions:", 10, y);
    y += 6;
    doc.setFontSize(11);
    doc.text(doc.splitTextToSize(instructions || "-", 180), 10, y);
    y += 20;

    if (signaturePad && !signaturePad.isEmpty()) {
      const img = signaturePad.toDataURL("image/png");
      doc.text("Doctor Signature:", 140, y);
      doc.addImage(img, "PNG", 140, y + 4, 50, 20);
      y += 30;
    }

    doc.line(10, y, 200, y);
    y += 8;

    doc.setFontSize(10);
    doc.text("Valid for 1 month from date of issue.", 10, y);
    y += 5;
    doc.text("Not valid for medico-legal purposes.", 10, y);

    doc.save(`Prescription_${name || "Patient"}.pdf`);
  };

});
