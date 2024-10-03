const express = require("express");
const {
  getSetting,
  updateSetting,
} = require("../controller/settingController");
const { upload } = require("../config/uploadConfig");

const router = express.Router();

router.get("/all", getSetting);
router.post("/update/:id", upload.single("image"), updateSetting);

module.exports = router;