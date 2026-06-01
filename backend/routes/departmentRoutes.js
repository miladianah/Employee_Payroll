const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllDepartments, createDepartment } = require('../controllers/departmentController');

// GET /api/departments - Get all departments (protected)
router.get('/', protect, getAllDepartments);

// POST /api/departments - Create a new department (protected)
router.post('/', protect, createDepartment);

module.exports = router;
