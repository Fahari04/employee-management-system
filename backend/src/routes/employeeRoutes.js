'use strict';

const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

const router = express.Router();

// All employee routes require authentication
router.use(authenticate);

/**
 * GET /employees
 * List all employees (with optional search/filter)
 */
router.get('/', getAllEmployees);

/**
 * GET /employees/:id
 * Get a single employee by ID
 */
router.get('/:id', getEmployeeById);

/**
 * POST /employees
 * Create a new employee
 */
router.post(
  '/',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters.'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.'),
    body('department')
      .trim()
      .notEmpty()
      .withMessage('Department is required.'),
    body('role')
      .trim()
      .notEmpty()
      .withMessage('Role is required.'),
    body('status')
      .optional()
      .isIn(['active', 'inactive', 'on_leave'])
      .withMessage('Status must be one of: active, inactive, on_leave.'),
  ],
  validate,
  createEmployee
);

/**
 * PUT /employees/:id
 * Update an existing employee
 */
router.put(
  '/:id',
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters.'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.'),
    body('department')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Department cannot be empty.'),
    body('role')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Role cannot be empty.'),
    body('status')
      .optional()
      .isIn(['active', 'inactive', 'on_leave'])
      .withMessage('Status must be one of: active, inactive, on_leave.'),
  ],
  validate,
  updateEmployee
);

/**
 * DELETE /employees/:id
 * Delete an employee
 */
router.delete('/:id', deleteEmployee);

module.exports = router;
