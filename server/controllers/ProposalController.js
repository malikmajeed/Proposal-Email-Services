const Proposal = require('../models/Proposal');
const PDFService = require('../services/PDFService');

class ProposalController {
  constructor() {
    this.pdfService = new PDFService();
  }

  async generateProposal(req, res) {
    try {
      console.log('Received proposal request:', req.body);
      
      const proposal = new Proposal(req.body);
      const errors = proposal.validate();
      
      if (errors.length > 0) {
        console.log('Validation errors:', errors);
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: errors 
        });
      }

      const proposalData = proposal.calculateTotals().toJSON();
      console.log('Processing proposal for:', proposalData.name);
      
      console.log('Sending data to PDF service:', JSON.stringify(proposalData, null, 2));
      const pdfBytes = await this.pdfService.fillProposalTemplate(proposalData);
      console.log('PDF generated, size:', pdfBytes.length, 'bytes');

      // Clean the name for filename (remove special characters)
      const cleanName = proposalData.name.replace(/[^a-zA-Z0-9\s.-]/g, '').trim();
      const fileName = `${cleanName}, Proposal - BlueWolf Security.pdf`;
      console.log('Original name:', proposalData.name);
      console.log('Clean name:', cleanName);
      console.log('Final filename:', fileName);
      
      // Clear any existing headers first
      res.removeHeader('Content-Disposition');
      
      // Try a simpler approach - just use the basic filename format
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', pdfBytes.length);
      
      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        error: 'Failed to generate PDF',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}

module.exports = ProposalController;
