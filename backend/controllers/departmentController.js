const db = require('../config/db');

// Get all departments
const getAllDepartments = async (req, res) => {
    try {
        // Fetch all records from the department table
        const [rows] = await db.query('SELECT * FROM department');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new department
const createDepartment = async (req, res) => {
    const { departmentCode, departmentName } = req.body;

    try {
        // Insert a new department with the provided code and name
        await db.query(
            'INSERT INTO department (departmentCode, departmentName) VALUES (?, ?)',
            [departmentCode, departmentName]
        );
        res.status(201).json({ message: 'Department created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllDepartments, createDepartment };
