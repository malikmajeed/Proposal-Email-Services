const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

class PDFService {
  constructor() {
    this.templatePath = path.join(__dirname, '../template', 'Security Service Proposal .pdf');
  }

  formatLongDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  buildColumnXs(left, right, percents) {
    const sum = percents.reduce((a, b) => a + b, 0) || 1;
    const normalized = percents.map(p => (p / sum) * 100);
    const width = right - left;
    const xs = [left];
    let acc = 0;
    for (let i = 0; i < normalized.length; i++) {
      acc += (normalized[i] / 100) * width;
      xs.push(left + acc);
    }
    return xs;
  }

  drawAlignedText({ page, text, left, right, y, align, font, size, color, padLeft = 8, padRight = 8 }) {
    const colWidth = right - left;
    const t = text == null ? '' : String(text);
    const textWidth = font.widthOfTextAtSize(t, size);
    let x = left + padLeft;
    if (align === 'center') {
      x = left + (colWidth - textWidth) / 2;
    } else if (align === 'right') {
      x = right - padRight - textWidth;
    }
    page.drawText(t, { x, y, size, font, color });
  }

  async fillProposalTemplate(data) {
    const existingPdfBytes = await fs.readFile(this.templatePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Page 1: Name & Company
    if (pages[0]) {
      pages[0].drawText(`${data.name || ''}`, {
        x: 40.147, y: 164, size: 16, font: boldFont, color: rgb(1, 1, 1)
      });
      pages[0].drawText(`${data.address || ''}`, {
        x: 40.145, y: 134, size: 13, font, color: rgb(192/255, 192/255, 192/255)
      });
    }

    // Page 3: Services Table
    if (pages[2] && Array.isArray(data.services)) {
      const page = pages[2];
      const tableLeft = 120;
      const tableRight = 560;
      const columnPercents = [10, 65, 15, 15, 15, 25];
      const colXs = this.buildColumnXs(tableLeft, tableRight, columnPercents);
      const startY = 230;
      const rowStep = 20;
      const rowHeight = 18;
      const textBaselineYOffset = 4;
      const borderColor = rgb(61/255, 60/255, 60/255);
      const borderWidth = 1;
      const textSize = 12;
      const textColor = rgb(0, 0, 0);
      const padL = 10;
      const padR = 10;

      // Draw row texts with alignment
      for (let i = 0; i < data.services.length; i++) {
        const service = data.services[i];
        const y = startY - i * rowStep;

        this.drawAlignedText({
          page, text: String(i + 1), left: colXs[0], right: colXs[1], y,
          align: 'center', font, size: textSize, color: textColor, padLeft: padL, padRight: padR
        });

        this.drawAlignedText({
          page, text: service.service || '', left: colXs[1], right: colXs[2], y,
          align: 'left', font, size: textSize, color: textColor, padLeft: padL, padRight: padR
        });

        this.drawAlignedText({
          page, text: `$${Number(service.hourlyRate || 0).toFixed(2)}`, left: colXs[2], right: colXs[3], y,
          align: 'center', font, size: textSize, color: textColor, padLeft: padL, padRight: padR
        });

        this.drawAlignedText({
          page, text: String(service.hours || 0), left: colXs[3], right: colXs[4], y,
          align: 'center', font, size: textSize, color: textColor, padLeft: padL, padRight: padR
        });

        this.drawAlignedText({
          page, text: String(service.guards || 0), left: colXs[4], right: colXs[5], y,
          align: 'center', font, size: textSize, color: textColor, padLeft: padL, padRight: padR
        });

        this.drawAlignedText({
          page, text: `$${Number(service.totalCost || 0).toFixed(2)}`, left: colXs[5], right: colXs[6], y,
          align: 'right', font, size: textSize, color: textColor, padLeft: padL, padRight: padR
        });
      }

      // Draw grid
      const rowCount = data.services.length;
      if (rowCount > 0) {
        const topY = startY + (rowHeight - textBaselineYOffset);
        const bottomY = (startY - (rowCount - 1) * rowStep) + (rowHeight - textBaselineYOffset) - rowHeight;
        const tableWidth = tableRight - tableLeft;

        // Horizontal lines
        for (let i = 0; i <= rowCount; i++) {
          const yLine = topY - i * rowStep;
          page.drawRectangle({
            x: tableLeft, y: yLine - borderWidth / 2, width: tableWidth, height: borderWidth, color: borderColor
          });
        }

        // Vertical lines
        for (let c = 0; c < colXs.length; c++) {
          const xLine = colXs[c];
          page.drawRectangle({
            x: xLine - borderWidth / 2, y: bottomY, width: borderWidth, height: topY - bottomY, color: borderColor
          });
        }
      }

      // Note
      if (data.note) {
        const noteY = (startY - rowCount * rowStep) - 10;
        // Draw "Note:" in bold
        page.drawText('Note:', { x: tableLeft, y: noteY, size: 12, font: boldFont, color: rgb(0, 0, 0) });
        // Draw the rest of the note in regular font, right after "Note:"
        const noteLabelWidth = boldFont.widthOfTextAtSize('Note: ', 12);
        page.drawText(` ${data.note}`, { x: tableLeft + noteLabelWidth, y: noteY, size: 12, font, color: rgb(0, 0, 0) });
      }
    }

    // Page 4: Payment Terms, Termination
    if (pages[3]) {
      pages[3].drawText(` ${data.paymentTerms || ''}`, { x: 508, y: 660, size: 13, font, color: rgb(0, 0, 0) });
      pages[3].drawText(`${data.termination || ''}`, { x: 364, y: 444, size: 13, font, color: rgb(0, 0, 0) });
    }

    // Page 5: Agreement page
    if (pages[5]) {
      pages[5].drawText(`${data.name || ''}`, { x: 117.5, y: 488, size: 13, font, color: rgb(0, 0, 0) });
      pages[5].drawText(`${data.company || ''}`, { x: 361.5, y: 488, size: 13, font, color: rgb(0, 0, 0) });
      pages[5].drawText(`${data.email || ''}`, { x: 117.5, y: 454, size: 13, font, color: rgb(0, 0, 0) });
      pages[5].drawText(` ${data.contact || ''}`, { x: 361.5, y: 454, size: 13, font, color: rgb(0, 0, 0) });
      const formattedStart = this.formatLongDate(data.serviceStartDate);
      pages[5].drawText(`${formattedStart}`, { x: 427, y: 385, size: 13, font, color: rgb(0, 0, 0) });
    }

    return await pdfDoc.save();
  }
}

module.exports = PDFService;
