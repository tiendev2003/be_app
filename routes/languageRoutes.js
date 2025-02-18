
const express = require('express');
const { getAllLanguage, createLanguage, updateLanguage, deleteLanguage, getLanguageByAdmin, getLanguageById } = require('../controller/languageController.js');
const { upload } = require('../config/uploadConfig.js');
const router = express.Router();

router.get('/all', getAllLanguage);
router.get('/all-admin', getLanguageByAdmin);
router.get('/:id', getLanguageById);

router.post('/create', upload.single('image'), createLanguage);
router.put('/update/:id', upload.single('image'), updateLanguage);
router.delete('/delete/:id', deleteLanguage);

module.exports = router;