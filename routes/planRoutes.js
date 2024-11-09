const express=require('express');
const { getAllPage, createPlan, updatePlan, deletePlan } = require('../controller/planController')
const router=express.Router();

router.get('/all',getAllPage);
router.post('/create',createPlan);
router.put('/update/:id',updatePlan);
router.delete('/delete/:id',deletePlan);
 

module.exports=router;