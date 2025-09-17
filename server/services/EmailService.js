const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

class EmailService {
  constructor() {
    this.templatePath = path.join(__dirname, '../template', 'invoice-email.html');
    
    this.transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'info@bwisecurity.com',
        pass: 'Bluewolf23$'
      }
    });
  }

  async loadEmailTemplate() {
    try {
      const templateContent = await fs.readFile(this.templatePath, 'utf8');
      return handlebars.compile(templateContent);
    } catch (error) {
      console.error('Error loading email template:', error);
      throw new Error('Failed to load email template');
    }
  }

  async sendInvoiceEmail(emailData) {
    try {
      console.log('Starting email send process...');
      console.log('Email data:', {
        email: emailData.email || emailData.clientEmail,
        clientName: emailData.clientName,
        amount: emailData.amount,
        invoiceNo: emailData.invoiceNo,
        attachments: emailData.attachments?.length || 0
      });

      const template = await this.loadEmailTemplate();
      
      // Prepare template data
      const templateData = {
        InvoiceNumber: emailData.invoiceNo || 'N/A',
        'client-name': emailData.clientName || 'N/A',
        Amount: this.formatCurrency(emailData.amount || emailData.subtotal || 0),
        InvoiceTimeFrame: emailData.invoiceTimeFrame || emailData.description || 'Security Guard Services',
        InvoiceLink: emailData.downloadUrl || '#',
        DueDate: emailData.dueDate || 'N/A'
      };

      console.log('Template data prepared:', templateData);

      // Generate HTML content
      const htmlContent = template(templateData);

      // Email options
      const mailOptions = {
        from: 'info@bwisecurity.com',
        to: emailData.clientEmail || emailData.email,
        subject: `Invoice ${emailData.invoiceNo || ''} - BlueWolf International Security`,
        html: htmlContent,
        attachments: emailData.attachments || []
      };

      console.log('Mail options prepared:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        attachmentsCount: mailOptions.attachments.length
      });

      // Send email
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Invoice email sent successfully'
      };

    } catch (error) {
      console.error('Error sending email:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response
      });
      return {
        success: false,
        error: error.message,
        message: 'Failed to send invoice email'
      };
    }
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
}

module.exports = EmailService;
