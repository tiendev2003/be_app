const express = require('express');
const { getAllPage, createPage, updatePage, deletePage } = require('../controller/pageController.js');
const { upload } = require('../config/uploadConfig.js');
const router = express.Router();

router.get('/all', getAllPage);
router.post('/create',createPage);
router.put('/update/:id',updatePage);
router.delete('/delete/:id',deletePage);

module.exports = router;