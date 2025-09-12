const { fillProposalTemplateWithFormData } = require('./pdfService');

async function generateProposal(req, res) {
  try {
    const pdfBytes = await fillProposalTemplateWithFormData(req.body);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="proposal.pdf"',
      'Content-Length': pdfBytes.length,
    });
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

module.exports = { generateProposal };
