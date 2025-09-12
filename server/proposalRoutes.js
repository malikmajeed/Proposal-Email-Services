const express = require('express');
const { generateProposal } = require('./proposalController');

const router = express.Router();

router.post('/api/generate-proposal', generateProposal);

module.exports = router;
