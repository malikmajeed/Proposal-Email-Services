const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

async function fillProposalTemplateWithFormData(data) {
  const templatePath = path.join(__dirname, 'template', 'Security Service Proposal .pdf');
  const existingPdfBytes = await fs.readFile(templatePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Page 1: Name & Company
  if (pages[0]) {
    pages[0].drawText(`${data.title || ''} ${data.name || ''}`, {
      x: 40.147, y: 159.264, size: 16, font: boldFont,color: rgb(1, 1, 1)
    });
    pages[0].drawText(`${data.address || ''}`, {
      x: 40.145, y: 129.589, size: 16, font, color: rgb(1, 1, 1)
    });
    // pages[0].drawText(`${data.address || ''}`, {
    //   x: 100, y: 660, size: 12, font, color: rgb(0, 0, 0)
    // });
    // pages[0].drawText(`Email: ${data.email || ''}`, {
    //   x: 100, y: 640, size: 12, font, color: rgb(0, 0, 0)
    // });
    // pages[0].drawText(`Contact: ${data.contact || ''}`, {
    //   x: 100, y: 620, size: 12, font, color: rgb(0, 0, 0)
    // });
  }

  // Page 4: Payment Terms, Termination, Note
  if (pages[3]) {
    pages[3].drawText(` ${data.paymentTerms || ''}`, {
      x: 508, y: 655,   size: 14, font, color: rgb(0, 0, 0)
    });
    pages[3].drawText(`${data.termination || ''}`, {
      x: 358, y: 435, size: 14, font, color: rgb(0, 0, 0)
    });
    pages[1].drawText(`Note: ${data.note || ''}`, {
      x: 100, y: 660, size: 12, font, color: rgb(0, 0, 0)
    }
  );
  }

  // Page 3: Services Table
  // if (pages[2] && Array.isArray(data.services)) {
  //   let y = 221.226;
  //   data.services.forEach((service, idx) => {
  //     pages[2].drawText(
  //       `${idx + 1}. ${service.service} | Rate: $${service.hourlyRate} | Guards: ${service.guards} | Total: $${service.totalCost}`,
  //       { x: 120, y, size: 12, font, color: rgb(0, 0, 0) }
  //     );
  //     y -= 20;
  //   });
  // }
  if (pages[2] && Array.isArray(data.services)) {
    let y = 230;
  
    data.services.forEach((service, idx) => {
      pages[2].drawText(String(idx + 1), { x: 135, y, size: 12, font, color: rgb(0, 0, 0) });
      pages[2].drawText(service.service, { x: 180, y, size: 12, font, color: rgb(0, 0, 0) });
      pages[2].drawText(String(`${'$'+service.hourlyRate}`), { x: 335, y, size: 12, font, color: rgb(0, 0, 0) });
      pages[2].drawText(String(`${'$'+service.hours}`), { x: 390, y, size: 12, font, color: rgb(0, 0, 0) });
      pages[2].drawText(String(service.guards), { x: 460, y, size: 12, font, color: rgb(0, 0, 0) });
      pages[2].drawText(String(`${'$'+service.totalCost}`), { x: 510, y, size: 12, font, color: rgb(0, 0, 0) });
  
      y -= 20; // move down for the next row
    });
  }
  


  // Page 5: Agreement page
  if (pages[5]) {
    pages[5].drawText(`${data.title || ''} ${data.name || ''}`, {
      x: 117.5, y: 488, size: 14, font, color: rgb(0, 0, 0)
    });
    pages[5].drawText(`${data.company || ''}`, {
      x: 361.5, y: 488, size: 14, font, color: rgb(0, 0, 0)
    });
    pages[5].drawText(`${data.email || ''}`, {
      x: 117.5, y: 454, size: 14, font, color: rgb(0, 0, 0)
    });
    pages[5].drawText(` ${data.contact || ''}`, {
      x: 361.5, y: 454, size: 14, font, color: rgb(0, 0, 0)
    });
    pages[5].drawText(`${data.company || ''}`, {
      x: 425, y: 385, size: 14, font, color: rgb(0, 0, 0)
    });
  }

  return await pdfDoc.save();
}

module.exports = { fillProposalTemplateWithFormData };
