const express = require('express');
const ProposalController = require('../controllers/ProposalController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const proposalController = new ProposalController();

router.post('/generate-proposal', requireAuth, (req, res) => 
  proposalController.generateProposal(req, res)
);

module.exports = router;
