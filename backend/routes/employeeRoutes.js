const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllEmployees, createEmployee } = require('../controllers/employeeController');

router.route('/')
    .get(protect, getAllEmployees)
    .post(protect, createEmployee);

module.exports = router;