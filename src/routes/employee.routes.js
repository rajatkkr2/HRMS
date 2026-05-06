const express = require("express");
const router = express.Router();
const {
  insertEmployee,
  getAllEmployees,
  getEmployeeById,
} = require("../controllers/employee.controller");

router.post("/", insertEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);

module.exports = router;
