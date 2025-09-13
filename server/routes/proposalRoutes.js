const express = require('express');
const ProposalController = require('../controllers/ProposalController');

const router = express.Router();
const proposalController = new ProposalController();

router.post('/api/generate-proposal', (req, res) => 
  proposalController.generateProposal(req, res)
);

module.exports = router;
