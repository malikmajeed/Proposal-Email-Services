const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

class InvoicePDFService {
  constructor() {
    this.templatePath = path.join(__dirname, '../template', 'Invoice.pdf');
  }

  async fillInvoiceTemplate(data) {
    let pdfDoc, page;
    let templateLoaded = false;
    try {
      const templateBytes = await fs.readFile(this.templatePath);
      pdfDoc = await PDFDocument.load(templateBytes);
      page = pdfDoc.getPages()[0];
      templateLoaded = true;
    } catch (err) {
      // Fallback to blank PDF if template not found
      pdfDoc = await PDFDocument.create();
      page = pdfDoc.addPage([595, 842]); // A4 size
    }
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const black = rgb(0, 0, 0);
    const gray = rgb(0.5, 0.5, 0.5);
    const borderGray = rgb(226/255, 226/255, 226/255);

    // Helper to format currency
    const formatCurrency = (n) => {
      return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Helper to format date as 'Jan 23, 2025'
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Header fields
    page.drawText(`${data.invoiceNo|| ''}`, { x: 33, y: 459, size: 15, font, color: black, }); // left
    page.drawText(`${formatDate(data.invoiceDate) || ''}`, { x: 165.6, y: 459, size: 15, font, color: black, }); // left
    page.drawText(`${formatDate(data.dueDate)|| ''}`, { x: 296.8, y: 459, size: 15, font, color: black, }); // left
    // Draw amountDue right-aligned at x=564 (from right edge)
    const amountDueText = `${formatCurrency(data.subtotal || 0)}`;
    const amountDueWidth = font.widthOfTextAtSize(amountDueText, 16);
    page.drawText(amountDueText, { x: 564 - amountDueWidth, y: 459, size: 16, font, color: rgb(1,1,1) });

    // Client info (center)
    page.drawText(`${data.clientName|| ''}`, { x: 36.4, y: 579, size: 16, font: boldFont, color: black });
    page.drawText(`${data.company|| ''}`, { x: 116, y: 561, size: 12, font, color: gray });
    page.drawText(`${data.address || ''}`, { x: 116, y: 546, size: 12, font, color: gray });
    page.drawText(`${data.email|| '' }`, { x: 116, y: 531, size: 12, font, color: black });
    page.drawText(`${data.phone || ''}`, { x: 116, y: 516, size: 12, font, color: black });

    // Table columns: Sr., Service(s), Rate/hr, Hours, Guards, Cost
    const tableY = 380;
    // Define column left edges and also store the right edge for the cost column for right alignment
    const colXs = [38, 96, 250, 347, 432, 572]; // 6 columns (left edges)
    const costColRight = colXs[5]; // right edge for cost column
    // No table header row

    // Table rows
    const startY = 410; // start right below where header would be
    if (Array.isArray(data.rows) && data.rows.length > 0) {
      data.rows.forEach((row, idx) => {
        let y = startY - idx * 24; // consistent spacing for all rows
        // Sr. No (left)
        page.drawText(String(idx + 1), { x: colXs[0], y, size: 12, font, color: gray });
        // Service(s) (left)
        page.drawText(row.description || row.service || '', { x: colXs[1], y, size: 12, font, color: gray });
        // Rate/hr (center)
        page.drawText(formatCurrency(row.rate || 0), { x: colXs[2] + 10, y, size: 12, font, color: gray });
        // Hours (center)
        page.drawText(String(row.hours || 0), { x: colXs[3] + 10, y, size: 12, font, color: gray });
        // Guards (center)
        page.drawText(String(row.guards || 0), { x: colXs[4] + 10, y, size: 12, font, color: gray });
        // Cost (right-aligned)
        const costText = formatCurrency(row.cost || 0);
        const costWidth = font.widthOfTextAtSize(costText, 12);
        page.drawText(costText, { x: colXs[5] - 10 - costWidth, y, size: 12, font, color: gray });
        // Draw only bottom border for this row (lighter gray)
        page.drawRectangle({ x: colXs[0], y: y - 8, width: colXs[5] - colXs[0], height: 1, color: borderGray });
      });
    }

    // Subtotal (bold, right, cost col)
    const subtotalY = startY - (data.rows?.length || 1) * 24 - 10;
    const subtotalLabel = 'Subtotal';
    const subtotalValue = formatCurrency(data.subtotal || 0);
    const subtotalLabelWidth = font.widthOfTextAtSize(subtotalLabel, 12);
    const subtotalValueWidth = font.widthOfTextAtSize(subtotalValue, 12);
    // Align both label and value to the right, label just left of value
    page.drawText(subtotalLabel, { x: colXs[5] - 10 - subtotalValueWidth - 12 - subtotalLabelWidth, y: subtotalY, size: 12, font, color: black });
    page.drawText(subtotalValue, { x: colXs[5] - 10 - subtotalValueWidth, y: subtotalY, size: 12, font, color: black });
    // Tax Rate (right, cost col, next row)
    // const taxY = subtotalY - 18;
    // const taxLabel = 'Tax Rate:';
    // const taxValue = '0%';
    // const taxLabelWidth = font.widthOfTextAtSize(taxLabel, 12);
    // const taxValueWidth = font.widthOfTextAtSize(taxValue, 12);
    // // page.drawText(taxLabel, { x: colXs[5] - 10 - taxValueWidth - 12 - taxLabelWidth, y: taxY, size: 12, font, color: black });
    // // page.drawText(taxValue, { x: colXs[5] - 10 - taxValueWidth, y: taxY, size: 12, font, color: black });

    // No borders for subtotal/tax rows

    // Payment terms (center, bold, 11px)
    page.drawText(`${data.paymentTerms || ''}`, { x: 305, y: 67, size: 11, font: boldFont, color: black });

    // Invoice Time Frame (12px bold) - placeholder position, user will set x,y later
    page.drawText(`${data.invoiceTimeFrame || ''}`, { x: 357, y: 243, size: 11, font: boldFont, color: black });

    return await pdfDoc.save();
  }
}

module.exports = InvoicePDFService;
