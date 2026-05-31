const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const [existing] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert User
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.userId, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };