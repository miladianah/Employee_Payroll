const db = require('../config/db');

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        // Fetch all records from the employee table
        const [rows] = await db.query('SELECT * FROM employee');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new employee
const createEmployee = async (req, res) => {
    const {
        employeeNumber, firstName, lastName,
        address, position, telephone,
        gender, hiredDate, departmentCode
    } = req.body;

    try {
        // Insert a new employee with all the required fields
        await db.query(
            `INSERT INTO employee 
            (employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode]
        );
        res.status(201).json({ message: 'Employee created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllEmployees, createEmployee };
