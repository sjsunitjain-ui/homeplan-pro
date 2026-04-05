import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, getMetroMultiplier, budgetCategories, calculateDoors, type Package, type ProjectDetails } from "@/data/packages";

const BRAND_COLOR: [number, number, number] = [59, 130, 246]; // primary blue
const DARK: [number, number, number] = [15, 23, 42];
const MUTED: [number, number, number] = [100, 116, 139];
const WHITE: [number, number, number] = [255, 255, 255];
const LIGHT_BG: [number, number, number] = [241, 245, 249];

function addHeader(doc: jsPDF, y: number, text: string): number {
  doc.setFillColor(...BRAND_COLOR);
  doc.roundedRect(14, y, doc.internal.pageSize.width - 28, 10, 2, 2, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(text, 20, y + 7);
  doc.setTextColor(...DARK);
  return y + 16;
}

function addLabel(doc: jsPDF, x: number, y: number, label: string, value: string): number {
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.text(label, x, y);
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.text(value, x, y + 5);
  return y + 12;
}

function checkPage(doc: jsPDF, y: number, needed: number = 30): number {
  if (y + needed > doc.internal.pageSize.height - 20) {
    doc.addPage();
    return 20;
  }
  return y;
}

export function generatePlanPDF(details: ProjectDetails, selectedPackage: Package) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageW = doc.internal.pageSize.width;
  const totalCost = Math.round(selectedPackage.pricePerSqft * details.bua * getMetroMultiplier(details.isMetro));

  // ===== COVER / TITLE =====
  doc.setFillColor(...BRAND_COLOR);
  doc.rect(0, 0, pageW, 50, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("HomesutraPro", 20, 22);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Construction Wallet — Your Personalized Build Plan", 20, 32);
  doc.setFontSize(8);
  doc.text(`Generated on ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, 20, 42);

  let y = 60;

  // ===== CLIENT DETAILS =====
  y = addHeader(doc, y, "Client Details");
  const col1 = 20, col2 = pageW / 2 + 5;
  y = addLabel(doc, col1, y, "Client Name", details.name);
  addLabel(doc, col2, y - 12, "Mobile", details.mobile);
  y = addLabel(doc, col1, y, "Email", details.email || "—");
  addLabel(doc, col2, y - 12, "City", `${details.city} (${details.isMetro ? "Metro" : "Non-Metro"})`);
  y = addLabel(doc, col1, y, "Built-Up Area", `${details.bua.toLocaleString()} sqft`);
  addLabel(doc, col2, y - 12, "Configuration", `${details.bedrooms} BHK • ${details.bathrooms} Bathrooms`);
  if (details.otherRequirements) {
    y = addLabel(doc, col1, y, "Other Requirements", details.otherRequirements);
  }
  y += 4;

  // ===== PACKAGE SUMMARY =====
  y = checkPage(doc, y, 50);
  y = addHeader(doc, y, `Selected Package — ${selectedPackage.name} (${selectedPackage.nameHindi})`);
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, y, pageW - 28, 22, 2, 2, "F");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text("Total Investment", 20, y + 7);
  doc.setFontSize(16);
  doc.setTextColor(...BRAND_COLOR);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(totalCost), 20, y + 16);
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.text(`Rate: ${formatCurrency(selectedPackage.pricePerSqft)}/sqft`, col2, y + 7);
  doc.text(`Tagline: "${selectedPackage.tagline}"`, col2, y + 16);
  y += 30;

  // ===== SPECIFICATIONS =====
  y = checkPage(doc, y, 50);
  y = addHeader(doc, y, "Package Specifications");
  const specRows = [
    ["Steel", selectedPackage.highlights.steel],
    ["Cement", selectedPackage.highlights.cement],
    ["Flooring", selectedPackage.highlights.flooring],
    ["Doors", selectedPackage.highlights.doors],
    ["Switches", selectedPackage.highlights.switches],
    ["Painting", selectedPackage.highlights.painting],
    ["Windows", selectedPackage.highlights.windows],
    ["Sanitary (per toilet)", formatCurrency(selectedPackage.sanitaryPerToilet)],
  ];
  autoTable(doc, {
    startY: y,
    head: [["Component", "Specification"]],
    body: specRows,
    theme: "grid",
    headStyles: { fillColor: BRAND_COLOR, textColor: WHITE, fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: DARK },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // ===== BUDGET ALLOCATION =====
  y = checkPage(doc, y, 60);
  y = addHeader(doc, y, "Budget Allocation");
  const sanitaryTotal = selectedPackage.sanitaryPerToilet * details.bathrooms;
  const sanitaryPct = Math.round((sanitaryTotal / totalCost) * 100);
  const greyBoxPct = 100 - budgetCategories.reduce((s, c) => s + (c.id === "sanitary" ? 0 : c.percentage), 0) - sanitaryPct;

  const budgetRows = budgetCategories.map((cat) => {
    const pct = cat.id === "sanitary" ? sanitaryPct : cat.percentage;
    return [cat.icon + " " + cat.name, `${pct}%`, formatCurrency(Math.round(totalCost * pct / 100))];
  });
  budgetRows.push(["🏗️ Grey Box Structure", `${greyBoxPct}%`, formatCurrency(Math.round(totalCost * greyBoxPct / 100))]);

  autoTable(doc, {
    startY: y,
    head: [["Category", "%", "Amount"]],
    body: budgetRows,
    theme: "grid",
    headStyles: { fillColor: BRAND_COLOR, textColor: WHITE, fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: DARK },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // ===== PAYMENT MILESTONES =====
  y = checkPage(doc, y, 60);
  y = addHeader(doc, y, "Payment Milestones");
  const milestones = [
    ["Stage 0", "Booking / Token Amount", "₹40,000"],
    ["Stage 1", "Material Mobilisation (10% − ₹40k)", formatCurrency(Math.round(totalCost * 0.10) - 40000)],
    ["Stages 2–5", "Foundation Phase (15%)", formatCurrency(Math.round(totalCost * 0.15))],
    ["Stages 6–11", "Superstructure (25%)", formatCurrency(Math.round(totalCost * 0.25))],
    ["Stages 12–16", "Internal Works (18%)", formatCurrency(Math.round(totalCost * 0.18))],
    ["Stages 17–20", "External Finishing (12%)", formatCurrency(Math.round(totalCost * 0.12))],
    ["Stages 21–24", "Fitting & Fixtures (9%)", formatCurrency(Math.round(totalCost * 0.09))],
    ["Stages 25–27", "Final Finishing & Handover (11%)", formatCurrency(Math.round(totalCost * 0.11))],
  ];
  autoTable(doc, {
    startY: y,
    head: [["Phase", "Description", "Amount"]],
    body: milestones,
    theme: "grid",
    headStyles: { fillColor: BRAND_COLOR, textColor: WHITE, fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: DARK },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // ===== USPs =====
  y = checkPage(doc, y, 40);
  y = addHeader(doc, y, "What's Included");
  selectedPackage.usps.forEach((usp) => {
    y = checkPage(doc, y, 8);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.text(`✓  ${usp}`, 20, y);
    y += 6;
  });
  y += 4;

  // ===== FOOTER =====
  y = checkPage(doc, y, 30);
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, y, pageW - 28, 18, 2, 2, "F");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.text("Built with transparency • Trusted by 10,000+ homeowners • HomesutraPro", pageW / 2, y + 7, { align: "center" });
  doc.text("This is an estimate. Final costs may vary based on site conditions and material availability.", pageW / 2, y + 13, { align: "center" });

  // Save
  doc.save(`HomesutraPro_${details.name.replace(/\s+/g, "_")}_Plan.pdf`);
}
