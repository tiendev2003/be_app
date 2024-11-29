const express=require('express');
const { getAllInterest, createInterest, updateInterest, deleteInterest, getInterestById, getInterestByAdmin } = require('../controller/interestController.js');
const { upload } = require('../config/uploadConfig.js');
  
 

const router=express.Router();

router.get('/all',getAllInterest);
router.get('/all-admin',getInterestByAdmin);
router.get('/:id',getInterestById);
router.post('/create',upload.single('image'),createInterest);
router.put('/update/:id',upload.single('image'),updateInterest);
router.delete('/delete/:id',deleteInterest);

module.exports=router;