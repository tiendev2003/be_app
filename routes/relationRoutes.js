const express = require("express");
const {
  getAllRelation,
  createRelation,
  updateRelation,
  deleteRelation,
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

/**
 * @swagger
 * /relations/create:
 *   post:
 *     summary: Create a new relation
 *     responses:
 *       201:
 *         description: Relation created
 */
router.post("/create", createRelation);

/**
 * @swagger
 * /relation/update/{id}:
 *   put:
 *     summary: Update an existing relation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Relation updated
 */
router.put("/update/:id", updateRelation);

/**
 * @swagger
 * /relation/delete/{id}:
 *   delete:
 *     summary: Delete a relation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Relation deleted
 */
router.delete("/delete/:id", deleteRelation);

module.exports = router;