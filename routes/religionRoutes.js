const express = require("express");
const {
  getAllReligion,
  createReligion,
  updateReligion,
  deleteReligion,
} = require("../controller/religionController.js");

const router = express.Router();

router.get("/all", getAllReligion);
router.post("/create", createReligion);
router.put("/update/:id", updateReligion);
router.delete("/delete/:id", deleteReligion);

module.exports = router;