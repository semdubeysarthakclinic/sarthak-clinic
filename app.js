let signaturePad;

window.onload = function () {
  const canvas = document.getElementById("signature-pad");
  if (canvas) {
    signaturePad = new SignaturePad(canvas);
  }
};

function clearSignature() {
  signaturePad.clear();
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const problem = document.getElementById("problem").value;
  const diagnosis = document.getElementById("diagnosis").value;
  const instructions = document.getElementById("instructions").value;
  const today = new Date().toLocaleDateString();

  let y = 20;

  doc.setFontSize(16);
  doc.text("Sarthak Dental & Facial Aesthetic Clinic", 105, y, { align: "center" });

  y += 8;
  doc.setFontSize(11);
  doc.text("Dr. Shailendra Dubey", 105, y, { align: "center" });
  y += 6;
  doc.text("Dental | Skin | Hair Aesthetics", 105, y, { align: "center" });

  y += 10;
  doc.line(10, y, 200, y);
  y += 8;

  doc.setFontSize(11);
  doc.text(`Patient Name : ${name}`, 10, y);
  doc.text(`Age : ${age}`, 150, y);
  y += 7;

  doc.text(`Date : ${today}`, 10, y);
  y += 10;

  doc.setFontSize(12);
  doc.text("Chief Complaint / Problem:", 10, y);
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
    const imgData = signaturePad.toDataURL("image/png");
    doc.text("Doctor Signature:", 140, y);
    doc.addImage(imgData, "PNG", 140, y + 4, 50, 20);
    y += 30;
  }

  doc.line(10, y, 200, y);
  y += 8;

  doc.setFontSize(10);
  doc.text("Valid for 1 month from date of issue.", 10, y);
  y += 5;
  doc.text("Not valid for medico-legal purposes.", 10, y);

  doc.save(`Prescription_${name || "Patient"}.pdf`);
}
