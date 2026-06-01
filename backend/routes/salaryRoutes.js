const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getAllSalaries,
    createSalary,
    updateSalary,
    deleteSalary
} = require('../controllers/salaryController');

// GET /api/salaries - Get all salary records (protected)
router.get('/', protect, getAllSalaries);

// POST /api/salaries - Create a new salary record (protected)
router.post('/', protect, createSalary);

// PUT /api/salaries/:id - Update a salary record by ID (protected)
router.put('/:id', protect, updateSalary);

// DELETE /api/salaries/:id - Delete a salary record by ID (protected)
router.delete('/:id', protect, deleteSalary);

module.exports = router;
