const InvoicePDFService = require('../services/InvoicePDFService');

const invoicePDFService = new InvoicePDFService();

const generateInvoice = async (req, res) => {
  try {
    const pdfBytes = await invoicePDFService.fillInvoiceTemplate(req.body);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Invoice-BlueWolf.pdf"',
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate invoice PDF', error: err.message });
  }
};

module.exports = { generateInvoice };
