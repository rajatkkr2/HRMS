const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Employee = require("../src/models/employee.model");
const { successResponse, errorResponse } = require("../src/helpers/apiResponse");
const validateEmployee = require("../src/helpers/validateEmployee");

const app = express();

// Connect to MongoDB (cached connection for serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB connection before every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Health check
app.get("/", (req, res) => {
  res.json({ message: "HRMS API is running" });
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Insert employee
app.post("/api/v1/employees", async (req, res) => {
  try {
    const { isValid, errors } = validateEmployee(req.body);
    if (!isValid) return errorResponse(res, "Validation failed", 400, errors);

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
});

// Get all employees
app.get("/api/v1/employees", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return successResponse(res, "Employees fetched successfully", employees);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error.message);
  }
});

// Get employee by ID
app.get("/api/v1/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return errorResponse(res, "Employee not found", 404);
    return successResponse(res, "Employee fetched successfully", employee);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error.message);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong" });
});

module.exports = app;
