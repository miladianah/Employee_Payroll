const db = require('../config/db');

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM employee');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create employee
const createEmployee = async (req, res) => {
    const { employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode } = req.body;
    try {
        const sql = `INSERT INTO employee 
            (employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode]);
        res.status(201).json({ message: 'Employee created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllEmployees, createEmployee };