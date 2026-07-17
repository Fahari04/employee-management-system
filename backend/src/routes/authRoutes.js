'use strict';

const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const { validate } = require('../middleware/validate');

const router = express.Router();

/**
 * POST /auth/register
 * Register a new user
 */
router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be between 3 and 50 characters.'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.'),
  ],
  validate,
  register
);

/**
 * POST /auth/login
 * Login and receive JWT token
 */
router.post(
  '/login',
  [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required.'),
    body('password')
      .notEmpty()
      .withMessage('Password is required.'),
  ],
  validate,
  login
);

module.exports = router;
