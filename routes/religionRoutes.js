const express = require("express");
const {
  getAllReligion,
  createReligion,
  updateReligion,
  deleteReligion,
  getReligionById,
  getAllByAdmin,
} = require("../controller/religionController.js");

const router = express.Router();

router.get("/all", getAllReligion);
router.get("/all-admin", getAllByAdmin);
router.post("/create", createReligion);
router.put("/update/:id", updateReligion);
router.get("/:id", getReligionById);
router.delete("/delete/:id", deleteReligion);

module.exports = router;