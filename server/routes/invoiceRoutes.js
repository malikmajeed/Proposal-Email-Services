const express = require('express');
const router = express.Router();
const { generateInvoice } = require('../controllers/InvoiceController');

router.post('/api/generate-invoice', generateInvoice);

module.exports = router;
