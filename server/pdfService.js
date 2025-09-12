const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

function formatLongDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function buildColumnXs(left, right, percents) {
  // Normalize percents to sum to 100
  const sum = percents.reduce((a, b) => a + b, 0) || 1;
  const normalized = percents.map(p => (p / sum) * 100);
  const width = right - left;
  const xs = [left];
  let acc = 0;
  for (let i = 0; i < normalized.length; i++) {
    acc += (normalized[i] / 100) * width;
    xs.push(left + acc);
  }
  return xs; // length = percents.length + 1
}

async function fillProposalTemplateWithFormData(data) {
  const templatePath = path.join(__dirname, 'template', 'Security Service Proposal .pdf');
  const existingPdfBytes = await fs.readFile(templatePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Page 1: Name & Company
  if (pages[0]) {
    pages[0].drawText(`${data.title || ''} ${data.name || ''}`, {
      x: 40.147, y: 162, size: 16, font: boldFont,color: rgb(1, 1, 1)
    });
    pages[0].drawText(`${data.address || ''}`, {
      x: 40.145, y: 132, size: 13, font, color: rgb(1, 1, 1)
    });
  }

  // Page 3: Services Rows (no headers), draw continuous table grid (shared borders)
  if (pages[2] && Array.isArray(data.services)) {
    const page = pages[2];

    // Table bounds (keep consistent with your template): previously 120..560
    const tableLeft = 120;
    const tableRight = 560;

    // Column widths in percentages (Sr, Service, Hourly, Hours, Guards, Total)
    // Will be normalized to 100% automatically if they don't sum to 100
    const columnPercents = [10, 40, 20, 20, 20, 30];

    // Compute column X boundaries
    const colXs = buildColumnXs(tableLeft, tableRight, columnPercents);

    const startY = 230; // first row text baseline
    const rowStep = 20; // vertical step per row

    // Visual row box relative to text baseline so text sits comfortably inside
    const rowHeight = 18; // box height
    const textBaselineYOffset = 4; // distance from box top to text baseline
    const borderColor = rgb(61/255, 60/255, 60/255);
    const borderWidth = 1; // 1pt lines

    // Helper: compute a left padding inside each column for text
    const padLeft = 10;

    // 1) Draw row texts using dynamic columns
    for (let i = 0; i < data.services.length; i++) {
      const service = data.services[i];
      const y = startY - i * rowStep;

      // Sr. No. column
      page.drawText(String(i + 1), { x: colXs[0] + padLeft, y, size: 12, font, color: rgb(0, 0, 0) });
      // Service
      page.drawText(service.service || '', { x: colXs[1] + padLeft, y, size: 12, font, color: rgb(0, 0, 0) });
      // Hourly rate
      page.drawText(`$${Number(service.hourlyRate || 0).toFixed(2)}`, { x: colXs[2] + padLeft, y, size: 12, font, color: rgb(0, 0, 0) });
      // Hours
      page.drawText(String(service.hours || 0), { x: colXs[3] + padLeft, y, size: 12, font, color: rgb(0, 0, 0) });
      // Guards
      page.drawText(String(service.guards || 0), { x: colXs[4] + padLeft, y, size: 12, font, color: rgb(0, 0, 0) });
      // Total
      page.drawText(`$${Number(service.totalCost || 0).toFixed(2)}`, { x: colXs[5] + padLeft, y, size: 12, font, color: rgb(0, 0, 0) });
    }

    // 2) Draw the grid over all rows at once so borders are shared
    const rowCount = data.services.length;
    if (rowCount > 0) {
      const topY = startY + (rowHeight - textBaselineYOffset); // top of first row box
      const bottomY = (startY - (rowCount - 1) * rowStep) + (rowHeight - textBaselineYOffset) - rowHeight; // bottom of last row box
      const tableWidth = tableRight - tableLeft;

      // Horizontal lines (row boundaries)
      for (let i = 0; i <= rowCount; i++) {
        const yLine = topY - i * rowStep;
        page.drawRectangle({
          x: tableLeft,
          y: yLine - borderWidth / 2,
          width: tableWidth,
          height: borderWidth,
          color: borderColor,
        });
      }

      // Vertical lines (column boundaries)
      for (let c = 0; c < colXs.length; c++) {
        const xLine = colXs[c];
        page.drawRectangle({
          x: xLine - borderWidth / 2,
          y: bottomY,
          width: borderWidth,
          height: topY - bottomY,
          color: borderColor,
        });
      }
    }

    // Optional: note below the last row
    if (data.note) {
      const noteY = (startY - rowCount * rowStep) - 10;
      page.drawText(`Note: ${data.note}`, { x: tableLeft + 10, y: noteY, size: 12, font, color: rgb(0, 0, 0) });
    }
  }
  
  // Page 4: Payment Terms, Termination
  if (pages[3]) {
    pages[3].drawText(` ${data.paymentTerms || ''}`, {
      x: 508, y: 660,   size: 13, font, color: rgb(0, 0, 0)
    });
    pages[3].drawText(`${data.termination || ''}`, {
      x: 364, y: 444, size: 13, font, color: rgb(0, 0, 0)
    });
  }

  // Page 5: Agreement page
  if (pages[5]) {
    pages[5].drawText(`${data.title || ''} ${data.name || ''}`, {
      x: 117.5, y: 488, size: 13, font, color: rgb(0, 0, 0)
    });
    pages[5].drawText(`${data.company || ''}`, {
      x: 361.5, y: 488, size: 13, font, color: rgb(0, 0, 0)
    });
    pages[5].drawText(`${data.email || ''}`, {
      x: 117.5, y: 454, size: 13, font, color: rgb(0, 0, 0)
    });
    pages[5].drawText(` ${data.contact || ''}`, {
      x: 361.5, y: 454, size: 13, font, color: rgb(0, 0, 0)
    });
    const formattedStart = formatLongDate(data.serviceStartDate);
    pages[5].drawText(`${formattedStart}`, {
      x: 427, y: 385, size: 13, font, color: rgb(0, 0, 0)
    });
  }

  return await pdfDoc.save();
}

module.exports = { fillProposalTemplateWithFormData };
