const express = require("express");
const {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentReturn,
} = require("../controller/paymentController.js");
const { upload } = require("../config/uploadConfig.js");

const router = express.Router();

router.get("/return", getPaymentReturn);
router.get("/all", getPayments);
router.get("/:id", getPaymentById);
router.post("/create", upload.single("image"), createPayment);
router.put("/update", upload.single("image"), updatePayment);
router.delete("/delete", deletePayment);

module.exports = router;
