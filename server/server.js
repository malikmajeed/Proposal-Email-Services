const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const proposalRoutes = require('./routes/proposalRoutes');
const authRoutes = require('./routes/authRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const emailRoutes = require('./routes/emailRoutes');
require('dotenv').config();

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
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Use routes
app.use('/api', authRoutes);
app.use('/api', proposalRoutes);
app.use('/api', invoiceRoutes);
app.use('/api', emailRoutes);

// Routes
app.post('/api/send-invoice', upload.single('pdf'), async (req, res) => {
  try {
    const { clientName, invoiceNumber, amount, dueDate, clientEmail } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }
    
    const mailOptions = {
      from: '"BlueWolf Security" <info@bwisecurity.com>',
      to: clientEmail,
      subject: `Invoice #${invoiceNumber} - BlueWolf Int'l Security`,
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