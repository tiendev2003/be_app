const express = require('express');
const { getAllFaq, createFaq, updateFaq, deleteFaq } = require('../controller/faqController.js');

const router = express.Router();

/**
 * @swagger
 * /faq/all:
 *   get:
 *     summary: Retrieve a list of FAQs
 *     responses:
 *       200:
 *         description: A list of FAQs
 */
router.get('/all', getAllFaq);

/**
 * @swagger
 * /faq/create:
 *   post:
 *     summary: Create a new FAQ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *     responses:
 *       201:
 *         description: FAQ created successfully
 */
router.post('/create', createFaq);

/**
 * @swagger
 * /faq/update/{id}:
 *   put:
 *     summary: Update an existing FAQ
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 */
router.put('/update/:id', updateFaq);

/**
 * @swagger
 * /faq/delete/{id}:
 *   delete:
 *     summary: Delete an FAQ
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: FAQ deleted successfully
 */
router.delete('/delete/:id', deleteFaq);

module.exports = router;