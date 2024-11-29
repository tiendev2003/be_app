const express=require('express');
const { getAllPage, createPlan, updatePlan, deletePlan, getPlanByAdmin, getPlanById } = require('../controller/planController')
const router=express.Router();

router.get('/all',getAllPage);
router.get('/all-admin',getPlanByAdmin);
router.get('/:id',getPlanById);
router.post('/create',createPlan);
router.put('/update/:id',updatePlan);
router.delete('/delete/:id',deletePlan);
 

module.exports=router;