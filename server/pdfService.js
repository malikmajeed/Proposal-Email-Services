const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

function formatLongDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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

  // Page 3: Services Table
  if (pages[2] && Array.isArray(data.services)) {
    let y = 230;
  
    data.services.forEach((service, idx) => {
      pages[2].drawText(String(idx + 1), { x: 135, y, size: 12, font, color: rgb(0, 0, 0) });
      pages[2].drawText(service.service, { x: 180, y, size: 12, font, color: rgb(0, 0, 0) });
      pages[2].drawText(String(`${'$'+Number(service.hourlyRate).toFixed(2)}`), { x: 335, y, size: 12, font, color: rgb(0, 0, 0) });
      pages[2].drawText(String(`${service.hours}`), { x: 390, y, size: 12, font, color: rgb(0, 0, 0) });
      pages[2].drawText(String(service.guards), { x: 460, y, size: 12, font, color: rgb(0, 0, 0) });
      pages[2].drawText(String(`${'$'+Number(service.totalCost).toFixed(2)}`), { x: 510, y, size: 12, font, color: rgb(0, 0, 0) });
  
      y -= 20; // move down for the next row
    });
    pages[2].drawText(`Note: ${data.note || ''}`, {
      x: 130, y: y-30, size: 12, font, color: rgb(0, 0, 0)
    }
  );
  }
  
  // Page 4: Payment Terms, Termination, Note
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
