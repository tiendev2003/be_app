const express = require('express');
const { getPlanPurchaseHistory } = require('../controller/planPurchaseController.js');
 
const router = express.Router();

router.get('/plan-purchase-history', getPlanPurchaseHistory);

module.exports = router;