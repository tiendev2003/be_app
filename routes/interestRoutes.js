const express=require('express');
const { getAllInterest, createInterest, updateInterest, deleteInterest } = require('../controller/interestController.js');
const { upload } = require('../config/uploadConfig.js');
 
 

const router=express.Router();

router.get('/all',getAllInterest);
router.post('/create',upload.single('image'),createInterest);
router.put('/update/:id',upload.single('image'),updateInterest);
router.delete('/delete/:id',deleteInterest);

module.exports=router;