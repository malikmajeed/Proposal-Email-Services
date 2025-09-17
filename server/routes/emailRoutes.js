const express = require('express');
const multer = require('multer');
const EmailController = require('../controllers/EmailController');

const router = express.Router();
const emailController = new EmailController();

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Send invoice email
router.post('/send-invoice-email', upload.single('pdf'), emailController.sendInvoiceEmail.bind(emailController));

module.exports = router;
