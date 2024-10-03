const express = require('express');
 const WalletReport = require('../models/walletReportModel.js');

const router = express.Router();

router.post('/wallet-report', WalletReport);

module.exports = router;