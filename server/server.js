const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const proposalRoutes = require('./routes/proposalRoutes');
const authRoutes = require('./routes/authRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://10.255.143.89:5173'],
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Email configuration (using a test configuration - replace with your SMTP settings)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Replace with your SMTP host
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Use routes
app.use(authRoutes);
app.use(proposalRoutes);
app.use(invoiceRoutes);

// Routes
app.post('/api/send-invoice', upload.single('pdf'), async (req, res) => {
  try {
    const { clientName, invoiceNumber, amount, dueDate, clientEmail } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: clientEmail,
      subject: `Invoice #${invoiceNumber} - $${amount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Invoice</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear ${clientName},</p>
            
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              I hope this email finds you well. Please find attached invoice #${invoiceNumber} for the amount of $${amount}.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0;">Invoice Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Invoice Number:</td>
                  <td style="padding: 8px 0; color: #333;">#${invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Amount:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 18px; font-weight: bold;">$${amount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Due Date:</td>
                  <td style="padding: 8px 0; color: #e74c3c; font-weight: bold;">${new Date(dueDate).toLocaleDateString()}</td>
                </tr>
              </table>
            </div>
            
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              Payment is due by ${new Date(dueDate).toLocaleDateString()}. Please don't hesitate to contact us if you have any questions regarding this invoice.
            </p>
            
            <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 25px;">
              Thank you for your business!
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #333; font-weight: bold; margin: 0;">Best regards,</p>
              <p style="color: #666; margin: 5px 0 0 0;">Your Team</p>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `invoice-${invoiceNumber}.pdf`,
          path: req.file.path
        }
      ]
    };
    
    await transporter.sendMail(mailOptions);
    
    // Clean up uploaded file
    await fs.unlink(req.file.path);
    
    res.json({ message: 'Invoice sent successfully' });
  } catch (error) {
    console.error('Error sending invoice:', error);
    
    // Clean up file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }
    
    res.status(500).json({ error: 'Failed to send invoice' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'PDF Management System API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Make sure to set EMAIL_USER and EMAIL_PASS environment variables for email functionality');
});