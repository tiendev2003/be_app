const express = require("express");
const {
  updateUser,
  infoUser,
  forgotPassword,
  deleteAccount,
  referUser,
  userLastAvailable,
  uploadProfileImage,
  indentifyProfile,
  getAllUsers,
  getProfileInfores,
} = require("../controller/userController.js");
const { upload } = require("../config/uploadConfig.js");

const router = express.Router();

router.get("/all",  getAllUsers);
router.get("/information/:id",  getProfileInfores);

router.post("/update", upload.array("otherpic", 10), updateUser);
router.post("/infor", infoUser);
router.post("/forgot-pass", forgotPassword);
router.post("/delete-account", deleteAccount);
router.post("/refer-friend", referUser);
router.post(
  "/uploads-image-profiles",
  upload.single("image"),
  uploadProfileImage
);
router.post("/last-available", userLastAvailable);
router.post("/identify-profile", indentifyProfile);
module.exports = router;
