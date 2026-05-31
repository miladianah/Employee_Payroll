const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllDepartments, createDepartment } = require('../controllers/departmentController');

router.route('/')
    .get(protect, getAllDepartments)
    .post(protect, createDepartment);

module.exports = router;