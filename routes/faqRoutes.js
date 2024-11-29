const express = require("express");
const {
  getAllFaq,
  createFaq,
  updateFaq,
  deleteFaq,
  getFaqByAdmin,
  getFaqById,
} = require("../controller/faqController.js");
 
const router = express.Router();

router.get("/all", getAllFaq);
router.get("/all-admin", getFaqByAdmin);
router.get("/:id", getFaqById);
router.post("/create", createFaq);
router.put("/update/:id", updateFaq);
router.delete("/delete/:id", deleteFaq);

module.exports = router;
