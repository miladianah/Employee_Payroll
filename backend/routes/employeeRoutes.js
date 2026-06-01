const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllEmployees, createEmployee } = require('../controllers/employeeController');

// GET /api/employees - Get all employees (protected)
router.get('/', protect, getAllEmployees);

// POST /api/employees - Create a new employee (protected)
router.post('/', protect, createEmployee);

module.exports = router;
