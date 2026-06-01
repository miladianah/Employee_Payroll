const db = require('../config/db');

// Get all salary records
const getAllSalaries = async (req, res) => {
    try {
        // Fetch all records from the salary table
        const [rows] = await db.query('SELECT * FROM salary');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new salary record
const createSalary = async (req, res) => {
    const { grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber } = req.body;

    try {
        // Insert a new salary record
        await db.query(
            `INSERT INTO salary (grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber) 
             VALUES (?, ?, ?, ?, ?)`,
            [grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber]
        );
        res.status(201).json({ message: 'Salary record added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing salary record by ID
const updateSalary = async (req, res) => {
    const { id } = req.params; // Get the salaryId from the URL
    const { grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber } = req.body;

    try {
        await db.query(
            `UPDATE salary 
             SET grossSalary = ?, totalDeduction = ?, netSalary = ?, monthOfPayment = ?, employeeNumber = ? 
             WHERE salaryId = ?`,
            [grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber, id]
        );
        res.json({ message: 'Salary record updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a salary record by ID
const deleteSalary = async (req, res) => {
    const { id } = req.params; // Get the salaryId from the URL

    try {
        await db.query('DELETE FROM salary WHERE salaryId = ?', [id]);
        res.json({ message: 'Salary record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllSalaries, createSalary, updateSalary, deleteSalary };
