const EmailService = require('../services/EmailService');
const InvoicePDFService = require('../services/InvoicePDFService');

class EmailController {
  constructor() {
    this.emailService = new EmailService();
    this.invoicePDFService = new InvoicePDFService();
  }

  async sendInvoiceEmail(req, res) {
    try {
      console.log('=== EMAIL CONTROLLER DEBUG ===');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      const { email, clientName, amount, description, invoiceNumber } = req.body;
      const pdfFile = req.file;

      console.log('Extracted fields:');
      console.log('- email:', email);
      console.log('- clientName:', clientName);
      console.log('- amount:', amount);
      console.log('- description:', description);
      console.log('- invoiceNumber:', invoiceNumber);

      // Validate required fields
      if (!email || !clientName || !amount || !invoiceNumber) {
        console.log('Validation failed - missing required fields');
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: email, clientName, amount, and invoiceNumber are required'
        });
      }

      if (!pdfFile) {
        return res.status(400).json({
          success: false,
          message: 'PDF file is required'
        });
      }

      // Prepare email data with simplified template data
      const emailData = {
        email,
        clientName,
        amount: parseFloat(amount) || 0,
        description: description || 'Security Guard Services',
        invoiceNo: invoiceNumber, // Use provided invoice number
        subtotal: parseFloat(amount) || 0,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        invoiceTimeFrame: description || 'Security Guard Services',
        downloadUrl: '#',
        attachments: [{
          filename: `Invoice-${invoiceNumber}.pdf`,
          path: pdfFile.path,
          contentType: 'application/pdf'
        }]
      };

      console.log('Email data prepared:');
      console.log('- emailData.invoiceNo:', emailData.invoiceNo);
      console.log('- emailData.clientName:', emailData.clientName);
      console.log('- emailData.amount:', emailData.amount);

      // Send email
      const result = await this.emailService.sendInvoiceEmail(emailData);

      // Clean up uploaded file
      if (pdfFile && pdfFile.path) {
        const fs = require('fs').promises;
        try {
          await fs.unlink(pdfFile.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }

      if (result.success) {
        res.json({
          success: true,
          message: 'Invoice email sent successfully',
          messageId: result.messageId
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }

    } catch (error) {
      console.error('Error in sendInvoiceEmail:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = EmailController;
