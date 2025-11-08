// utils/invoice.js
export async function generateInvoicePDF({
  merchantName = "NOOR Merchant",
  invoiceId = "INV-0001",
  customer = "",
  recipient = "",
  amount = "",
  description = "",
  tokenSymbol = "NUR",
  networkName = "BNB Smart Chain (56)",
  contractAddress = "0xA20212290866C8A804a89218c8572F28C507b401",
  txHash = "",
  siteOrigin = ""
} = {}) {
  // Import dynamique (évite SSR)
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 56; // 0.78in
  let y = margin;

  const pageW = doc.internal.pageSize.getWidth();
  const line = (ypos) => doc.line(margin, ypos, pageW - margin, ypos);

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);

  // Styles
  const H1 = 22;
  const H2 = 12;
  const TXT = 10;

  // En-tête
  doc.setFont("helvetica", "bold");
  doc.setFontSize(H1);
  doc.text("NOOR — Invoice", margin, y);
  y += 26;

  doc.setFontSize(TXT);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${dateStr}`, margin, y);
  y += 14;
  doc.text(`Invoice #: ${invoiceId}`, margin, y);
  y += 14;
  if (merchantName) { doc.text(`Merchant: ${merchantName}`, margin, y); y += 14; }
  if (customer)    { doc.text(`Customer: ${customer}`, margin, y);      y += 14; }

  y += 6; line(y); y += 22;

  // Détails paiement
  doc.setFont("helvetica", "bold");
  doc.setFontSize(H2);
  doc.text("Payment Details", margin, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(TXT);
  if (description) { doc.text(`Description: ${description}`, margin, y); y += 14; }
  doc.text(`Amount: ${amount || "—"} ${tokenSymbol}`, margin, y); y += 14;
  doc.text(`Network: ${networkName}`, margin, y); y += 14;
  if (recipient) { doc.text(`Recipient: ${recipient}`, margin, y, { maxWidth: pageW - margin * 2 }); y += 28; }
  doc.text(`Token contract: ${contractAddress}`, margin, y, { maxWidth: pageW - margin * 2 }); y += 28;

  // Tx hash + lien
  if (txHash) {
    doc.text(`Tx hash: ${txHash}`, margin, y, { maxWidth: pageW - margin * 2 }); y += 14;
    const bscUrl = `https://bscscan.com/tx/${txHash}`;
    doc.setTextColor(33, 150, 243);
    doc.textWithLink("View on BscScan", margin, y, { url: bscUrl });
    doc.setTextColor(0, 0, 0);
    y += 20;
  }

  y += 6; line(y); y += 22;

  // Pied
  doc.setFont("helvetica", "bold");
  doc.setFontSize(H2);
  doc.text("Notes", margin, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(TXT);
  const notes = [
    "This invoice reflects a payment in NOOR (NUR) utility/payment token.",
    "No fiat conversion is performed by NOOR. Conversions, if any, happen via external PSPs.",
    "Keep your transaction hash as proof of payment on BNB Smart Chain.",
    siteOrigin ? `Generated from: ${siteOrigin}` : ""
  ].filter(Boolean);

  notes.forEach((n) => { doc.text(n, margin, y, { maxWidth: pageW - margin * 2 }); y += 14; });

  // Nom du fichier propre
  const safeId = String(invoiceId || "invoice").replace(/[^a-zA-Z0-9-_]/g, "_");
  const filename = `NOOR_Invoice_${safeId}_${dateStr}.pdf`;
  doc.save(filename);
}
