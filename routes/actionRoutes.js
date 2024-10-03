const express = require('express');
const { getListLikeMe, toggleLike, mapInfores, matchUser, getPassedUser, getListBlockMe, getListFavorite, unblockUser ,unLikeUser, blockUser, filterUser, getHomePage, viewProfile, getProfileInfores,blockProfile} = require('../controller/actionController.js');
const router = express.Router();

 
router.post('/list-like-me', getListLikeMe);
router.post('/toggle-like', toggleLike);
router.post('/map-data', mapInfores);
router.post('/match-user', matchUser);
router.post('/list-passed', getPassedUser);
router.post('/list-block', getListBlockMe);
router.post('/list-favorite', getListFavorite);
router.post('/unblock-user',  unblockUser);
router.post('/unlike',unLikeUser)
router.post('/block-user',blockUser)
router.post('/filter-user',filterUser)
router.post('/home-page',getHomePage)
router.post('/view-profile',viewProfile)
router.post('/infor-profile',getProfileInfores)
router.post('/block-profile',blockProfile)

module.exports = router;