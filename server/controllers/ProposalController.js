const Proposal = require('../models/Proposal');
const PDFService = require('../services/PDFService');

class ProposalController {
  constructor() {
    this.pdfService = new PDFService();
  }

  async generateProposal(req, res) {
    try {
      const proposal = new Proposal(req.body);
      const errors = proposal.validate();
      
      if (errors.length > 0) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: errors 
        });
      }

      const proposalData = proposal.calculateTotals().toJSON();
      const pdfBytes = await this.pdfService.fillProposalTemplate(proposalData);
      

      const fileName = `${proposalData.name}, Proposal - BlueWolf Int'l Security.pdf`;
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${fileName}`,
        'Content-Length': pdfBytes.length,
      });
      
      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  }
}

module.exports = ProposalController;
