const express = require('express');
const { updateUser, infoUser, forgotPassword, deleteAccount, referUser, userLastAvailable, uploadProfileImage,indentifyProfile} = require('../controller/userController.js');

const router = express.Router();

router.post('/update',updateUser)
router.post('/infor',infoUser)
router.post('/forgot-pass',forgotPassword)
router.post('/delete-account',deleteAccount)
router.post('/refer-friend',referUser)
router.post('/uploads-image-profiles',uploadProfileImage)
router.post('/last-available',userLastAvailable)
router.post('/identify-profile',indentifyProfile)
module.exports = router;
