const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllSalaries, createSalary, updateSalary, deleteSalary } = require('../controllers/salaryController');

router.route('/')
    .get(protect, getAllSalaries)
    .post(protect, createSalary);

// NEW: Route for updating a specific salary by ID
router.route('/:id')
    .put(protect, updateSalary)
    .delete(protect, deleteSalary);

module.exports = router;