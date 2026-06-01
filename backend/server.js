const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Import route files
const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const salaryRoutes = require('./routes/salaryRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();

// ========== MIDDLEWARE ==========

// Allow cross-origin requests (frontend can talk to backend)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// ========== ROUTES ==========

// Auth routes (register/login) - no token required
app.use('/api/auth', authRoutes);

// Protected routes - require a valid JWT token
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/salaries', salaryRoutes);

// ========== START SERVER ==========

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
