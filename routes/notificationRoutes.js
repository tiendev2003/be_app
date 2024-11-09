const express = require('express');
const { getAllNotification } = require('../controller/notificationController');
 
const router = express.Router();

router.get('/list', getAllNotification);

module.exports = router;