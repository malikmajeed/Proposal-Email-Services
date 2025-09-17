const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

async function testTemplate() {
  try {
    const templatePath = path.join(__dirname, 'template', 'invoice-email.html');
    const templateContent = await fs.readFile(templatePath, 'utf8');
    const template = handlebars.compile(templateContent);
    
    const testData = {
      InvoiceNumber: 'INV-2024-001',
      'client-name': 'Test Client',
      Amount: '$100.00',
      InvoiceTimeFrame: 'Test Service',
      InvoiceLink: '#',
      DueDate: 'January 15, 2024'
    };
    
    console.log('Test data:', testData);
    
    const htmlContent = template(testData);
    
    console.log('Generated HTML contains InvoiceNumber placeholder:', htmlContent.includes('{{InvoiceNumber}}'));
    console.log('Generated HTML contains actual invoice number:', htmlContent.includes('INV-2024-001'));
    
    // Check specific line
    const lines = htmlContent.split('\n');
    const invoiceLine = lines.find(line => line.includes('Invoice #'));
    console.log('Invoice line:', invoiceLine);
    
  } catch (error) {
    console.error('Error testing template:', error);
  }
}

testTemplate();

