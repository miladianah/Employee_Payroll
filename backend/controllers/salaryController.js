const db = require('../config/db');

// Get all salaries
const getAllSalaries = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM salary');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create salary record
const createSalary = async (req, res) => {
    const { grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber } = req.body;
    try {
        const sql = `INSERT INTO salary (grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber) 
                     VALUES (?, ?, ?, ?, ?)`;
        await db.query(sql, [grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber]);
        res.status(201).json({ message: 'Salary record added' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: Update salary record
const updateSalary = async (req, res) => {
    const { id } = req.params; // salaryId from URL
    const { grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber } = req.body;

    try {
        const sql = `UPDATE salary 
                     SET grossSalary = ?, totalDeduction = ?, netSalary = ?, monthOfPayment = ?, employeeNumber = ? 
                     WHERE salaryId = ?`;
        await db.query(sql, [grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber, id]);
        res.json({ message: 'Salary record updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete salary record
const deleteSalary = async (req, res) => {
    const { id } = req.params; // salaryId from URL
    try {
        await db.query('DELETE FROM salary WHERE salaryId = ?', [id]);
        res.json({ message: 'Salary record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllSalaries, createSalary, updateSalary, deleteSalary };