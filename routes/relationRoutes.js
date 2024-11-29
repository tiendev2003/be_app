const express = require("express");
const {
  getAllRelation,
  createRelation,
  updateRelation,
  deleteRelation,
  getAllByAdmin,
  getRelationById,
} = require("../controller/relationController.js");

const router = express.Router();

/**
 * @swagger
 * /relation/all:
 *   get:
 *     summary: Retrieve a list of relations
 *     responses:
 *       200:
 *         description: A list of relations
 */
router.get("/all", getAllRelation);
router.get("/all-admin", getAllByAdmin);
router.put("/update/:id", updateRelation);
router.post("/create", createRelation);
router.get("/:id", getRelationById);
router.delete("/delete/:id", deleteRelation);

module.exports = router;