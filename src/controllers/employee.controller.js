const Employee = require("../models/employee.model");
const { successResponse, errorResponse } = require("../helpers/apiResponse");
const validateEmployee = require("../helpers/validateEmployee");

/**
 * @desc    Insert a new employee
 * @route   POST /api/v1/employees
 */
const insertEmployee = async (req, res) => {
  try {
    const { isValid, errors } = validateEmployee(req.body);

    if (!isValid) {
      return errorResponse(res, "Validation failed", 400, errors);
    }

    const { name, experience, stack, designation, salary } = req.body;

    const employee = await Employee.create({
      name: name.trim(),
      experience: Number(experience),
      stack: stack.trim(),
      designation: designation.trim(),
      salary: Number(salary),
    });

    return successResponse(res, "Employee created successfully", employee, 201);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return errorResponse(res, "Validation error", 400, messages);
    }
    return errorResponse(res, "Internal server error", 500, error.message);
  }
};

/**
 * @desc    Get all employees
 * @route   GET /api/v1/employees
 */
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return successResponse(res, "Employees fetched successfully", employees);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error.message);
  }
};

/**
 * @desc    Get employee by ID
 * @route   GET /api/v1/employees/:id
 */
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return errorResponse(res, "Employee not found", 404);
    }

    return successResponse(res, "Employee fetched successfully", employee);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error.message);
  }
};

module.exports = {
  insertEmployee,
  getAllEmployees,
  getEmployeeById,
};
