const express = require('express');
const { register, login, loginSocial, checkMobile, loginAdmin } = require('../controller/authController');
const { upload } = require('../config/uploadConfig');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               otherpic:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', upload.array('otherpic', 7), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/login-social:
 *   post:
 *     summary: Social login for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully via social login
 */
router.post('/login-social', loginSocial);

/**
 * @swagger
 * /auth/check-mobile:
 *   post:
 *     summary: Check if a mobile number is registered
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mobile number checked successfully
 */
router.post('/check-mobile', checkMobile);
router.post('/login-admin', loginAdmin);

module.exports = router;