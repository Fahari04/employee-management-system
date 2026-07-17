'use strict';

const { Op } = require('sequelize');
const { Employee } = require('../models');

/**
 * Employee Controller
 * Handles CRUD operations and search for employees.
 */

// GET /employees
const getAllEmployees = async (req, res, next) => {
  try {
    const { search, department, role, status, page = 1, limit = 10 } = req.query;

    const where = {};
    const conditions = [];

    // Search by name, department, or role
    if (search) {
      conditions.push({
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { department: { [Op.like]: `%${search}%` } },
          { role: { [Op.like]: `%${search}%` } },
        ],
      });
    }

    // Filter by specific department
    if (department) {
      conditions.push({ department: { [Op.like]: `%${department}%` } });
    }

    // Filter by specific role
    if (role) {
      conditions.push({ role: { [Op.like]: `%${role}%` } });
    }

    // Filter by status
    if (status) {
      conditions.push({ status });
    }

    if (conditions.length > 0) {
      where[Op.and] = conditions;
    }

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const { count, rows: employees } = await Employee.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit, 10),
      offset,
    });

    res.json({
      success: true,
      data: {
        employees,
        pagination: {
          total: count,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalPages: Math.ceil(count / parseInt(limit, 10)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /employees/:id
const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found.`,
      });
    }

    res.json({
      success: true,
      data: { employee },
    });
  } catch (error) {
    next(error);
  }
};

// POST /employees
const createEmployee = async (req, res, next) => {
  try {
    const { name, email, department, role, status } = req.body;

    const employee = await Employee.create({
      name,
      email,
      department,
      role,
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully.',
      data: { employee },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /employees/:id
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, department, role, status } = req.body;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found.`,
      });
    }

    await employee.update({
      name: name ?? employee.name,
      email: email ?? employee.email,
      department: department ?? employee.department,
      role: role ?? employee.role,
      status: status ?? employee.status,
    });

    res.json({
      success: true,
      message: 'Employee updated successfully.',
      data: { employee },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /employees/:id
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found.`,
      });
    }

    await employee.destroy();

    res.json({
      success: true,
      message: 'Employee deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
